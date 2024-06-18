import {multicall} from "@wagmi/core";
import {useQuery} from "@tanstack/react-query";
import {BigNumber, Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import FarmsAbi from "@src/global/contracts/Farms.json";
import LpAbi from "@src/global/contracts/LP.json";
import {Address, ContractFunctionParameters, erc20Abi} from "viem";
import {DerivedFarm, FarmState, MapiFarm, MapiPairFarm} from "@dex/farms/constants/types";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";
import {ApiService} from "@src/core/services/api-service";
import {round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import {wagmiConfig} from "@src/wagmi";
import useCurrencyBroker from "@market/hooks/use-currency-broker";
import {Block} from "@ethersproject/abstract-provider";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export function getFarmsUsingChain() {
  const query = async () => {
    const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
    const poolLength = await readContract.poolLength();

    const poolInfo = await multicall(wagmiConfig as any, {
      contracts: [...Array(parseInt(poolLength)).fill(0)].map((_, i) => (
        {
          address: config.contracts.farms,
          abi: FarmsAbi as any,
          functionName: 'poolInfo',
          args: [i],
        }
      )),
    });

    const lpAddresses = poolInfo.slice(1).map((pool: any) => {
      const [lpToken] = pool.result;
      return lpToken
    });

    const lpTokenInfo = await multicall(wagmiConfig as any, {
      contracts: lpAddresses.reduce((acc: ContractFunctionParameters[], address: string) => {
        acc.push({
          address: address as Address,
          abi: LpAbi as any,
          functionName: 'token0',
        });
        acc.push({
          address: address as Address,
          abi: LpAbi as any,
          functionName: 'token1',
        });
        return acc;
      }, []),
    });

    const uniqueTokenAddresses = Array.from(new Set(lpTokenInfo.map((info: any) => info.result)));

    const tokenInfo = await multicall(wagmiConfig as any, {
      contracts: uniqueTokenAddresses.map((address: string) => ({
        address: address as Address,
        abi: erc20Abi as any,
        functionName: 'symbol',
      })),
    });

    // map token address to symbol with address as key
    const tokenInfoMap = tokenInfo.reduce((acc: any, info: any, i: number) => {
      acc[uniqueTokenAddresses[i]] = info.result;
      return acc;
    }, {});

    const data = poolInfo.slice(1).map((pool: any, i: number) => {
      const token0Address = lpTokenInfo[i * 2].result as string;
      const token1Address = lpTokenInfo[i * 2 + 1].result as string;
      return {
        lpAddress: pool.result[0],
        token0: {
          address: token0Address,
          name: tokenInfoMap[token0Address],
        },
        token1: {
          address: token1Address,
          name: tokenInfoMap[token1Address],
        }
      };
    });

    return mapToDataTableType(data);
  }

  const { data } = useQuery({
    queryKey: ['getFarmsUsingChain'],
    queryFn: query,
  })

  return data;
}

export function getFarmsUsingMapi(queryParams: FarmsQueryParams) {
  const { getByAddress } = useCurrencyBroker();

  const query = async () => {
    const data = await ApiService.withoutKey().getFarms(queryParams);

    return await Promise.all(data
      .filter((farm: MapiFarm) => farm.pid !== 0 || (farm.pair !== undefined && farm.pair !== null))
      .map(async (farm: MapiFarm): Promise<DerivedFarm> => {
        const pairFarm: MapiPairFarm = farm as MapiPairFarm;

        const lpBalance = BigNumber.from(pairFarm.lpBalance);
        const derivedUSD = pairFarm.pair.derivedUSD ?? '0';
        const derivedUSDBigNumber = ethers.utils.parseUnits(derivedUSD, 18);
        const totalDollarValue = lpBalance.mul(derivedUSDBigNumber).div(ethers.constants.WeiPerEther);
        const stakedLiquidity = ethers.utils.formatUnits(totalDollarValue, 18);
        const totalAllocPoints = pairFarm.rewarders.reduce((acc, rewarder) => acc + rewarder.allocPoint, 0);
        const farmState = totalAllocPoints > 0 ? FarmState.ACTIVE : FarmState.FINISHED;

        const dailyRewards = await Promise.all(
          pairFarm.rewarders
            .filter((rewarder) => pairFarm.rewarders.length === 1 || (!rewarder.isMain || rewarder.allocPoint > 0))
            .map(async (rewarder) => {
              const token = getByAddress(rewarder.token);
              if (!token) {
                throw new Error(`Token not found for rewarder address: ${rewarder.token}`);
              }

              const rewardPerDay = !isNaN(parseInt(rewarder.rewardPerDay)) ? rewarder.rewardPerDay : '0';
              const amount = commify(round(ethers.utils.formatUnits(rewardPerDay, token.decimals)));

              return {
                rewarder,
                token,
                amount
              };
            })
        );

        return {
          data: pairFarm,
          derived: {
            name: pairFarm.pair.name,
            dailyRewards: dailyRewards,
            stakedLiquidity: `$${commify(round(stakedLiquidity))}`,
            apr: `${['Infinity', 'NaN'].includes(pairFarm.apr) ? '-' : `${commify(round(pairFarm.apr, 2))}%`}`,
            state: farmState
          }
        }
    }));
  }

  return useQuery({
    queryKey: ['getFarmsUsingMapi', queryParams],
    queryFn: query,
  });
}

function mapToDataTableType(data: any) {
  return data.map((item: any) => {
    return {
      name: `}`,
      token0: item.token0.name,
      token1: item.token1.name,
    }
  })
}
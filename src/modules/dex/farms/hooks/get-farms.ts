import {multicall} from "@wagmi/core";
import {useQuery} from "@tanstack/react-query";
import {BigNumber, Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import FarmsAbi from "@src/global/contracts/Farms.json";
import LpAbi from "@src/global/contracts/LP.json";
import {Address, erc20ABI} from "wagmi";
import {ContractFunctionConfig} from "viem";
import {DerivedFarm, FarmState, MapiFarm, MapiPairFarm} from "@dex/farms/constants/types";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";
import {ApiService} from "@src/core/services/api-service";
import {round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export function getFarmsUsingChain() {
  const query = async () => {
    const readContract = new Contract(config.contracts.farms, FarmsAbi, readProvider);
    const poolLength = await readContract.poolLength();

    const poolInfo = await multicall({
      contracts: [...Array(parseInt(poolLength)).fill(0)].map((_, i) => (
        {
          address: config.contracts.farms as Address,
          abi: FarmsAbi as any,
          functionName: 'poolInfo',
          args: [i],
        }
      )),
    });

    console.log('DEBUG==+DATA', poolInfo);

    const lpAddresses = poolInfo.slice(1).map((pool: any) => {
      const [lpToken] = pool.result;
      return lpToken
    });

    console.log('DEBUG==+lpAddresses', lpAddresses);

    const lpTokenInfo = await multicall({
      contracts: lpAddresses.reduce((acc: ContractFunctionConfig[], address: string) => {
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

    console.log('DEBUG==+LPINFO', lpTokenInfo);

    const uniqueTokenAddresses = Array.from(new Set(lpTokenInfo.map((info: any) => info.result)));

    const tokenInfo = await multicall({
      contracts: uniqueTokenAddresses.map((address: string) => ({
        address: address as Address,
        abi: erc20ABI as any,
        functionName: 'symbol',
      })),
    });


    // map token address to symbol with address as key
    const tokenInfoMap = tokenInfo.reduce((acc: any, info: any, i: number) => {
      acc[uniqueTokenAddresses[i]] = info.result;
      return acc;
    }, {});

    console.log('DEBUG==+TOKENINFO', tokenInfo, tokenInfoMap);

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

  const query = async () => {
    const data = await ApiService.withoutKey().getFarms(queryParams);

    return data
      .filter((farm: MapiFarm) => farm.pid !== 0 || (farm.pair !== undefined && farm.pair !== null))
      .map((farm: MapiFarm): DerivedFarm => {
        const pairFarm: MapiPairFarm = farm as MapiPairFarm;

        const lpBalance = BigNumber.from(pairFarm.lpBalance);
        const derivedUSD = pairFarm.pair.derivedUSD ?? '0';
        const derivedUSDBigNumber = ethers.utils.parseUnits(derivedUSD, 18);
        const totalDollarValue = lpBalance.mul(derivedUSDBigNumber).div(ethers.constants.WeiPerEther);
        const stakedLiquidity = ethers.utils.formatUnits(totalDollarValue, 18);
        const farmState = farm.allocPoint > 0 ? FarmState.ACTIVE : FarmState.FINISHED;

        return {
          data: pairFarm,
          derived: {
            name: pairFarm.pair.name,
            dailyRewards: `${commify(round(ethers.utils.formatEther(pairFarm.frtnPerDay)))} FRTN`,
            stakedLiquidity: `$${commify(round(stakedLiquidity))}`,
            apr: `${pairFarm.apr === 'Infinity' ? '-' : `${commify(round(pairFarm.apr, 2))}%`}`,
            state: farmState
          }
        }
    });
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
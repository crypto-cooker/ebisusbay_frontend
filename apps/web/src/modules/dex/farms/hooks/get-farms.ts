import {useQuery} from "@tanstack/react-query";
import {BigNumber, ethers} from "ethers";
import {DerivedFarm, FarmState, MapiFarm, MapiPairFarm} from "@dex/farms/constants/types";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";
import {ApiService} from "@src/core/services/api-service";
import {ciEquals, hasDatePassedSeconds, round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import useMultichainCurrencyBroker from "@market/hooks/use-multichain-currency-broker";
import {Address} from "viem";
import {getAppChainConfig} from "@src/config/hooks";

export function getFarmsUsingMapi(queryParams: FarmsQueryParams) {
  const { getByAddress } = useMultichainCurrencyBroker(queryParams.chain);

  const query = async () => {
    let data = await ApiService.withoutKey().getFarms(queryParams);
    const chainConfig = getAppChainConfig(queryParams.chain);

    return await Promise.all(data
      .filter((farm: MapiFarm) => farm.pid !== 0 || (farm.pair !== undefined && farm.pair !== null)) 
      .map(async (farm: MapiFarm): Promise<DerivedFarm> => {
        const pairFarm: MapiPairFarm = farm as MapiPairFarm;

        const lpBalance = BigNumber.from(pairFarm.lpBalance);
        const derivedUSD = pairFarm.pair.derivedUSD ?? '0';
        const derivedUSDBigNumber = ethers.utils.parseUnits(derivedUSD, 18);
        const totalDollarValue = lpBalance.mul(derivedUSDBigNumber).div(ethers.constants.WeiPerEther);
        const stakedLiquidity = ethers.utils.formatUnits(totalDollarValue, 18);

        const activity = pairFarm.rewarders.reduce((acc, rewarder) =>  {
          if (!rewarder.id.toString().startsWith('0x') && rewarder.allocPoint > 0) {
            acc.native = true;
          } else if (rewarder.rewardEnd && !hasDatePassedSeconds(rewarder.rewardEnd)) {
            acc.tokens = true;
          }

          acc.state = acc.native || acc.tokens ? FarmState.ACTIVE : FarmState.FINISHED;
          return acc;
        }, {native: false, tokens: false, state: FarmState.FINISHED});

        const dailyRewards = await Promise.all(
          pairFarm.rewarders
            .filter((rewarder) => pairFarm.rewarders.length === 1 || (!rewarder.isMain || rewarder.allocPoint > 0))
            .map(async (rewarder) => {
              let token = getByAddress(rewarder.token);
              if (!token) {
                token = {
                  address: rewarder.token as Address,
                  symbol: '?',
                  name: '?',
                  decimals: 18,
                  chainId: queryParams.chain,
                  isToken: true,
                  isNative: false
                }
                // throw new Error(`Token not found for rewarder address: ${rewarder.token}`);
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

        let hasActiveBoost = false;
        for (const rewarder of pairFarm.rewarders) {
          const isFrtnZk = ciEquals(chainConfig.contracts.frtnRewarder, rewarder.id.toString());

          const isActiveFrtnZk = isFrtnZk && rewarder.rewardEnd && !hasDatePassedSeconds(rewarder.rewardEnd);
          const isActiveBaiter = rewarder.isMain && rewarder.allocPoint > 0;

          if (isActiveFrtnZk || isActiveBaiter) {
            hasActiveBoost = true;
          }
        }

        return {
          data: pairFarm,
          derived: {
            name: pairFarm.pair.name,
            dailyRewards: dailyRewards,
            stakedLiquidity: `$${commify(round(stakedLiquidity))}`,
            apr: `${['Infinity', 'NaN'].includes(pairFarm.apr) ? '-' : `${commify(round(pairFarm.apr, 2))}%`}`,
            state: activity.state,
            chainId: queryParams.chain,
            hasActiveBoost,
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
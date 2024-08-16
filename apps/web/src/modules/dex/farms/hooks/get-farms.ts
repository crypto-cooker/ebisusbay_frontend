import {useQuery} from "@tanstack/react-query";
import {BigNumber, ethers} from "ethers";
import {DerivedFarm, FarmState, MapiFarm, MapiPairFarm} from "@dex/farms/constants/types";
import {FarmsQueryParams} from "@src/core/services/api-service/mapi/queries/farms";
import {ApiService} from "@src/core/services/api-service";
import {round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import useCurrencyBroker from "@market/hooks/use-currency-broker";

export function getFarmsUsingMapi(queryParams: FarmsQueryParams) {
  const { getByAddress } = useCurrencyBroker();

  const query = async () => {
    console.log('queryParams', queryParams);
    let data = await ApiService.withoutKey().getFarms(queryParams);
    if(queryParams.chain === 388) data = [];

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
              let token = getByAddress(rewarder.token);
              if (!token) {
                token = {
                  address: rewarder.token,
                  symbol: '?',
                  name: '?',
                  decimals: 18,
                  image: null
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
import {BoosterStaker, Staker} from "@src/components-v2/feature/brand/tabs/staking/types";
import WeirdApesStaker from "@src/components-v2/feature/brand/tabs/staking/stakers/weird-apes";
import WorldOfCatsStaker from "@src/components-v2/feature/brand/tabs/staking/stakers/world-of-cats";
import {CroCrowStaker} from "@src/components-v2/feature/brand/tabs/staking/stakers/cro-crow";
import {CroCrowBoosterStaker} from "@src/components-v2/feature/brand/tabs/staking/stakers/cro-crow-booster";

export const stakers:{[key: string]: Staker} = {
    'weird-apes-club': new WeirdApesStaker(),
    'hidden-fish': new WorldOfCatsStaker(),
    'cro-crow': new CroCrowStaker()
};

export const boosterStakers:{[key: string]: BoosterStaker} = {
    'cro-crow': new CroCrowBoosterStaker()
}
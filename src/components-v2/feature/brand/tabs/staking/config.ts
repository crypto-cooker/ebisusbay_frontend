import {Staker} from "@src/components-v2/feature/brand/tabs/staking/types";
import WeirdApesStaker from "@src/components-v2/feature/brand/tabs/staking/stakers/weird-apes";
import WorldOfCatsStaker from "@src/components-v2/feature/brand/tabs/staking/stakers/world-of-cats";

export const stakers:{[key: string]: Staker} = {
    'weird-apes-club': new WeirdApesStaker(),
    'hidden-fish': new WorldOfCatsStaker()
};
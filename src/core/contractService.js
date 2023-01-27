import {Contract} from "ethers";
import Market from "@src/Contracts/Marketplace.json";
import {appConfig} from "@src/Config";
import Auction from "@src/Contracts/DegenAuction.json";
import Offer from "@src/Contracts/Offer.json";
import StakeABI from "@src/Contracts/Stake.json";
import Membership from "@src/Contracts/EbisusBayMembership.json";
import gaslessListingContract from "@src/Contracts/GaslessListing.json";

const config = appConfig();

class UserContractService {
  signer = null;

  constructor(signer) {
    this.signer = signer;
  }

  get market() {
    if (!this._market) {
      this._market = new Contract(config.contracts.market, Market.abi, this.signer)
    }
    return this._market;
  }

  get auction() {
    if (!this._auction) {
      this._auction = new Contract(config.contracts.madAuction, Auction.abi, this.signer)
    }
    return this._auction;
  }

  get offer() {
    if (!this._offer) {
      this._offer = new Contract(config.contracts.offer, Offer.abi, this.signer)
    }
    return this._offer;
  }

  get staking() {
    if (!this._staking) {
      this._staking = new Contract(config.contracts.stake, StakeABI.abi, this.signer)
    }
    return this._staking;
  }

  get membership() {
    if (!this._membership) {
      this._membership = new Contract(config.contracts.membership, Membership.abi, this.signer)
    }
    return this._membership;
  }

  get ship() {
    if (!this._ship) {
      this._ship = new Contract(config.contracts.gaslessListing, gaslessListingContract.abi, this.signer)
    }
    return this._ship;
  }
}
//
// const instance = new ContractService();

export default UserContractService;
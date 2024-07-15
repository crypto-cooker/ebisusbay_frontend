import {Contract, ethers, Signer} from "ethers";
import Market from "@src/global/contracts/Marketplace.json";
import {appConfig} from "@src/config";
import Auction from "@src/global/contracts/DegenAuction.json";
import Offer from "@src/global/contracts/Offer.json";
import StakeABI from "@src/global/contracts/Stake.json";
import Membership from "@src/global/contracts/EbisusBayMembership.json";
import gaslessListingContract from "@src/global/contracts/GaslessListing.json";
import gdcAbi from "@src/global/contracts/GDC.json";
import PlatformRewards from "@src/global/contracts/PlatformRewards.json";
import PresaleVaults from "@src/global/contracts/PresaleVaults.json";
import {ERC20} from "@src/global/contracts/Abis";

const config = appConfig();

class UserContractService {
  private signer: Signer;
  private erc20Tokens: { [key: string]: Contract } = {};

  private _market?: Contract;
  private _auction?: Contract;
  private _offer?: Contract;
  private _staking?: Contract;
  private _membership?: Contract;
  private _ship?: Contract;
  private _gdc?: Contract;
  private _ryoshiPlatformRewards?: Contract;
  private _ryoshiPresaleVaults?: Contract;
  private _custom: { [key: string]: Contract } = {};

  constructor(signer: Signer | ethers.providers.JsonRpcSigner) {
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

  get gdc() {
    if (!this._gdc) {
      this._gdc = new Contract(config.contracts.gdc, gdcAbi, this.signer)
    }
    return this._gdc;
  }

  get ryoshiPlatformRewards() {
    if (!this._ryoshiPlatformRewards) {
      this._ryoshiPlatformRewards = new Contract(config.contracts.rewards, PlatformRewards, this.signer)
    }
    return this._ryoshiPlatformRewards;
  }

  get ryoshiPresaleVaults() {
    if (!this._ryoshiPresaleVaults) {
      this._ryoshiPresaleVaults = new Contract(config.contracts.presaleVaults, PresaleVaults, this.signer)
    }
    return this._ryoshiPresaleVaults;
  }

  public erc20(address: string) {
    if (!this.erc20Tokens[address]) {
      this.erc20Tokens[address] = new Contract(address, ERC20, this.signer)
    }
    return this.erc20Tokens[address];
  }

  public custom(address: string, abi: string) {
    if (!this._custom[address]) {
      this._custom[address] = new Contract(address, abi, this.signer)
    }
    return this._custom[address];
  }
}
//
// const instance = new ContractService();

export default UserContractService;
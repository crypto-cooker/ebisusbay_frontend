import {millisecondTimestamp} from "@market/helpers/utils";
import {ethers} from 'ethers';

export class Auction {

  constructor(json) {
    Object.assign(this, json);
  }

  get getAuctionId() {
    return this.id;
  }

  get getAuctionIndex() {
    return this.index;
  }

  get getAuctionHash() {
    return this.hash;
  }

  get getHighestBid() {
    if (this.highestBid || this.highest_bid) {
      return this.highestBid ?? this.highest_bid ?? 0;
    } else {
      return ethers.utils.formatEther(this.getHighestBidWei);
    }
  }

  get getHighestBidWei() {
    return this.highestBidWei ?? this.highest_bid_wei ?? 0;
  }

  get getHighestBidder() {
    return this.highestBidder ?? this.highest_bidder ?? 0;
  }

  get getMinimumBid() {
    return this.minimumBid ?? this.minimum_bid ?? 0;
  }

  get getBidHistory() {
    const history = this.bidHistory ?? this.bid_history ?? [];
    return history.sort((a, b) => (parseInt(a.price) < parseInt(b.price) ? 1 : -1))
  }

  get getEndAt() {
    return millisecondTimestamp(this.endAt ?? this.end_at ?? 0);
  }
}
export const auctionState = {
  ACTIVE: 0,
  SOLD: 1,
  CANCELLED: 2,
  NOT_STARTED: 3,
};

export enum DropState {
  UNSET = -1,
  NOT_STARTED,
  LIVE,
  EXPIRED,
  SOLD_OUT,
};

export const listingState = {
  ACTIVE: 0,
  SOLD: 1,
  CANCELLED: 2,
};

export const offerState = {
  ACTIVE: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELLED: 3,
};

export const listingType = {
  LISTING: 0,
  AUCTION: 1,
}

export const excludeBurnState = {
  UNBURNT: 0,
  BURNT: 1
}
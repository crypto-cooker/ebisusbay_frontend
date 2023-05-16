export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type AccountClosed = {
  __typename?: 'AccountClosed';
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type AccountClosedByAdmin = {
  __typename?: 'AccountClosedByAdmin';
  admin: Scalars['String'];
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type AccountClosedByAdmin_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars['String']>;
  admin_contains?: InputMaybe<Scalars['String']>;
  admin_contains_nocase?: InputMaybe<Scalars['String']>;
  admin_ends_with?: InputMaybe<Scalars['String']>;
  admin_ends_with_nocase?: InputMaybe<Scalars['String']>;
  admin_gt?: InputMaybe<Scalars['String']>;
  admin_gte?: InputMaybe<Scalars['String']>;
  admin_in?: InputMaybe<Array<Scalars['String']>>;
  admin_lt?: InputMaybe<Scalars['String']>;
  admin_lte?: InputMaybe<Scalars['String']>;
  admin_not?: InputMaybe<Scalars['String']>;
  admin_not_contains?: InputMaybe<Scalars['String']>;
  admin_not_contains_nocase?: InputMaybe<Scalars['String']>;
  admin_not_ends_with?: InputMaybe<Scalars['String']>;
  admin_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  admin_not_in?: InputMaybe<Array<Scalars['String']>>;
  admin_not_starts_with?: InputMaybe<Scalars['String']>;
  admin_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  admin_starts_with?: InputMaybe<Scalars['String']>;
  admin_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum AccountClosedByAdmin_OrderBy {
  Admin = 'admin',
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  User = 'user'
}

export type AccountClosed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum AccountClosed_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  User = 'user'
}

export type AccountOpened = {
  __typename?: 'AccountOpened';
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type AccountOpened_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum AccountOpened_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  User = 'user'
}

export type AccountUpdated = {
  __typename?: 'AccountUpdated';
  amount: Scalars['String'];
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  length: Scalars['String'];
  startTime: Scalars['String'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type AccountUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  length?: InputMaybe<Scalars['String']>;
  length_contains?: InputMaybe<Scalars['String']>;
  length_contains_nocase?: InputMaybe<Scalars['String']>;
  length_ends_with?: InputMaybe<Scalars['String']>;
  length_ends_with_nocase?: InputMaybe<Scalars['String']>;
  length_gt?: InputMaybe<Scalars['String']>;
  length_gte?: InputMaybe<Scalars['String']>;
  length_in?: InputMaybe<Array<Scalars['String']>>;
  length_lt?: InputMaybe<Scalars['String']>;
  length_lte?: InputMaybe<Scalars['String']>;
  length_not?: InputMaybe<Scalars['String']>;
  length_not_contains?: InputMaybe<Scalars['String']>;
  length_not_contains_nocase?: InputMaybe<Scalars['String']>;
  length_not_ends_with?: InputMaybe<Scalars['String']>;
  length_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  length_not_in?: InputMaybe<Array<Scalars['String']>>;
  length_not_starts_with?: InputMaybe<Scalars['String']>;
  length_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  length_starts_with?: InputMaybe<Scalars['String']>;
  length_starts_with_nocase?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['String']>;
  startTime_contains?: InputMaybe<Scalars['String']>;
  startTime_contains_nocase?: InputMaybe<Scalars['String']>;
  startTime_ends_with?: InputMaybe<Scalars['String']>;
  startTime_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_gt?: InputMaybe<Scalars['String']>;
  startTime_gte?: InputMaybe<Scalars['String']>;
  startTime_in?: InputMaybe<Array<Scalars['String']>>;
  startTime_lt?: InputMaybe<Scalars['String']>;
  startTime_lte?: InputMaybe<Scalars['String']>;
  startTime_not?: InputMaybe<Scalars['String']>;
  startTime_not_contains?: InputMaybe<Scalars['String']>;
  startTime_not_contains_nocase?: InputMaybe<Scalars['String']>;
  startTime_not_ends_with?: InputMaybe<Scalars['String']>;
  startTime_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_not_in?: InputMaybe<Array<Scalars['String']>>;
  startTime_not_starts_with?: InputMaybe<Scalars['String']>;
  startTime_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_starts_with?: InputMaybe<Scalars['String']>;
  startTime_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum AccountUpdated_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Length = 'length',
  StartTime = 'startTime',
  Time = 'time',
  User = 'user'
}

export type AttackFactionEvent = {
  __typename?: 'AttackFactionEvent';
  attackId: Scalars['String'];
  attacker: Scalars['String'];
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
};

export type AttackFactionEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  attackId?: InputMaybe<Scalars['String']>;
  attackId_contains?: InputMaybe<Scalars['String']>;
  attackId_contains_nocase?: InputMaybe<Scalars['String']>;
  attackId_ends_with?: InputMaybe<Scalars['String']>;
  attackId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  attackId_gt?: InputMaybe<Scalars['String']>;
  attackId_gte?: InputMaybe<Scalars['String']>;
  attackId_in?: InputMaybe<Array<Scalars['String']>>;
  attackId_lt?: InputMaybe<Scalars['String']>;
  attackId_lte?: InputMaybe<Scalars['String']>;
  attackId_not?: InputMaybe<Scalars['String']>;
  attackId_not_contains?: InputMaybe<Scalars['String']>;
  attackId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  attackId_not_ends_with?: InputMaybe<Scalars['String']>;
  attackId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  attackId_not_in?: InputMaybe<Array<Scalars['String']>>;
  attackId_not_starts_with?: InputMaybe<Scalars['String']>;
  attackId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  attackId_starts_with?: InputMaybe<Scalars['String']>;
  attackId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  attacker?: InputMaybe<Scalars['String']>;
  attacker_contains?: InputMaybe<Scalars['String']>;
  attacker_contains_nocase?: InputMaybe<Scalars['String']>;
  attacker_ends_with?: InputMaybe<Scalars['String']>;
  attacker_ends_with_nocase?: InputMaybe<Scalars['String']>;
  attacker_gt?: InputMaybe<Scalars['String']>;
  attacker_gte?: InputMaybe<Scalars['String']>;
  attacker_in?: InputMaybe<Array<Scalars['String']>>;
  attacker_lt?: InputMaybe<Scalars['String']>;
  attacker_lte?: InputMaybe<Scalars['String']>;
  attacker_not?: InputMaybe<Scalars['String']>;
  attacker_not_contains?: InputMaybe<Scalars['String']>;
  attacker_not_contains_nocase?: InputMaybe<Scalars['String']>;
  attacker_not_ends_with?: InputMaybe<Scalars['String']>;
  attacker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  attacker_not_in?: InputMaybe<Array<Scalars['String']>>;
  attacker_not_starts_with?: InputMaybe<Scalars['String']>;
  attacker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  attacker_starts_with?: InputMaybe<Scalars['String']>;
  attacker_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum AttackFactionEvent_OrderBy {
  AttackId = 'attackId',
  Attacker = 'attacker',
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Cancelled = {
  __typename?: 'Cancelled';
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['String'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type Cancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nonce?: InputMaybe<Scalars['String']>;
  nonce_contains?: InputMaybe<Scalars['String']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_ends_with?: InputMaybe<Scalars['String']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_gt?: InputMaybe<Scalars['String']>;
  nonce_gte?: InputMaybe<Scalars['String']>;
  nonce_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_lt?: InputMaybe<Scalars['String']>;
  nonce_lte?: InputMaybe<Scalars['String']>;
  nonce_not?: InputMaybe<Scalars['String']>;
  nonce_not_contains?: InputMaybe<Scalars['String']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_starts_with?: InputMaybe<Scalars['String']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Cancelled_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Nonce = 'nonce',
  Time = 'time',
  User = 'user'
}

export type Erc20Account = {
  __typename?: 'ERC20Account';
  fortuneBalance: Scalars['String'];
  id: Scalars['ID'];
  mitamaBalance: Scalars['String'];
};

export type Erc20Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  fortuneBalance?: InputMaybe<Scalars['String']>;
  fortuneBalance_contains?: InputMaybe<Scalars['String']>;
  fortuneBalance_contains_nocase?: InputMaybe<Scalars['String']>;
  fortuneBalance_ends_with?: InputMaybe<Scalars['String']>;
  fortuneBalance_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fortuneBalance_gt?: InputMaybe<Scalars['String']>;
  fortuneBalance_gte?: InputMaybe<Scalars['String']>;
  fortuneBalance_in?: InputMaybe<Array<Scalars['String']>>;
  fortuneBalance_lt?: InputMaybe<Scalars['String']>;
  fortuneBalance_lte?: InputMaybe<Scalars['String']>;
  fortuneBalance_not?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_contains?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_contains_nocase?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_ends_with?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_in?: InputMaybe<Array<Scalars['String']>>;
  fortuneBalance_not_starts_with?: InputMaybe<Scalars['String']>;
  fortuneBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fortuneBalance_starts_with?: InputMaybe<Scalars['String']>;
  fortuneBalance_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  mitamaBalance?: InputMaybe<Scalars['String']>;
  mitamaBalance_contains?: InputMaybe<Scalars['String']>;
  mitamaBalance_contains_nocase?: InputMaybe<Scalars['String']>;
  mitamaBalance_ends_with?: InputMaybe<Scalars['String']>;
  mitamaBalance_ends_with_nocase?: InputMaybe<Scalars['String']>;
  mitamaBalance_gt?: InputMaybe<Scalars['String']>;
  mitamaBalance_gte?: InputMaybe<Scalars['String']>;
  mitamaBalance_in?: InputMaybe<Array<Scalars['String']>>;
  mitamaBalance_lt?: InputMaybe<Scalars['String']>;
  mitamaBalance_lte?: InputMaybe<Scalars['String']>;
  mitamaBalance_not?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_contains?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_contains_nocase?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_ends_with?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_in?: InputMaybe<Array<Scalars['String']>>;
  mitamaBalance_not_starts_with?: InputMaybe<Scalars['String']>;
  mitamaBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  mitamaBalance_starts_with?: InputMaybe<Scalars['String']>;
  mitamaBalance_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Erc20Account_OrderBy {
  FortuneBalance = 'fortuneBalance',
  Id = 'id',
  MitamaBalance = 'mitamaBalance'
}

export type FortuneStakingAccount = {
  __typename?: 'FortuneStakingAccount';
  balance: Scalars['String'];
  id: Scalars['ID'];
  length?: Maybe<Scalars['String']>;
  open: Scalars['Boolean'];
  startTime?: Maybe<Scalars['String']>;
  user: Scalars['String'];
};

export type FortuneStakingAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['String']>;
  balance_contains?: InputMaybe<Scalars['String']>;
  balance_contains_nocase?: InputMaybe<Scalars['String']>;
  balance_ends_with?: InputMaybe<Scalars['String']>;
  balance_ends_with_nocase?: InputMaybe<Scalars['String']>;
  balance_gt?: InputMaybe<Scalars['String']>;
  balance_gte?: InputMaybe<Scalars['String']>;
  balance_in?: InputMaybe<Array<Scalars['String']>>;
  balance_lt?: InputMaybe<Scalars['String']>;
  balance_lte?: InputMaybe<Scalars['String']>;
  balance_not?: InputMaybe<Scalars['String']>;
  balance_not_contains?: InputMaybe<Scalars['String']>;
  balance_not_contains_nocase?: InputMaybe<Scalars['String']>;
  balance_not_ends_with?: InputMaybe<Scalars['String']>;
  balance_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  balance_not_in?: InputMaybe<Array<Scalars['String']>>;
  balance_not_starts_with?: InputMaybe<Scalars['String']>;
  balance_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  balance_starts_with?: InputMaybe<Scalars['String']>;
  balance_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  length?: InputMaybe<Scalars['String']>;
  length_contains?: InputMaybe<Scalars['String']>;
  length_contains_nocase?: InputMaybe<Scalars['String']>;
  length_ends_with?: InputMaybe<Scalars['String']>;
  length_ends_with_nocase?: InputMaybe<Scalars['String']>;
  length_gt?: InputMaybe<Scalars['String']>;
  length_gte?: InputMaybe<Scalars['String']>;
  length_in?: InputMaybe<Array<Scalars['String']>>;
  length_lt?: InputMaybe<Scalars['String']>;
  length_lte?: InputMaybe<Scalars['String']>;
  length_not?: InputMaybe<Scalars['String']>;
  length_not_contains?: InputMaybe<Scalars['String']>;
  length_not_contains_nocase?: InputMaybe<Scalars['String']>;
  length_not_ends_with?: InputMaybe<Scalars['String']>;
  length_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  length_not_in?: InputMaybe<Array<Scalars['String']>>;
  length_not_starts_with?: InputMaybe<Scalars['String']>;
  length_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  length_starts_with?: InputMaybe<Scalars['String']>;
  length_starts_with_nocase?: InputMaybe<Scalars['String']>;
  open?: InputMaybe<Scalars['Boolean']>;
  open_in?: InputMaybe<Array<Scalars['Boolean']>>;
  open_not?: InputMaybe<Scalars['Boolean']>;
  open_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  startTime?: InputMaybe<Scalars['String']>;
  startTime_contains?: InputMaybe<Scalars['String']>;
  startTime_contains_nocase?: InputMaybe<Scalars['String']>;
  startTime_ends_with?: InputMaybe<Scalars['String']>;
  startTime_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_gt?: InputMaybe<Scalars['String']>;
  startTime_gte?: InputMaybe<Scalars['String']>;
  startTime_in?: InputMaybe<Array<Scalars['String']>>;
  startTime_lt?: InputMaybe<Scalars['String']>;
  startTime_lte?: InputMaybe<Scalars['String']>;
  startTime_not?: InputMaybe<Scalars['String']>;
  startTime_not_contains?: InputMaybe<Scalars['String']>;
  startTime_not_contains_nocase?: InputMaybe<Scalars['String']>;
  startTime_not_ends_with?: InputMaybe<Scalars['String']>;
  startTime_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_not_in?: InputMaybe<Array<Scalars['String']>>;
  startTime_not_starts_with?: InputMaybe<Scalars['String']>;
  startTime_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  startTime_starts_with?: InputMaybe<Scalars['String']>;
  startTime_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum FortuneStakingAccount_OrderBy {
  Balance = 'balance',
  Id = 'id',
  Length = 'length',
  Open = 'open',
  StartTime = 'startTime',
  User = 'user'
}

export type MintRequestCancelledEvent = {
  __typename?: 'MintRequestCancelledEvent';
  block: Scalars['String'];
  digest: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
};

export type MintRequestCancelledEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  digest?: InputMaybe<Scalars['String']>;
  digest_contains?: InputMaybe<Scalars['String']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']>;
  digest_ends_with?: InputMaybe<Scalars['String']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']>;
  digest_gt?: InputMaybe<Scalars['String']>;
  digest_gte?: InputMaybe<Scalars['String']>;
  digest_in?: InputMaybe<Array<Scalars['String']>>;
  digest_lt?: InputMaybe<Scalars['String']>;
  digest_lte?: InputMaybe<Scalars['String']>;
  digest_not?: InputMaybe<Scalars['String']>;
  digest_not_contains?: InputMaybe<Scalars['String']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  digest_starts_with?: InputMaybe<Scalars['String']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum MintRequestCancelledEvent_OrderBy {
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

export type MintRequestSuccessEvent = {
  __typename?: 'MintRequestSuccessEvent';
  block: Scalars['String'];
  digest: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
};

export type MintRequestSuccessEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  digest?: InputMaybe<Scalars['String']>;
  digest_contains?: InputMaybe<Scalars['String']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']>;
  digest_ends_with?: InputMaybe<Scalars['String']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']>;
  digest_gt?: InputMaybe<Scalars['String']>;
  digest_gte?: InputMaybe<Scalars['String']>;
  digest_in?: InputMaybe<Array<Scalars['String']>>;
  digest_lt?: InputMaybe<Scalars['String']>;
  digest_lte?: InputMaybe<Scalars['String']>;
  digest_not?: InputMaybe<Scalars['String']>;
  digest_not_contains?: InputMaybe<Scalars['String']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  digest_starts_with?: InputMaybe<Scalars['String']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum MintRequestSuccessEvent_OrderBy {
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  accountClosed?: Maybe<AccountClosed>;
  accountClosedByAdmin?: Maybe<AccountClosedByAdmin>;
  accountClosedByAdmins: Array<AccountClosedByAdmin>;
  accountCloseds: Array<AccountClosed>;
  accountOpened?: Maybe<AccountOpened>;
  accountOpeneds: Array<AccountOpened>;
  accountUpdated?: Maybe<AccountUpdated>;
  accountUpdateds: Array<AccountUpdated>;
  attackFactionEvent?: Maybe<AttackFactionEvent>;
  attackFactionEvents: Array<AttackFactionEvent>;
  cancelled?: Maybe<Cancelled>;
  cancelleds: Array<Cancelled>;
  erc20Account?: Maybe<Erc20Account>;
  erc20Accounts: Array<Erc20Account>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  spend?: Maybe<Spend>;
  spends: Array<Spend>;
  staked?: Maybe<Staked>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakeds: Array<Staked>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountClosedByAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountClosedByAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountClosedByAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosedByAdmin_Filter>;
};


export type QueryAccountClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosed_Filter>;
};


export type QueryAccountOpenedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountOpenedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOpened_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountOpened_Filter>;
};


export type QueryAccountUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountUpdated_Filter>;
};


export type QueryAttackFactionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAttackFactionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AttackFactionEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AttackFactionEvent_Filter>;
};


export type QueryCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cancelled_Filter>;
};


export type QueryErc20AccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc20AccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Erc20Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc20Account_Filter>;
};


export type QueryFortuneStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFortuneStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FortuneStakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FortuneStakingAccount_Filter>;
};


export type QueryMintRequestCancelledEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintRequestCancelledEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintRequestCancelledEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestCancelledEvent_Filter>;
};


export type QueryMintRequestSuccessEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintRequestSuccessEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintRequestSuccessEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestSuccessEvent_Filter>;
};


export type QueryRegisteredSeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegisteredSeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RegisteredSeason_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegisteredSeason_Filter>;
};


export type QuerySpendArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySpendsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Spend_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Spend_Filter>;
};


export type QueryStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakedToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakedToken_Filter>;
};


export type QueryStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type QueryUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type QueryWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawn_Filter>;
};

export type RegisteredSeason = {
  __typename?: 'RegisteredSeason';
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  leader: Scalars['String'];
  season: Scalars['String'];
  time: Scalars['String'];
};

export type RegisteredSeason_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  leader?: InputMaybe<Scalars['String']>;
  leader_contains?: InputMaybe<Scalars['String']>;
  leader_contains_nocase?: InputMaybe<Scalars['String']>;
  leader_ends_with?: InputMaybe<Scalars['String']>;
  leader_ends_with_nocase?: InputMaybe<Scalars['String']>;
  leader_gt?: InputMaybe<Scalars['String']>;
  leader_gte?: InputMaybe<Scalars['String']>;
  leader_in?: InputMaybe<Array<Scalars['String']>>;
  leader_lt?: InputMaybe<Scalars['String']>;
  leader_lte?: InputMaybe<Scalars['String']>;
  leader_not?: InputMaybe<Scalars['String']>;
  leader_not_contains?: InputMaybe<Scalars['String']>;
  leader_not_contains_nocase?: InputMaybe<Scalars['String']>;
  leader_not_ends_with?: InputMaybe<Scalars['String']>;
  leader_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  leader_not_in?: InputMaybe<Array<Scalars['String']>>;
  leader_not_starts_with?: InputMaybe<Scalars['String']>;
  leader_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  leader_starts_with?: InputMaybe<Scalars['String']>;
  leader_starts_with_nocase?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<Scalars['String']>;
  season_contains?: InputMaybe<Scalars['String']>;
  season_contains_nocase?: InputMaybe<Scalars['String']>;
  season_ends_with?: InputMaybe<Scalars['String']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']>;
  season_gt?: InputMaybe<Scalars['String']>;
  season_gte?: InputMaybe<Scalars['String']>;
  season_in?: InputMaybe<Array<Scalars['String']>>;
  season_lt?: InputMaybe<Scalars['String']>;
  season_lte?: InputMaybe<Scalars['String']>;
  season_not?: InputMaybe<Scalars['String']>;
  season_not_contains?: InputMaybe<Scalars['String']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']>;
  season_not_ends_with?: InputMaybe<Scalars['String']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  season_not_in?: InputMaybe<Array<Scalars['String']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  season_starts_with?: InputMaybe<Scalars['String']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum RegisteredSeason_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Leader = 'leader',
  Season = 'season',
  Time = 'time'
}

export type Spend = {
  __typename?: 'Spend';
  amount: Scalars['String'];
  block: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['String'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type Spend_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nonce?: InputMaybe<Scalars['String']>;
  nonce_contains?: InputMaybe<Scalars['String']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_ends_with?: InputMaybe<Scalars['String']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_gt?: InputMaybe<Scalars['String']>;
  nonce_gte?: InputMaybe<Scalars['String']>;
  nonce_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_lt?: InputMaybe<Scalars['String']>;
  nonce_lte?: InputMaybe<Scalars['String']>;
  nonce_not?: InputMaybe<Scalars['String']>;
  nonce_not_contains?: InputMaybe<Scalars['String']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_starts_with?: InputMaybe<Scalars['String']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Spend_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Nonce = 'nonce',
  Time = 'time',
  User = 'user'
}

export type Staked = {
  __typename?: 'Staked';
  amount: Scalars['String'];
  block: Scalars['String'];
  contractAddress: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
  tokenId: Scalars['String'];
  type: Scalars['String'];
  user: Scalars['String'];
};

export type StakedToken = {
  __typename?: 'StakedToken';
  amount: Scalars['String'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  tokenId: Scalars['String'];
  type: Scalars['String'];
  user: Scalars['String'];
};

export type StakedToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  contractAddress_contains?: InputMaybe<Scalars['String']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_gt?: InputMaybe<Scalars['String']>;
  contractAddress_gte?: InputMaybe<Scalars['String']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']>;
  contractAddress_lte?: InputMaybe<Scalars['String']>;
  contractAddress_not?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenId_contains?: InputMaybe<Scalars['String']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_gt?: InputMaybe<Scalars['String']>;
  tokenId_gte?: InputMaybe<Scalars['String']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_lt?: InputMaybe<Scalars['String']>;
  tokenId_lte?: InputMaybe<Scalars['String']>;
  tokenId_not?: InputMaybe<Scalars['String']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum StakedToken_OrderBy {
  Amount = 'amount',
  ContractAddress = 'contractAddress',
  Id = 'id',
  TokenId = 'tokenId',
  Type = 'type',
  User = 'user'
}

export type Staked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  contractAddress_contains?: InputMaybe<Scalars['String']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_gt?: InputMaybe<Scalars['String']>;
  contractAddress_gte?: InputMaybe<Scalars['String']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']>;
  contractAddress_lte?: InputMaybe<Scalars['String']>;
  contractAddress_not?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenId_contains?: InputMaybe<Scalars['String']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_gt?: InputMaybe<Scalars['String']>;
  tokenId_gte?: InputMaybe<Scalars['String']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_lt?: InputMaybe<Scalars['String']>;
  tokenId_lte?: InputMaybe<Scalars['String']>;
  tokenId_not?: InputMaybe<Scalars['String']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Staked_OrderBy {
  Amount = 'amount',
  Block = 'block',
  ContractAddress = 'contractAddress',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  TokenId = 'tokenId',
  Type = 'type',
  User = 'user'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  accountClosed?: Maybe<AccountClosed>;
  accountClosedByAdmin?: Maybe<AccountClosedByAdmin>;
  accountClosedByAdmins: Array<AccountClosedByAdmin>;
  accountCloseds: Array<AccountClosed>;
  accountOpened?: Maybe<AccountOpened>;
  accountOpeneds: Array<AccountOpened>;
  accountUpdated?: Maybe<AccountUpdated>;
  accountUpdateds: Array<AccountUpdated>;
  attackFactionEvent?: Maybe<AttackFactionEvent>;
  attackFactionEvents: Array<AttackFactionEvent>;
  cancelled?: Maybe<Cancelled>;
  cancelleds: Array<Cancelled>;
  erc20Account?: Maybe<Erc20Account>;
  erc20Accounts: Array<Erc20Account>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  spend?: Maybe<Spend>;
  spends: Array<Spend>;
  staked?: Maybe<Staked>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakeds: Array<Staked>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountClosedByAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountClosedByAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountClosedByAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosedByAdmin_Filter>;
};


export type SubscriptionAccountClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosed_Filter>;
};


export type SubscriptionAccountOpenedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountOpenedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOpened_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountOpened_Filter>;
};


export type SubscriptionAccountUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountUpdated_Filter>;
};


export type SubscriptionAttackFactionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAttackFactionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AttackFactionEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AttackFactionEvent_Filter>;
};


export type SubscriptionCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cancelled_Filter>;
};


export type SubscriptionErc20AccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc20AccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Erc20Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc20Account_Filter>;
};


export type SubscriptionFortuneStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFortuneStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FortuneStakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FortuneStakingAccount_Filter>;
};


export type SubscriptionMintRequestCancelledEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintRequestCancelledEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintRequestCancelledEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestCancelledEvent_Filter>;
};


export type SubscriptionMintRequestSuccessEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintRequestSuccessEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MintRequestSuccessEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestSuccessEvent_Filter>;
};


export type SubscriptionRegisteredSeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegisteredSeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RegisteredSeason_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegisteredSeason_Filter>;
};


export type SubscriptionSpendArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSpendsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Spend_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Spend_Filter>;
};


export type SubscriptionStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakedToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakedToken_Filter>;
};


export type SubscriptionStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type SubscriptionUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type SubscriptionWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawn_Filter>;
};

export type Unstaked = {
  __typename?: 'Unstaked';
  amount: Scalars['String'];
  block: Scalars['String'];
  contractAddress: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  time: Scalars['String'];
  tokenId: Scalars['String'];
  type: Scalars['String'];
  user: Scalars['String'];
};

export type Unstaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  contractAddress_contains?: InputMaybe<Scalars['String']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_gt?: InputMaybe<Scalars['String']>;
  contractAddress_gte?: InputMaybe<Scalars['String']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']>;
  contractAddress_lte?: InputMaybe<Scalars['String']>;
  contractAddress_not?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenId_contains?: InputMaybe<Scalars['String']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_gt?: InputMaybe<Scalars['String']>;
  tokenId_gte?: InputMaybe<Scalars['String']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_lt?: InputMaybe<Scalars['String']>;
  tokenId_lte?: InputMaybe<Scalars['String']>;
  tokenId_not?: InputMaybe<Scalars['String']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Unstaked_OrderBy {
  Amount = 'amount',
  Block = 'block',
  ContractAddress = 'contractAddress',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  TokenId = 'tokenId',
  Type = 'type',
  User = 'user'
}

export type Withdrawn = {
  __typename?: 'Withdrawn';
  amount: Scalars['String'];
  block: Scalars['String'];
  burntAmount: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['String'];
  time: Scalars['String'];
  user: Scalars['String'];
};

export type Withdrawn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']>;
  amount_contains?: InputMaybe<Scalars['String']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_ends_with?: InputMaybe<Scalars['String']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_gt?: InputMaybe<Scalars['String']>;
  amount_gte?: InputMaybe<Scalars['String']>;
  amount_in?: InputMaybe<Array<Scalars['String']>>;
  amount_lt?: InputMaybe<Scalars['String']>;
  amount_lte?: InputMaybe<Scalars['String']>;
  amount_not?: InputMaybe<Scalars['String']>;
  amount_not_contains?: InputMaybe<Scalars['String']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  amount_starts_with?: InputMaybe<Scalars['String']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<Scalars['String']>;
  block_contains?: InputMaybe<Scalars['String']>;
  block_contains_nocase?: InputMaybe<Scalars['String']>;
  block_ends_with?: InputMaybe<Scalars['String']>;
  block_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_gt?: InputMaybe<Scalars['String']>;
  block_gte?: InputMaybe<Scalars['String']>;
  block_in?: InputMaybe<Array<Scalars['String']>>;
  block_lt?: InputMaybe<Scalars['String']>;
  block_lte?: InputMaybe<Scalars['String']>;
  block_not?: InputMaybe<Scalars['String']>;
  block_not_contains?: InputMaybe<Scalars['String']>;
  block_not_contains_nocase?: InputMaybe<Scalars['String']>;
  block_not_ends_with?: InputMaybe<Scalars['String']>;
  block_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  block_not_in?: InputMaybe<Array<Scalars['String']>>;
  block_not_starts_with?: InputMaybe<Scalars['String']>;
  block_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  block_starts_with?: InputMaybe<Scalars['String']>;
  block_starts_with_nocase?: InputMaybe<Scalars['String']>;
  burntAmount?: InputMaybe<Scalars['String']>;
  burntAmount_contains?: InputMaybe<Scalars['String']>;
  burntAmount_contains_nocase?: InputMaybe<Scalars['String']>;
  burntAmount_ends_with?: InputMaybe<Scalars['String']>;
  burntAmount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  burntAmount_gt?: InputMaybe<Scalars['String']>;
  burntAmount_gte?: InputMaybe<Scalars['String']>;
  burntAmount_in?: InputMaybe<Array<Scalars['String']>>;
  burntAmount_lt?: InputMaybe<Scalars['String']>;
  burntAmount_lte?: InputMaybe<Scalars['String']>;
  burntAmount_not?: InputMaybe<Scalars['String']>;
  burntAmount_not_contains?: InputMaybe<Scalars['String']>;
  burntAmount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  burntAmount_not_ends_with?: InputMaybe<Scalars['String']>;
  burntAmount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  burntAmount_not_in?: InputMaybe<Array<Scalars['String']>>;
  burntAmount_not_starts_with?: InputMaybe<Scalars['String']>;
  burntAmount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  burntAmount_starts_with?: InputMaybe<Scalars['String']>;
  burntAmount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_ends_with?: InputMaybe<Scalars['String']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  hash_starts_with?: InputMaybe<Scalars['String']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nonce?: InputMaybe<Scalars['String']>;
  nonce_contains?: InputMaybe<Scalars['String']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_ends_with?: InputMaybe<Scalars['String']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_gt?: InputMaybe<Scalars['String']>;
  nonce_gte?: InputMaybe<Scalars['String']>;
  nonce_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_lt?: InputMaybe<Scalars['String']>;
  nonce_lte?: InputMaybe<Scalars['String']>;
  nonce_not?: InputMaybe<Scalars['String']>;
  nonce_not_contains?: InputMaybe<Scalars['String']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nonce_starts_with?: InputMaybe<Scalars['String']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  time_contains?: InputMaybe<Scalars['String']>;
  time_contains_nocase?: InputMaybe<Scalars['String']>;
  time_ends_with?: InputMaybe<Scalars['String']>;
  time_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_gt?: InputMaybe<Scalars['String']>;
  time_gte?: InputMaybe<Scalars['String']>;
  time_in?: InputMaybe<Array<Scalars['String']>>;
  time_lt?: InputMaybe<Scalars['String']>;
  time_lte?: InputMaybe<Scalars['String']>;
  time_not?: InputMaybe<Scalars['String']>;
  time_not_contains?: InputMaybe<Scalars['String']>;
  time_not_contains_nocase?: InputMaybe<Scalars['String']>;
  time_not_ends_with?: InputMaybe<Scalars['String']>;
  time_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time_not_in?: InputMaybe<Array<Scalars['String']>>;
  time_not_starts_with?: InputMaybe<Scalars['String']>;
  time_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  time_starts_with?: InputMaybe<Scalars['String']>;
  time_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Withdrawn_OrderBy {
  Amount = 'amount',
  Block = 'block',
  BurntAmount = 'burntAmount',
  Hash = 'hash',
  Id = 'id',
  Nonce = 'nonce',
  Time = 'time',
  User = 'user'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

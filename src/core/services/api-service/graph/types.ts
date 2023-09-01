export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
};

export type AccountClosed = {
  __typename?: 'AccountClosed';
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type AccountClosedByAdmin = {
  __typename?: 'AccountClosedByAdmin';
  admin: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type AccountClosedByAdmin_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars['String']['input']>;
  admin_contains?: InputMaybe<Scalars['String']['input']>;
  admin_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  admin_ends_with?: InputMaybe<Scalars['String']['input']>;
  admin_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  admin_gt?: InputMaybe<Scalars['String']['input']>;
  admin_gte?: InputMaybe<Scalars['String']['input']>;
  admin_in?: InputMaybe<Array<Scalars['String']['input']>>;
  admin_lt?: InputMaybe<Scalars['String']['input']>;
  admin_lte?: InputMaybe<Scalars['String']['input']>;
  admin_not?: InputMaybe<Scalars['String']['input']>;
  admin_not_contains?: InputMaybe<Scalars['String']['input']>;
  admin_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  admin_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  admin_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  admin_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  admin_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  admin_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  admin_starts_with?: InputMaybe<Scalars['String']['input']>;
  admin_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AccountClosedByAdmin_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountClosedByAdmin_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  and?: InputMaybe<Array<InputMaybe<AccountClosed_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountClosed_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type AccountOpened_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AccountOpened_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountOpened_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  length: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type AccountUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AccountUpdated_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  length?: InputMaybe<Scalars['String']['input']>;
  length_contains?: InputMaybe<Scalars['String']['input']>;
  length_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  length_ends_with?: InputMaybe<Scalars['String']['input']>;
  length_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  length_gt?: InputMaybe<Scalars['String']['input']>;
  length_gte?: InputMaybe<Scalars['String']['input']>;
  length_in?: InputMaybe<Array<Scalars['String']['input']>>;
  length_lt?: InputMaybe<Scalars['String']['input']>;
  length_lte?: InputMaybe<Scalars['String']['input']>;
  length_not?: InputMaybe<Scalars['String']['input']>;
  length_not_contains?: InputMaybe<Scalars['String']['input']>;
  length_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  length_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  length_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  length_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  length_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  length_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  length_starts_with?: InputMaybe<Scalars['String']['input']>;
  length_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<AccountUpdated_Filter>>>;
  startTime?: InputMaybe<Scalars['String']['input']>;
  startTime_contains?: InputMaybe<Scalars['String']['input']>;
  startTime_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime_ends_with?: InputMaybe<Scalars['String']['input']>;
  startTime_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime_gt?: InputMaybe<Scalars['String']['input']>;
  startTime_gte?: InputMaybe<Scalars['String']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['String']['input']>>;
  startTime_lt?: InputMaybe<Scalars['String']['input']>;
  startTime_lte?: InputMaybe<Scalars['String']['input']>;
  startTime_not?: InputMaybe<Scalars['String']['input']>;
  startTime_not_contains?: InputMaybe<Scalars['String']['input']>;
  startTime_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  startTime_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  startTime_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  startTime_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime_starts_with?: InputMaybe<Scalars['String']['input']>;
  startTime_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  attackId: Scalars['String']['output'];
  attacker: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
};

export type AttackFactionEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AttackFactionEvent_Filter>>>;
  attackId?: InputMaybe<Scalars['String']['input']>;
  attackId_contains?: InputMaybe<Scalars['String']['input']>;
  attackId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  attackId_ends_with?: InputMaybe<Scalars['String']['input']>;
  attackId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attackId_gt?: InputMaybe<Scalars['String']['input']>;
  attackId_gte?: InputMaybe<Scalars['String']['input']>;
  attackId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  attackId_lt?: InputMaybe<Scalars['String']['input']>;
  attackId_lte?: InputMaybe<Scalars['String']['input']>;
  attackId_not?: InputMaybe<Scalars['String']['input']>;
  attackId_not_contains?: InputMaybe<Scalars['String']['input']>;
  attackId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  attackId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  attackId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attackId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  attackId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  attackId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attackId_starts_with?: InputMaybe<Scalars['String']['input']>;
  attackId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker?: InputMaybe<Scalars['String']['input']>;
  attacker_contains?: InputMaybe<Scalars['String']['input']>;
  attacker_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker_ends_with?: InputMaybe<Scalars['String']['input']>;
  attacker_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker_gt?: InputMaybe<Scalars['String']['input']>;
  attacker_gte?: InputMaybe<Scalars['String']['input']>;
  attacker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  attacker_lt?: InputMaybe<Scalars['String']['input']>;
  attacker_lte?: InputMaybe<Scalars['String']['input']>;
  attacker_not?: InputMaybe<Scalars['String']['input']>;
  attacker_not_contains?: InputMaybe<Scalars['String']['input']>;
  attacker_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  attacker_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  attacker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  attacker_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attacker_starts_with?: InputMaybe<Scalars['String']['input']>;
  attacker_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AttackFactionEvent_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Cancelled = {
  __typename?: 'Cancelled';
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonce: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type Cancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Cancelled_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nonce?: InputMaybe<Scalars['String']['input']>;
  nonce_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_gt?: InputMaybe<Scalars['String']['input']>;
  nonce_gte?: InputMaybe<Scalars['String']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_lt?: InputMaybe<Scalars['String']['input']>;
  nonce_lte?: InputMaybe<Scalars['String']['input']>;
  nonce_not?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Cancelled_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Cancelled_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Nonce = 'nonce',
  Time = 'time',
  User = 'user'
}

export type Compounded = {
  __typename?: 'Compounded';
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonce: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
  vaultId: FortuneStakingAccount;
};

export type Compounded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Compounded_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nonce?: InputMaybe<Scalars['String']['input']>;
  nonce_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_gt?: InputMaybe<Scalars['String']['input']>;
  nonce_gte?: InputMaybe<Scalars['String']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_lt?: InputMaybe<Scalars['String']['input']>;
  nonce_lte?: InputMaybe<Scalars['String']['input']>;
  nonce_not?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Compounded_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId?: InputMaybe<Scalars['String']['input']>;
  vaultId_?: InputMaybe<FortuneStakingAccount_Filter>;
  vaultId_contains?: InputMaybe<Scalars['String']['input']>;
  vaultId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId_gt?: InputMaybe<Scalars['String']['input']>;
  vaultId_gte?: InputMaybe<Scalars['String']['input']>;
  vaultId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultId_lt?: InputMaybe<Scalars['String']['input']>;
  vaultId_lte?: InputMaybe<Scalars['String']['input']>;
  vaultId_not?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_contains?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Compounded_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  Nonce = 'nonce',
  Time = 'time',
  User = 'user',
  VaultId = 'vaultId',
  VaultIdBalance = 'vaultId__balance',
  VaultIdBalanceString = 'vaultId__balanceString',
  VaultIdEndTime = 'vaultId__endTime',
  VaultIdId = 'vaultId__id',
  VaultIdIndex = 'vaultId__index',
  VaultIdLength = 'vaultId__length',
  VaultIdOpen = 'vaultId__open',
  VaultIdStartTime = 'vaultId__startTime',
  VaultIdVaultId = 'vaultId__vaultId'
}

export type Craft = {
  __typename?: 'Craft';
  block: Scalars['BigInt']['output'];
  digest: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
};

export type Craft_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Craft_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  digest?: InputMaybe<Scalars['String']['input']>;
  digest_contains?: InputMaybe<Scalars['String']['input']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_gt?: InputMaybe<Scalars['String']['input']>;
  digest_gte?: InputMaybe<Scalars['String']['input']>;
  digest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_lt?: InputMaybe<Scalars['String']['input']>;
  digest_lte?: InputMaybe<Scalars['String']['input']>;
  digest_not?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Craft_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Craft_OrderBy {
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

export type Deposit = {
  __typename?: 'Deposit';
  amounts: Array<Scalars['BigInt']['output']>;
  amountsString: Array<Scalars['String']['output']>;
  block: Scalars['BigInt']['output'];
  digest: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ids: Array<Scalars['String']['output']>;
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type Deposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amounts?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountsString?: InputMaybe<Array<Scalars['String']['input']>>;
  amountsString_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  amountsString_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  amountsString_not?: InputMaybe<Array<Scalars['String']['input']>>;
  amountsString_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  amountsString_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  amounts_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amounts_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amounts_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  digest?: InputMaybe<Scalars['String']['input']>;
  digest_contains?: InputMaybe<Scalars['String']['input']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_gt?: InputMaybe<Scalars['String']['input']>;
  digest_gte?: InputMaybe<Scalars['String']['input']>;
  digest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_lt?: InputMaybe<Scalars['String']['input']>;
  digest_lte?: InputMaybe<Scalars['String']['input']>;
  digest_not?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  ids_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  ids_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  ids_not?: InputMaybe<Array<Scalars['String']['input']>>;
  ids_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  ids_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Deposit_OrderBy {
  Amounts = 'amounts',
  AmountsString = 'amountsString',
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Ids = 'ids',
  Time = 'time',
  User = 'user'
}

export type Erc20Account = {
  __typename?: 'ERC20Account';
  fortuneBalance: Scalars['BigInt']['output'];
  fortuneBalanceString: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mitamaBalance: Scalars['BigInt']['output'];
  mitamaBalanceString: Scalars['String']['output'];
};

export type Erc20Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc20Account_Filter>>>;
  fortuneBalance?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalanceString?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_contains?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_ends_with?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_gt?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_gte?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fortuneBalanceString_lt?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_lte?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_contains?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fortuneBalanceString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_starts_with?: InputMaybe<Scalars['String']['input']>;
  fortuneBalanceString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fortuneBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fortuneBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  fortuneBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  mitamaBalance?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalanceString?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_contains?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_ends_with?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_gt?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_gte?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mitamaBalanceString_lt?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_lte?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_contains?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mitamaBalanceString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_starts_with?: InputMaybe<Scalars['String']['input']>;
  mitamaBalanceString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mitamaBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mitamaBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  mitamaBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc20Account_Filter>>>;
};

export enum Erc20Account_OrderBy {
  FortuneBalance = 'fortuneBalance',
  FortuneBalanceString = 'fortuneBalanceString',
  Id = 'id',
  MitamaBalance = 'mitamaBalance',
  MitamaBalanceString = 'mitamaBalanceString'
}

export type FortuneStakingAccount = {
  __typename?: 'FortuneStakingAccount';
  balance: Scalars['BigInt']['output'];
  balanceString: Scalars['String']['output'];
  endTime?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  index: Scalars['BigInt']['output'];
  length?: Maybe<Scalars['BigInt']['output']>;
  open: Scalars['Boolean']['output'];
  startTime?: Maybe<Scalars['BigInt']['output']>;
  user: StakingAccount;
  vaultId: Scalars['BigInt']['output'];
};

export type FortuneStakingAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FortuneStakingAccount_Filter>>>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balanceString?: InputMaybe<Scalars['String']['input']>;
  balanceString_contains?: InputMaybe<Scalars['String']['input']>;
  balanceString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balanceString_ends_with?: InputMaybe<Scalars['String']['input']>;
  balanceString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balanceString_gt?: InputMaybe<Scalars['String']['input']>;
  balanceString_gte?: InputMaybe<Scalars['String']['input']>;
  balanceString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balanceString_lt?: InputMaybe<Scalars['String']['input']>;
  balanceString_lte?: InputMaybe<Scalars['String']['input']>;
  balanceString_not?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_contains?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balanceString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  balanceString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balanceString_starts_with?: InputMaybe<Scalars['String']['input']>;
  balanceString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  length?: InputMaybe<Scalars['BigInt']['input']>;
  length_gt?: InputMaybe<Scalars['BigInt']['input']>;
  length_gte?: InputMaybe<Scalars['BigInt']['input']>;
  length_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  length_lt?: InputMaybe<Scalars['BigInt']['input']>;
  length_lte?: InputMaybe<Scalars['BigInt']['input']>;
  length_not?: InputMaybe<Scalars['BigInt']['input']>;
  length_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  open?: InputMaybe<Scalars['Boolean']['input']>;
  open_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  open_not?: InputMaybe<Scalars['Boolean']['input']>;
  open_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FortuneStakingAccount_Filter>>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<StakingAccount_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultId?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vaultId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_not?: InputMaybe<Scalars['BigInt']['input']>;
  vaultId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FortuneStakingAccount_OrderBy {
  Balance = 'balance',
  BalanceString = 'balanceString',
  EndTime = 'endTime',
  Id = 'id',
  Index = 'index',
  Length = 'length',
  Open = 'open',
  StartTime = 'startTime',
  User = 'user',
  UserId = 'user__id',
  UserTotalStaked = 'user__totalStaked',
  UserTotalStakedString = 'user__totalStakedString',
  VaultId = 'vaultId'
}

export type Meeple = {
  __typename?: 'Meeple';
  activeAmount: Scalars['BigInt']['output'];
  activeAmountString: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUpkeep: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type Meeple_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeAmount?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmountString?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_contains?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_ends_with?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_gt?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_gte?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  activeAmountString_lt?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_lte?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_contains?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  activeAmountString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_starts_with?: InputMaybe<Scalars['String']['input']>;
  activeAmountString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  activeAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  activeAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  activeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Meeple_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpkeep?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpkeep_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpkeep_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Meeple_Filter>>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Meeple_OrderBy {
  ActiveAmount = 'activeAmount',
  ActiveAmountString = 'activeAmountString',
  Id = 'id',
  LastUpkeep = 'lastUpkeep',
  User = 'user'
}

export type MintRequestCancelledEvent = {
  __typename?: 'MintRequestCancelledEvent';
  block: Scalars['BigInt']['output'];
  digest: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
};

export type MintRequestCancelledEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MintRequestCancelledEvent_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  digest?: InputMaybe<Scalars['String']['input']>;
  digest_contains?: InputMaybe<Scalars['String']['input']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_gt?: InputMaybe<Scalars['String']['input']>;
  digest_gte?: InputMaybe<Scalars['String']['input']>;
  digest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_lt?: InputMaybe<Scalars['String']['input']>;
  digest_lte?: InputMaybe<Scalars['String']['input']>;
  digest_not?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MintRequestCancelledEvent_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  block: Scalars['BigInt']['output'];
  digest: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
};

export type MintRequestSuccessEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MintRequestSuccessEvent_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  digest?: InputMaybe<Scalars['String']['input']>;
  digest_contains?: InputMaybe<Scalars['String']['input']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_gt?: InputMaybe<Scalars['String']['input']>;
  digest_gte?: InputMaybe<Scalars['String']['input']>;
  digest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_lt?: InputMaybe<Scalars['String']['input']>;
  digest_lte?: InputMaybe<Scalars['String']['input']>;
  digest_not?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MintRequestSuccessEvent_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum MintRequestSuccessEvent_OrderBy {
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

export type MitamaTransfer = {
  __typename?: 'MitamaTransfer';
  amount: Scalars['BigInt']['output'];
  amountString: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  from: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
};

export type MitamaTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountString?: InputMaybe<Scalars['String']['input']>;
  amountString_contains?: InputMaybe<Scalars['String']['input']>;
  amountString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amountString_ends_with?: InputMaybe<Scalars['String']['input']>;
  amountString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amountString_gt?: InputMaybe<Scalars['String']['input']>;
  amountString_gte?: InputMaybe<Scalars['String']['input']>;
  amountString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amountString_lt?: InputMaybe<Scalars['String']['input']>;
  amountString_lte?: InputMaybe<Scalars['String']['input']>;
  amountString_not?: InputMaybe<Scalars['String']['input']>;
  amountString_not_contains?: InputMaybe<Scalars['String']['input']>;
  amountString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amountString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amountString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amountString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amountString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amountString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amountString_starts_with?: InputMaybe<Scalars['String']['input']>;
  amountString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<MitamaTransfer_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MitamaTransfer_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum MitamaTransfer_OrderBy {
  Amount = 'amount',
  AmountString = 'amountString',
  Block = 'block',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  Time = 'time',
  To = 'to'
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
  compounded?: Maybe<Compounded>;
  compoundeds: Array<Compounded>;
  craft?: Maybe<Craft>;
  crafts: Array<Craft>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  erc20Account?: Maybe<Erc20Account>;
  erc20Accounts: Array<Erc20Account>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  meeple?: Maybe<Meeple>;
  meeples: Array<Meeple>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  mitamaTransfer?: Maybe<MitamaTransfer>;
  mitamaTransfers: Array<MitamaTransfer>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  spend?: Maybe<Spend>;
  spends: Array<Spend>;
  staked?: Maybe<Staked>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakeds: Array<Staked>;
  stakingAccount?: Maybe<StakingAccount>;
  stakingAccounts: Array<StakingAccount>;
  taxPaid?: Maybe<TaxPaid>;
  taxPaids: Array<TaxPaid>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  upkeep?: Maybe<Upkeep>;
  upkeeps: Array<Upkeep>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountClosedByAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountClosedByAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountClosedByAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosedByAdmin_Filter>;
};


export type QueryAccountClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosed_Filter>;
};


export type QueryAccountOpenedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountOpenedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountOpened_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountOpened_Filter>;
};


export type QueryAccountUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountUpdated_Filter>;
};


export type QueryAttackFactionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAttackFactionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AttackFactionEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AttackFactionEvent_Filter>;
};


export type QueryCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Cancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cancelled_Filter>;
};


export type QueryCompoundedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCompoundedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Compounded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Compounded_Filter>;
};


export type QueryCraftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCraftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Craft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Craft_Filter>;
};


export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type QueryErc20AccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc20AccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc20Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc20Account_Filter>;
};


export type QueryFortuneStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFortuneStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FortuneStakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FortuneStakingAccount_Filter>;
};


export type QueryMeepleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMeeplesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Meeple_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Meeple_Filter>;
};


export type QueryMintRequestCancelledEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintRequestCancelledEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MintRequestCancelledEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestCancelledEvent_Filter>;
};


export type QueryMintRequestSuccessEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintRequestSuccessEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MintRequestSuccessEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestSuccessEvent_Filter>;
};


export type QueryMitamaTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMitamaTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MitamaTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MitamaTransfer_Filter>;
};


export type QueryRegisteredSeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegisteredSeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegisteredSeason_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegisteredSeason_Filter>;
};


export type QuerySpendArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySpendsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Spend_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Spend_Filter>;
};


export type QueryStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakedToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakedToken_Filter>;
};


export type QueryStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type QueryStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingAccount_Filter>;
};


export type QueryTaxPaidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTaxPaidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TaxPaid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TaxPaid_Filter>;
};


export type QueryUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type QueryUpkeepArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUpkeepsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Upkeep_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Upkeep_Filter>;
};


export type QueryWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawn_Filter>;
};

export type RegisteredSeason = {
  __typename?: 'RegisteredSeason';
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  leader: Scalars['String']['output'];
  season: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
};

export type RegisteredSeason_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RegisteredSeason_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  leader?: InputMaybe<Scalars['String']['input']>;
  leader_contains?: InputMaybe<Scalars['String']['input']>;
  leader_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  leader_ends_with?: InputMaybe<Scalars['String']['input']>;
  leader_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  leader_gt?: InputMaybe<Scalars['String']['input']>;
  leader_gte?: InputMaybe<Scalars['String']['input']>;
  leader_in?: InputMaybe<Array<Scalars['String']['input']>>;
  leader_lt?: InputMaybe<Scalars['String']['input']>;
  leader_lte?: InputMaybe<Scalars['String']['input']>;
  leader_not?: InputMaybe<Scalars['String']['input']>;
  leader_not_contains?: InputMaybe<Scalars['String']['input']>;
  leader_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  leader_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  leader_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  leader_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  leader_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  leader_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  leader_starts_with?: InputMaybe<Scalars['String']['input']>;
  leader_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<RegisteredSeason_Filter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonce: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type Spend_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Spend_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nonce?: InputMaybe<Scalars['String']['input']>;
  nonce_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_gt?: InputMaybe<Scalars['String']['input']>;
  nonce_gte?: InputMaybe<Scalars['String']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_lt?: InputMaybe<Scalars['String']['input']>;
  nonce_lte?: InputMaybe<Scalars['String']['input']>;
  nonce_not?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Spend_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  contractAddress: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  tokenId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type StakedToken = {
  __typename?: 'StakedToken';
  amount: Scalars['String']['output'];
  contractAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  tokenId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type StakedToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<StakedToken_Filter>>>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StakedToken_Filter>>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Staked_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Staked_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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

export type StakingAccount = {
  __typename?: 'StakingAccount';
  id: Scalars['ID']['output'];
  totalStaked: Scalars['BigInt']['output'];
  totalStakedString: Scalars['String']['output'];
  vaults: Array<FortuneStakingAccount>;
};


export type StakingAccountVaultsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FortuneStakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FortuneStakingAccount_Filter>;
};

export type StakingAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakingAccount_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StakingAccount_Filter>>>;
  totalStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedString?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_contains?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_gt?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_gte?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalStakedString_lt?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_lte?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_contains?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalStakedString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalStakedString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vaults_?: InputMaybe<FortuneStakingAccount_Filter>;
};

export enum StakingAccount_OrderBy {
  Id = 'id',
  TotalStaked = 'totalStaked',
  TotalStakedString = 'totalStakedString',
  Vaults = 'vaults'
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
  compounded?: Maybe<Compounded>;
  compoundeds: Array<Compounded>;
  craft?: Maybe<Craft>;
  crafts: Array<Craft>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  erc20Account?: Maybe<Erc20Account>;
  erc20Accounts: Array<Erc20Account>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  meeple?: Maybe<Meeple>;
  meeples: Array<Meeple>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  mitamaTransfer?: Maybe<MitamaTransfer>;
  mitamaTransfers: Array<MitamaTransfer>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  spend?: Maybe<Spend>;
  spends: Array<Spend>;
  staked?: Maybe<Staked>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakeds: Array<Staked>;
  stakingAccount?: Maybe<StakingAccount>;
  stakingAccounts: Array<StakingAccount>;
  taxPaid?: Maybe<TaxPaid>;
  taxPaids: Array<TaxPaid>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  upkeep?: Maybe<Upkeep>;
  upkeeps: Array<Upkeep>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountClosedByAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountClosedByAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountClosedByAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosedByAdmin_Filter>;
};


export type SubscriptionAccountClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountClosed_Filter>;
};


export type SubscriptionAccountOpenedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountOpenedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountOpened_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountOpened_Filter>;
};


export type SubscriptionAccountUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountUpdated_Filter>;
};


export type SubscriptionAttackFactionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAttackFactionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AttackFactionEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AttackFactionEvent_Filter>;
};


export type SubscriptionCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Cancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cancelled_Filter>;
};


export type SubscriptionCompoundedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCompoundedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Compounded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Compounded_Filter>;
};


export type SubscriptionCraftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCraftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Craft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Craft_Filter>;
};


export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type SubscriptionErc20AccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc20AccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc20Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc20Account_Filter>;
};


export type SubscriptionFortuneStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFortuneStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FortuneStakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FortuneStakingAccount_Filter>;
};


export type SubscriptionMeepleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMeeplesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Meeple_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Meeple_Filter>;
};


export type SubscriptionMintRequestCancelledEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintRequestCancelledEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MintRequestCancelledEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestCancelledEvent_Filter>;
};


export type SubscriptionMintRequestSuccessEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintRequestSuccessEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MintRequestSuccessEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MintRequestSuccessEvent_Filter>;
};


export type SubscriptionMitamaTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMitamaTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MitamaTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MitamaTransfer_Filter>;
};


export type SubscriptionRegisteredSeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegisteredSeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegisteredSeason_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegisteredSeason_Filter>;
};


export type SubscriptionSpendArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSpendsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Spend_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Spend_Filter>;
};


export type SubscriptionStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakedToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakedToken_Filter>;
};


export type SubscriptionStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type SubscriptionStakingAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakingAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingAccount_Filter>;
};


export type SubscriptionTaxPaidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTaxPaidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TaxPaid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TaxPaid_Filter>;
};


export type SubscriptionUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type SubscriptionUpkeepArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUpkeepsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Upkeep_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Upkeep_Filter>;
};


export type SubscriptionWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawn_Filter>;
};

export type TaxPaid = {
  __typename?: 'TaxPaid';
  block: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nftId: Scalars['String']['output'];
  tax: Scalars['BigInt']['output'];
  taxString: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type TaxPaid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TaxPaid_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nftId?: InputMaybe<Scalars['String']['input']>;
  nftId_contains?: InputMaybe<Scalars['String']['input']>;
  nftId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nftId_ends_with?: InputMaybe<Scalars['String']['input']>;
  nftId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nftId_gt?: InputMaybe<Scalars['String']['input']>;
  nftId_gte?: InputMaybe<Scalars['String']['input']>;
  nftId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nftId_lt?: InputMaybe<Scalars['String']['input']>;
  nftId_lte?: InputMaybe<Scalars['String']['input']>;
  nftId_not?: InputMaybe<Scalars['String']['input']>;
  nftId_not_contains?: InputMaybe<Scalars['String']['input']>;
  nftId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nftId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nftId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nftId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nftId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nftId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nftId_starts_with?: InputMaybe<Scalars['String']['input']>;
  nftId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TaxPaid_Filter>>>;
  tax?: InputMaybe<Scalars['BigInt']['input']>;
  taxString?: InputMaybe<Scalars['String']['input']>;
  taxString_contains?: InputMaybe<Scalars['String']['input']>;
  taxString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  taxString_ends_with?: InputMaybe<Scalars['String']['input']>;
  taxString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  taxString_gt?: InputMaybe<Scalars['String']['input']>;
  taxString_gte?: InputMaybe<Scalars['String']['input']>;
  taxString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  taxString_lt?: InputMaybe<Scalars['String']['input']>;
  taxString_lte?: InputMaybe<Scalars['String']['input']>;
  taxString_not?: InputMaybe<Scalars['String']['input']>;
  taxString_not_contains?: InputMaybe<Scalars['String']['input']>;
  taxString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  taxString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  taxString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  taxString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  taxString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  taxString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  taxString_starts_with?: InputMaybe<Scalars['String']['input']>;
  taxString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tax_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tax_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tax_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tax_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tax_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tax_not?: InputMaybe<Scalars['BigInt']['input']>;
  tax_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TaxPaid_OrderBy {
  Block = 'block',
  Hash = 'hash',
  Id = 'id',
  NftId = 'nftId',
  Tax = 'tax',
  TaxString = 'taxString',
  Time = 'time',
  User = 'user'
}

export type Unstaked = {
  __typename?: 'Unstaked';
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  contractAddress: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
  tokenId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type Unstaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Unstaked_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Unstaked_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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

export type Upkeep = {
  __typename?: 'Upkeep';
  block: Scalars['BigInt']['output'];
  digest: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  time: Scalars['BigInt']['output'];
};

export type Upkeep_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Upkeep_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  digest?: InputMaybe<Scalars['String']['input']>;
  digest_contains?: InputMaybe<Scalars['String']['input']>;
  digest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_gt?: InputMaybe<Scalars['String']['input']>;
  digest_gte?: InputMaybe<Scalars['String']['input']>;
  digest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_lt?: InputMaybe<Scalars['String']['input']>;
  digest_lte?: InputMaybe<Scalars['String']['input']>;
  digest_not?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains?: InputMaybe<Scalars['String']['input']>;
  digest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  digest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with?: InputMaybe<Scalars['String']['input']>;
  digest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Upkeep_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Upkeep_OrderBy {
  Block = 'block',
  Digest = 'digest',
  Hash = 'hash',
  Id = 'id',
  Time = 'time'
}

export type Withdrawn = {
  __typename?: 'Withdrawn';
  amount: Scalars['String']['output'];
  block: Scalars['BigInt']['output'];
  burntAmount: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonce: Scalars['String']['output'];
  time: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type Withdrawn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['String']['input']>;
  amount_contains?: InputMaybe<Scalars['String']['input']>;
  amount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_gt?: InputMaybe<Scalars['String']['input']>;
  amount_gte?: InputMaybe<Scalars['String']['input']>;
  amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_lt?: InputMaybe<Scalars['String']['input']>;
  amount_lte?: InputMaybe<Scalars['String']['input']>;
  amount_not?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains?: InputMaybe<Scalars['String']['input']>;
  amount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  amount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Withdrawn_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burntAmount?: InputMaybe<Scalars['String']['input']>;
  burntAmount_contains?: InputMaybe<Scalars['String']['input']>;
  burntAmount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  burntAmount_ends_with?: InputMaybe<Scalars['String']['input']>;
  burntAmount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  burntAmount_gt?: InputMaybe<Scalars['String']['input']>;
  burntAmount_gte?: InputMaybe<Scalars['String']['input']>;
  burntAmount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  burntAmount_lt?: InputMaybe<Scalars['String']['input']>;
  burntAmount_lte?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_contains?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  burntAmount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  burntAmount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  burntAmount_starts_with?: InputMaybe<Scalars['String']['input']>;
  burntAmount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nonce?: InputMaybe<Scalars['String']['input']>;
  nonce_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_gt?: InputMaybe<Scalars['String']['input']>;
  nonce_gte?: InputMaybe<Scalars['String']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_lt?: InputMaybe<Scalars['String']['input']>;
  nonce_lte?: InputMaybe<Scalars['String']['input']>;
  nonce_not?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with?: InputMaybe<Scalars['String']['input']>;
  nonce_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Withdrawn_Filter>>>;
  time?: InputMaybe<Scalars['BigInt']['input']>;
  time_gt?: InputMaybe<Scalars['BigInt']['input']>;
  time_gte?: InputMaybe<Scalars['BigInt']['input']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  time_lt?: InputMaybe<Scalars['BigInt']['input']>;
  time_lte?: InputMaybe<Scalars['BigInt']['input']>;
  time_not?: InputMaybe<Scalars['BigInt']['input']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
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
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

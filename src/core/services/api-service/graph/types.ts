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
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: { input: any; output: any; }
};

export type AccessControl = {
  __typename?: 'AccessControl';
  asAccount: Account;
  id: Scalars['ID']['output'];
  roles: Array<AccessControlRole>;
};


export type AccessControlRolesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRole_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccessControlRole_Filter>;
};

export type AccessControlRole = {
  __typename?: 'AccessControlRole';
  admin: AccessControlRole;
  adminOf: Array<AccessControlRole>;
  contract: AccessControl;
  id: Scalars['ID']['output'];
  members: Array<AccessControlRoleMember>;
  role: Role;
  roleAdminChanged: Array<RoleAdminChanged>;
  roleGranted: Array<RoleGranted>;
  roleRevoked: Array<RoleRevoked>;
};


export type AccessControlRoleAdminOfArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRole_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccessControlRole_Filter>;
};


export type AccessControlRoleMembersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRoleMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccessControlRoleMember_Filter>;
};


export type AccessControlRoleRoleAdminChangedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleAdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleAdminChanged_Filter>;
};


export type AccessControlRoleRoleGrantedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleGranted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleGranted_Filter>;
};


export type AccessControlRoleRoleRevokedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleRevoked_Filter>;
};

export type AccessControlRoleMember = {
  __typename?: 'AccessControlRoleMember';
  accesscontrolrole: AccessControlRole;
  account: Account;
  id: Scalars['ID']['output'];
};

export type AccessControlRoleMember_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accesscontrolrole?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_?: InputMaybe<AccessControlRole_Filter>;
  accesscontrolrole_contains?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_ends_with?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_gt?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_gte?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accesscontrolrole_lt?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_lte?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_contains?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accesscontrolrole_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_starts_with?: InputMaybe<Scalars['String']['input']>;
  accesscontrolrole_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AccessControlRoleMember_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccessControlRoleMember_Filter>>>;
};

export enum AccessControlRoleMember_OrderBy {
  Accesscontrolrole = 'accesscontrolrole',
  AccesscontrolroleId = 'accesscontrolrole__id',
  Account = 'account',
  AccountId = 'account__id',
  AccountIsContract = 'account__isContract',
  Id = 'id'
}

export type AccessControlRole_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars['String']['input']>;
  adminOf_?: InputMaybe<AccessControlRole_Filter>;
  admin_?: InputMaybe<AccessControlRole_Filter>;
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
  and?: InputMaybe<Array<InputMaybe<AccessControlRole_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<AccessControl_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  members_?: InputMaybe<AccessControlRoleMember_Filter>;
  or?: InputMaybe<Array<InputMaybe<AccessControlRole_Filter>>>;
  role?: InputMaybe<Scalars['String']['input']>;
  roleAdminChanged_?: InputMaybe<RoleAdminChanged_Filter>;
  roleGranted_?: InputMaybe<RoleGranted_Filter>;
  roleRevoked_?: InputMaybe<RoleRevoked_Filter>;
  role_?: InputMaybe<Role_Filter>;
  role_contains?: InputMaybe<Scalars['String']['input']>;
  role_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_gt?: InputMaybe<Scalars['String']['input']>;
  role_gte?: InputMaybe<Scalars['String']['input']>;
  role_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_lt?: InputMaybe<Scalars['String']['input']>;
  role_lte?: InputMaybe<Scalars['String']['input']>;
  role_not?: InputMaybe<Scalars['String']['input']>;
  role_not_contains?: InputMaybe<Scalars['String']['input']>;
  role_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum AccessControlRole_OrderBy {
  Admin = 'admin',
  AdminOf = 'adminOf',
  AdminId = 'admin__id',
  Contract = 'contract',
  ContractId = 'contract__id',
  Id = 'id',
  Members = 'members',
  Role = 'role',
  RoleAdminChanged = 'roleAdminChanged',
  RoleGranted = 'roleGranted',
  RoleRevoked = 'roleRevoked',
  RoleId = 'role__id'
}

export type AccessControl_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AccessControl_Filter>>>;
  asAccount?: InputMaybe<Scalars['String']['input']>;
  asAccount_?: InputMaybe<Account_Filter>;
  asAccount_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_gt?: InputMaybe<Scalars['String']['input']>;
  asAccount_gte?: InputMaybe<Scalars['String']['input']>;
  asAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_lt?: InputMaybe<Scalars['String']['input']>;
  asAccount_lte?: InputMaybe<Scalars['String']['input']>;
  asAccount_not?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccessControl_Filter>>>;
  roles_?: InputMaybe<AccessControlRole_Filter>;
};

export enum AccessControl_OrderBy {
  AsAccount = 'asAccount',
  AsAccountId = 'asAccount__id',
  AsAccountIsContract = 'asAccount__isContract',
  Id = 'id',
  Roles = 'roles'
}

export type Account = {
  __typename?: 'Account';
  ERC721operatorOperator: Array<Erc721Operator>;
  ERC721operatorOwner: Array<Erc721Operator>;
  ERC721tokens: Array<Erc721Token>;
  ERC721transferFromEvent: Array<Erc721Transfer>;
  ERC721transferToEvent: Array<Erc721Transfer>;
  ERC1155balances: Array<Erc1155Balance>;
  ERC1155operatorOperator: Array<Erc1155Operator>;
  ERC1155operatorOwner: Array<Erc1155Operator>;
  ERC1155transferFromEvent: Array<Erc1155Transfer>;
  ERC1155transferOperatorEvent: Array<Erc1155Transfer>;
  ERC1155transferToEvent: Array<Erc1155Transfer>;
  asAccessControl?: Maybe<AccessControl>;
  asERC721?: Maybe<Erc721Contract>;
  asERC1155?: Maybe<Erc1155Contract>;
  asOwnable?: Maybe<Ownable>;
  balance: Scalars['BigInt']['output'];
  events: Array<Event>;
  id: Scalars['ID']['output'];
  isContract: Scalars['Int']['output'];
  membership: Array<AccessControlRoleMember>;
  ownerOf: Array<Ownable>;
  ownershipTransferred: Array<OwnershipTransferred>;
  roleGranted: Array<RoleGranted>;
  roleGrantedSender: Array<RoleGranted>;
  roleRevoked: Array<RoleRevoked>;
  roleRevokedSender: Array<RoleRevoked>;
  vaults: Array<PresaleVault>;
};


export type AccountErc721operatorOperatorArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Operator_Filter>;
};


export type AccountErc721operatorOwnerArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Operator_Filter>;
};


export type AccountErc721tokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Token_Filter>;
};


export type AccountErc721transferFromEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};


export type AccountErc721transferToEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};


export type AccountErc1155balancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Balance_Filter>;
};


export type AccountErc1155operatorOperatorArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Operator_Filter>;
};


export type AccountErc1155operatorOwnerArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Operator_Filter>;
};


export type AccountErc1155transferFromEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type AccountErc1155transferOperatorEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type AccountErc1155transferToEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type AccountEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Event_Filter>;
};


export type AccountMembershipArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRoleMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccessControlRoleMember_Filter>;
};


export type AccountOwnerOfArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ownable_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Ownable_Filter>;
};


export type AccountOwnershipTransferredArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};


export type AccountRoleGrantedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleGranted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleGranted_Filter>;
};


export type AccountRoleGrantedSenderArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleGranted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleGranted_Filter>;
};


export type AccountRoleRevokedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleRevoked_Filter>;
};


export type AccountRoleRevokedSenderArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoleRevoked_Filter>;
};


export type AccountVaultsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PresaleVault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PresaleVault_Filter>;
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

export type Account_Filter = {
  ERC721operatorOperator_?: InputMaybe<Erc721Operator_Filter>;
  ERC721operatorOwner_?: InputMaybe<Erc721Operator_Filter>;
  ERC721tokens_?: InputMaybe<Erc721Token_Filter>;
  ERC721transferFromEvent_?: InputMaybe<Erc721Transfer_Filter>;
  ERC721transferToEvent_?: InputMaybe<Erc721Transfer_Filter>;
  ERC1155balances_?: InputMaybe<Erc1155Balance_Filter>;
  ERC1155operatorOperator_?: InputMaybe<Erc1155Operator_Filter>;
  ERC1155operatorOwner_?: InputMaybe<Erc1155Operator_Filter>;
  ERC1155transferFromEvent_?: InputMaybe<Erc1155Transfer_Filter>;
  ERC1155transferOperatorEvent_?: InputMaybe<Erc1155Transfer_Filter>;
  ERC1155transferToEvent_?: InputMaybe<Erc1155Transfer_Filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  asAccessControl?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_?: InputMaybe<AccessControl_Filter>;
  asAccessControl_contains?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_gt?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_gte?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccessControl_lt?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_lte?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_contains?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccessControl_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccessControl_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721?: InputMaybe<Scalars['String']['input']>;
  asERC721_?: InputMaybe<Erc721Contract_Filter>;
  asERC721_contains?: InputMaybe<Scalars['String']['input']>;
  asERC721_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721_ends_with?: InputMaybe<Scalars['String']['input']>;
  asERC721_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721_gt?: InputMaybe<Scalars['String']['input']>;
  asERC721_gte?: InputMaybe<Scalars['String']['input']>;
  asERC721_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asERC721_lt?: InputMaybe<Scalars['String']['input']>;
  asERC721_lte?: InputMaybe<Scalars['String']['input']>;
  asERC721_not?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_contains?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asERC721_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asERC721_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC721_starts_with?: InputMaybe<Scalars['String']['input']>;
  asERC721_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155?: InputMaybe<Scalars['String']['input']>;
  asERC1155_?: InputMaybe<Erc1155Contract_Filter>;
  asERC1155_contains?: InputMaybe<Scalars['String']['input']>;
  asERC1155_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155_ends_with?: InputMaybe<Scalars['String']['input']>;
  asERC1155_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155_gt?: InputMaybe<Scalars['String']['input']>;
  asERC1155_gte?: InputMaybe<Scalars['String']['input']>;
  asERC1155_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asERC1155_lt?: InputMaybe<Scalars['String']['input']>;
  asERC1155_lte?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_contains?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asERC1155_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asERC1155_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asERC1155_starts_with?: InputMaybe<Scalars['String']['input']>;
  asERC1155_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable?: InputMaybe<Scalars['String']['input']>;
  asOwnable_?: InputMaybe<Ownable_Filter>;
  asOwnable_contains?: InputMaybe<Scalars['String']['input']>;
  asOwnable_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable_ends_with?: InputMaybe<Scalars['String']['input']>;
  asOwnable_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable_gt?: InputMaybe<Scalars['String']['input']>;
  asOwnable_gte?: InputMaybe<Scalars['String']['input']>;
  asOwnable_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asOwnable_lt?: InputMaybe<Scalars['String']['input']>;
  asOwnable_lte?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_contains?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asOwnable_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asOwnable_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asOwnable_starts_with?: InputMaybe<Scalars['String']['input']>;
  asOwnable_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  events_?: InputMaybe<Event_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isContract?: InputMaybe<Scalars['Int']['input']>;
  isContract_gt?: InputMaybe<Scalars['Int']['input']>;
  isContract_gte?: InputMaybe<Scalars['Int']['input']>;
  isContract_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  isContract_lt?: InputMaybe<Scalars['Int']['input']>;
  isContract_lte?: InputMaybe<Scalars['Int']['input']>;
  isContract_not?: InputMaybe<Scalars['Int']['input']>;
  isContract_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  membership_?: InputMaybe<AccessControlRoleMember_Filter>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  ownerOf_?: InputMaybe<Ownable_Filter>;
  ownershipTransferred_?: InputMaybe<OwnershipTransferred_Filter>;
  roleGrantedSender_?: InputMaybe<RoleGranted_Filter>;
  roleGranted_?: InputMaybe<RoleGranted_Filter>;
  roleRevokedSender_?: InputMaybe<RoleRevoked_Filter>;
  roleRevoked_?: InputMaybe<RoleRevoked_Filter>;
  vaults_?: InputMaybe<PresaleVault_Filter>;
};

export enum Account_OrderBy {
  Erc721operatorOperator = 'ERC721operatorOperator',
  Erc721operatorOwner = 'ERC721operatorOwner',
  Erc721tokens = 'ERC721tokens',
  Erc721transferFromEvent = 'ERC721transferFromEvent',
  Erc721transferToEvent = 'ERC721transferToEvent',
  Erc1155balances = 'ERC1155balances',
  Erc1155operatorOperator = 'ERC1155operatorOperator',
  Erc1155operatorOwner = 'ERC1155operatorOwner',
  Erc1155transferFromEvent = 'ERC1155transferFromEvent',
  Erc1155transferOperatorEvent = 'ERC1155transferOperatorEvent',
  Erc1155transferToEvent = 'ERC1155transferToEvent',
  AsAccessControl = 'asAccessControl',
  AsAccessControlId = 'asAccessControl__id',
  AsErc721 = 'asERC721',
  AsErc721Holders = 'asERC721__holders',
  AsErc721Id = 'asERC721__id',
  AsErc721Name = 'asERC721__name',
  AsErc721SupportsMetadata = 'asERC721__supportsMetadata',
  AsErc721Symbol = 'asERC721__symbol',
  AsErc1155 = 'asERC1155',
  AsErc1155Id = 'asERC1155__id',
  AsOwnable = 'asOwnable',
  AsOwnableId = 'asOwnable__id',
  Balance = 'balance',
  Events = 'events',
  Id = 'id',
  IsContract = 'isContract',
  Membership = 'membership',
  OwnerOf = 'ownerOf',
  OwnershipTransferred = 'ownershipTransferred',
  RoleGranted = 'roleGranted',
  RoleGrantedSender = 'roleGrantedSender',
  RoleRevoked = 'roleRevoked',
  RoleRevokedSender = 'roleRevokedSender',
  Vaults = 'vaults'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
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

export type Erc721Contract = {
  __typename?: 'ERC721Contract';
  asAccount: Account;
  holders: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  operators: Array<Erc721Operator>;
  supportsMetadata?: Maybe<Scalars['Boolean']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  tokens: Array<Erc721Token>;
  totalSupply: Erc721TokenBalance;
  transfers: Array<Erc721Transfer>;
};


export type Erc721ContractOperatorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Operator_Filter>;
};


export type Erc721ContractTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Token_Filter>;
};


export type Erc721ContractTransfersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};

export type Erc721Contract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc721Contract_Filter>>>;
  asAccount?: InputMaybe<Scalars['String']['input']>;
  asAccount_?: InputMaybe<Account_Filter>;
  asAccount_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_gt?: InputMaybe<Scalars['String']['input']>;
  asAccount_gte?: InputMaybe<Scalars['String']['input']>;
  asAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_lt?: InputMaybe<Scalars['String']['input']>;
  asAccount_lte?: InputMaybe<Scalars['String']['input']>;
  asAccount_not?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holders?: InputMaybe<Scalars['BigInt']['input']>;
  holders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holders_not?: InputMaybe<Scalars['BigInt']['input']>;
  holders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operators_?: InputMaybe<Erc721Operator_Filter>;
  or?: InputMaybe<Array<InputMaybe<Erc721Contract_Filter>>>;
  supportsMetadata?: InputMaybe<Scalars['Boolean']['input']>;
  supportsMetadata_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  supportsMetadata_not?: InputMaybe<Scalars['Boolean']['input']>;
  supportsMetadata_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokens_?: InputMaybe<Erc721Token_Filter>;
  totalSupply?: InputMaybe<Scalars['String']['input']>;
  totalSupply_?: InputMaybe<Erc721TokenBalance_Filter>;
  totalSupply_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupply_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['String']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['String']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['String']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalSupply_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transfers_?: InputMaybe<Erc721Transfer_Filter>;
};

export enum Erc721Contract_OrderBy {
  AsAccount = 'asAccount',
  AsAccountId = 'asAccount__id',
  AsAccountIsContract = 'asAccount__isContract',
  Holders = 'holders',
  Id = 'id',
  Name = 'name',
  Operators = 'operators',
  SupportsMetadata = 'supportsMetadata',
  Symbol = 'symbol',
  Tokens = 'tokens',
  TotalSupply = 'totalSupply',
  TotalSupplyId = 'totalSupply__id',
  TotalSupplyValue = 'totalSupply__value',
  TotalSupplyValueString = 'totalSupply__valueString',
  Transfers = 'transfers'
}

export type Erc721Operator = {
  __typename?: 'ERC721Operator';
  approved: Scalars['Boolean']['output'];
  contract: Erc721Contract;
  id: Scalars['ID']['output'];
  operator: Account;
  owner: Account;
};

export type Erc721Operator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc721Operator_Filter>>>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  approved_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  approved_not?: InputMaybe<Scalars['Boolean']['input']>;
  approved_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc721Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Account_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Erc721Operator_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Erc721Operator_OrderBy {
  Approved = 'approved',
  Contract = 'contract',
  ContractHolders = 'contract__holders',
  ContractId = 'contract__id',
  ContractName = 'contract__name',
  ContractSupportsMetadata = 'contract__supportsMetadata',
  ContractSymbol = 'contract__symbol',
  Id = 'id',
  Operator = 'operator',
  OperatorId = 'operator__id',
  OperatorIsContract = 'operator__isContract',
  Owner = 'owner',
  OwnerId = 'owner__id',
  OwnerIsContract = 'owner__isContract'
}

export type Erc721Token = {
  __typename?: 'ERC721Token';
  approval: Account;
  contract: Erc721Contract;
  id: Scalars['ID']['output'];
  identifier: Scalars['BigInt']['output'];
  identifierString: Scalars['String']['output'];
  owner: Account;
  ownerBalance: Erc721TokenBalance;
  staked: Scalars['Boolean']['output'];
  stakedOwner?: Maybe<Account>;
  stakedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  timestamp: Scalars['BigInt']['output'];
  transfers: Array<Erc721Transfer>;
  uri?: Maybe<Scalars['String']['output']>;
};


export type Erc721TokenTransfersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};

export type Erc721TokenBalance = {
  __typename?: 'ERC721TokenBalance';
  account?: Maybe<Account>;
  contract: Erc721Contract;
  id: Scalars['ID']['output'];
  tokens: Array<Erc721Token>;
  transferFromEvent: Array<Erc721Transfer>;
  transferToEvent: Array<Erc721Transfer>;
  value: Scalars['BigInt']['output'];
  valueString: Scalars['String']['output'];
};


export type Erc721TokenBalanceTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Token_Filter>;
};


export type Erc721TokenBalanceTransferFromEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};


export type Erc721TokenBalanceTransferToEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc721Transfer_Filter>;
};

export type Erc721TokenBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Erc721TokenBalance_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc721Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc721TokenBalance_Filter>>>;
  tokens_?: InputMaybe<Erc721Token_Filter>;
  transferFromEvent_?: InputMaybe<Erc721Transfer_Filter>;
  transferToEvent_?: InputMaybe<Erc721Transfer_Filter>;
  value?: InputMaybe<Scalars['BigInt']['input']>;
  valueString?: InputMaybe<Scalars['String']['input']>;
  valueString_contains?: InputMaybe<Scalars['String']['input']>;
  valueString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_gt?: InputMaybe<Scalars['String']['input']>;
  valueString_gte?: InputMaybe<Scalars['String']['input']>;
  valueString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueString_lt?: InputMaybe<Scalars['String']['input']>;
  valueString_lte?: InputMaybe<Scalars['String']['input']>;
  valueString_not?: InputMaybe<Scalars['String']['input']>;
  valueString_not_contains?: InputMaybe<Scalars['String']['input']>;
  valueString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_gt?: InputMaybe<Scalars['BigInt']['input']>;
  value_gte?: InputMaybe<Scalars['BigInt']['input']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  value_lt?: InputMaybe<Scalars['BigInt']['input']>;
  value_lte?: InputMaybe<Scalars['BigInt']['input']>;
  value_not?: InputMaybe<Scalars['BigInt']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Erc721TokenBalance_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  AccountIsContract = 'account__isContract',
  Contract = 'contract',
  ContractHolders = 'contract__holders',
  ContractId = 'contract__id',
  ContractName = 'contract__name',
  ContractSupportsMetadata = 'contract__supportsMetadata',
  ContractSymbol = 'contract__symbol',
  Id = 'id',
  Tokens = 'tokens',
  TransferFromEvent = 'transferFromEvent',
  TransferToEvent = 'transferToEvent',
  Value = 'value',
  ValueString = 'valueString'
}

export type Erc721Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc721Token_Filter>>>;
  approval?: InputMaybe<Scalars['String']['input']>;
  approval_?: InputMaybe<Account_Filter>;
  approval_contains?: InputMaybe<Scalars['String']['input']>;
  approval_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  approval_ends_with?: InputMaybe<Scalars['String']['input']>;
  approval_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approval_gt?: InputMaybe<Scalars['String']['input']>;
  approval_gte?: InputMaybe<Scalars['String']['input']>;
  approval_in?: InputMaybe<Array<Scalars['String']['input']>>;
  approval_lt?: InputMaybe<Scalars['String']['input']>;
  approval_lte?: InputMaybe<Scalars['String']['input']>;
  approval_not?: InputMaybe<Scalars['String']['input']>;
  approval_not_contains?: InputMaybe<Scalars['String']['input']>;
  approval_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  approval_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  approval_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approval_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  approval_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  approval_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approval_starts_with?: InputMaybe<Scalars['String']['input']>;
  approval_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc721Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  identifier?: InputMaybe<Scalars['BigInt']['input']>;
  identifierString?: InputMaybe<Scalars['String']['input']>;
  identifierString_contains?: InputMaybe<Scalars['String']['input']>;
  identifierString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_ends_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_gt?: InputMaybe<Scalars['String']['input']>;
  identifierString_gte?: InputMaybe<Scalars['String']['input']>;
  identifierString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  identifierString_lt?: InputMaybe<Scalars['String']['input']>;
  identifierString_lte?: InputMaybe<Scalars['String']['input']>;
  identifierString_not?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_contains?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  identifierString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_starts_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifier_gt?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_gte?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  identifier_lt?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_lte?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_not?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc721Token_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  ownerBalance?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_?: InputMaybe<Erc721TokenBalance_Filter>;
  ownerBalance_contains?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_gt?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_gte?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerBalance_lt?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_lte?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  staked?: InputMaybe<Scalars['Boolean']['input']>;
  stakedOwner?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_?: InputMaybe<Account_Filter>;
  stakedOwner_contains?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_gt?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_gte?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stakedOwner_lt?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_lte?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stakedOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  stakedOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  staked_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  staked_not?: InputMaybe<Scalars['Boolean']['input']>;
  staked_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transfers_?: InputMaybe<Erc721Transfer_Filter>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  uri_lte?: InputMaybe<Scalars['String']['input']>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Erc721Token_OrderBy {
  Approval = 'approval',
  ApprovalId = 'approval__id',
  ApprovalIsContract = 'approval__isContract',
  Contract = 'contract',
  ContractHolders = 'contract__holders',
  ContractId = 'contract__id',
  ContractName = 'contract__name',
  ContractSupportsMetadata = 'contract__supportsMetadata',
  ContractSymbol = 'contract__symbol',
  Id = 'id',
  Identifier = 'identifier',
  IdentifierString = 'identifierString',
  Owner = 'owner',
  OwnerBalance = 'ownerBalance',
  OwnerBalanceId = 'ownerBalance__id',
  OwnerBalanceValue = 'ownerBalance__value',
  OwnerBalanceValueString = 'ownerBalance__valueString',
  OwnerId = 'owner__id',
  OwnerIsContract = 'owner__isContract',
  Staked = 'staked',
  StakedOwner = 'stakedOwner',
  StakedOwnerId = 'stakedOwner__id',
  StakedOwnerIsContract = 'stakedOwner__isContract',
  StakedTimestamp = 'stakedTimestamp',
  Timestamp = 'timestamp',
  Transfers = 'transfers',
  Uri = 'uri'
}

export type Erc721Transfer = Event & {
  __typename?: 'ERC721Transfer';
  contract: Erc721Contract;
  emitter: Account;
  from: Account;
  fromBalance: Erc721TokenBalance;
  id: Scalars['ID']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Account;
  toBalance: Erc721TokenBalance;
  token: Erc721Token;
  transaction?: Maybe<Transaction>;
};

export type Erc721Transfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc721Transfer_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc721Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  fromBalance?: InputMaybe<Scalars['String']['input']>;
  fromBalance_?: InputMaybe<Erc721TokenBalance_Filter>;
  fromBalance_contains?: InputMaybe<Scalars['String']['input']>;
  fromBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_gt?: InputMaybe<Scalars['String']['input']>;
  fromBalance_gte?: InputMaybe<Scalars['String']['input']>;
  fromBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromBalance_lt?: InputMaybe<Scalars['String']['input']>;
  fromBalance_lte?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<Account_Filter>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc721Transfer_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  toBalance?: InputMaybe<Scalars['String']['input']>;
  toBalance_?: InputMaybe<Erc721TokenBalance_Filter>;
  toBalance_contains?: InputMaybe<Scalars['String']['input']>;
  toBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_gt?: InputMaybe<Scalars['String']['input']>;
  toBalance_gte?: InputMaybe<Scalars['String']['input']>;
  toBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toBalance_lt?: InputMaybe<Scalars['String']['input']>;
  toBalance_lte?: InputMaybe<Scalars['String']['input']>;
  toBalance_not?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<Account_Filter>;
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
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Erc721Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Erc721Transfer_OrderBy {
  Contract = 'contract',
  ContractHolders = 'contract__holders',
  ContractId = 'contract__id',
  ContractName = 'contract__name',
  ContractSupportsMetadata = 'contract__supportsMetadata',
  ContractSymbol = 'contract__symbol',
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  From = 'from',
  FromBalance = 'fromBalance',
  FromBalanceId = 'fromBalance__id',
  FromBalanceValue = 'fromBalance__value',
  FromBalanceValueString = 'fromBalance__valueString',
  FromId = 'from__id',
  FromIsContract = 'from__isContract',
  Id = 'id',
  Timestamp = 'timestamp',
  To = 'to',
  ToBalance = 'toBalance',
  ToBalanceId = 'toBalance__id',
  ToBalanceValue = 'toBalance__value',
  ToBalanceValueString = 'toBalance__valueString',
  ToId = 'to__id',
  ToIsContract = 'to__isContract',
  Token = 'token',
  TokenId = 'token__id',
  TokenIdentifier = 'token__identifier',
  TokenIdentifierString = 'token__identifierString',
  TokenStaked = 'token__staked',
  TokenStakedTimestamp = 'token__stakedTimestamp',
  TokenTimestamp = 'token__timestamp',
  TokenUri = 'token__uri',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
}

export type Erc1155Balance = {
  __typename?: 'ERC1155Balance';
  account?: Maybe<Account>;
  contract: Erc1155Contract;
  id: Scalars['ID']['output'];
  token: Erc1155Token;
  transferFromEvent: Array<Erc1155Transfer>;
  transferToEvent: Array<Erc1155Transfer>;
  value: Scalars['BigDecimal']['output'];
  valueExact: Scalars['BigInt']['output'];
  valueExactString: Scalars['String']['output'];
};


export type Erc1155BalanceTransferFromEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type Erc1155BalanceTransferToEventArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};

export type Erc1155Balance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Erc1155Balance_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc1155Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc1155Balance_Filter>>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Erc1155Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transferFromEvent_?: InputMaybe<Erc1155Transfer_Filter>;
  transferToEvent_?: InputMaybe<Erc1155Transfer_Filter>;
  value?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueExact?: InputMaybe<Scalars['BigInt']['input']>;
  valueExactString?: InputMaybe<Scalars['String']['input']>;
  valueExactString_contains?: InputMaybe<Scalars['String']['input']>;
  valueExactString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExactString_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueExactString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExactString_gt?: InputMaybe<Scalars['String']['input']>;
  valueExactString_gte?: InputMaybe<Scalars['String']['input']>;
  valueExactString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueExactString_lt?: InputMaybe<Scalars['String']['input']>;
  valueExactString_lte?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_contains?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueExactString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueExactString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExactString_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueExactString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueExact_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueExact_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  value_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  value_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Erc1155Balance_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  AccountIsContract = 'account__isContract',
  Contract = 'contract',
  ContractId = 'contract__id',
  Id = 'id',
  Token = 'token',
  TokenHolders = 'token__holders',
  TokenHoldersString = 'token__holdersString',
  TokenId = 'token__id',
  TokenIdentifier = 'token__identifier',
  TokenIdentifierString = 'token__identifierString',
  TokenUri = 'token__uri',
  TransferFromEvent = 'transferFromEvent',
  TransferToEvent = 'transferToEvent',
  Value = 'value',
  ValueExact = 'valueExact',
  ValueExactString = 'valueExactString'
}

export type Erc1155Contract = {
  __typename?: 'ERC1155Contract';
  asAccount: Account;
  balances: Array<Erc1155Balance>;
  id: Scalars['ID']['output'];
  operators: Array<Erc1155Operator>;
  tokens: Array<Erc1155Token>;
  transfers: Array<Erc1155Transfer>;
};


export type Erc1155ContractBalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Balance_Filter>;
};


export type Erc1155ContractOperatorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Operator_Filter>;
};


export type Erc1155ContractTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Token_Filter>;
};


export type Erc1155ContractTransfersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};

export type Erc1155Contract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc1155Contract_Filter>>>;
  asAccount?: InputMaybe<Scalars['String']['input']>;
  asAccount_?: InputMaybe<Account_Filter>;
  asAccount_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_gt?: InputMaybe<Scalars['String']['input']>;
  asAccount_gte?: InputMaybe<Scalars['String']['input']>;
  asAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_lt?: InputMaybe<Scalars['String']['input']>;
  asAccount_lte?: InputMaybe<Scalars['String']['input']>;
  asAccount_not?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balances_?: InputMaybe<Erc1155Balance_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operators_?: InputMaybe<Erc1155Operator_Filter>;
  or?: InputMaybe<Array<InputMaybe<Erc1155Contract_Filter>>>;
  tokens_?: InputMaybe<Erc1155Token_Filter>;
  transfers_?: InputMaybe<Erc1155Transfer_Filter>;
};

export enum Erc1155Contract_OrderBy {
  AsAccount = 'asAccount',
  AsAccountId = 'asAccount__id',
  AsAccountIsContract = 'asAccount__isContract',
  Balances = 'balances',
  Id = 'id',
  Operators = 'operators',
  Tokens = 'tokens',
  Transfers = 'transfers'
}

export type Erc1155Operator = {
  __typename?: 'ERC1155Operator';
  approved: Scalars['Boolean']['output'];
  contract: Erc1155Contract;
  id: Scalars['ID']['output'];
  operator: Account;
  owner: Account;
};

export type Erc1155Operator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc1155Operator_Filter>>>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  approved_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  approved_not?: InputMaybe<Scalars['Boolean']['input']>;
  approved_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc1155Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Account_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Erc1155Operator_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Erc1155Operator_OrderBy {
  Approved = 'approved',
  Contract = 'contract',
  ContractId = 'contract__id',
  Id = 'id',
  Operator = 'operator',
  OperatorId = 'operator__id',
  OperatorIsContract = 'operator__isContract',
  Owner = 'owner',
  OwnerId = 'owner__id',
  OwnerIsContract = 'owner__isContract'
}

export type Erc1155Token = {
  __typename?: 'ERC1155Token';
  balances: Array<Erc1155Balance>;
  contract: Erc1155Contract;
  holders: Scalars['BigInt']['output'];
  holdersString: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['BigInt']['output'];
  identifierString: Scalars['String']['output'];
  totalSupply: Erc1155Balance;
  transfers: Array<Erc1155Transfer>;
  uri?: Maybe<Scalars['String']['output']>;
};


export type Erc1155TokenBalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Balance_Filter>;
};


export type Erc1155TokenTransfersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};

export type Erc1155Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc1155Token_Filter>>>;
  balances_?: InputMaybe<Erc1155Balance_Filter>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc1155Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holders?: InputMaybe<Scalars['BigInt']['input']>;
  holdersString?: InputMaybe<Scalars['String']['input']>;
  holdersString_contains?: InputMaybe<Scalars['String']['input']>;
  holdersString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  holdersString_ends_with?: InputMaybe<Scalars['String']['input']>;
  holdersString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holdersString_gt?: InputMaybe<Scalars['String']['input']>;
  holdersString_gte?: InputMaybe<Scalars['String']['input']>;
  holdersString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  holdersString_lt?: InputMaybe<Scalars['String']['input']>;
  holdersString_lte?: InputMaybe<Scalars['String']['input']>;
  holdersString_not?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_contains?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  holdersString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  holdersString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holdersString_starts_with?: InputMaybe<Scalars['String']['input']>;
  holdersString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  holders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holders_not?: InputMaybe<Scalars['BigInt']['input']>;
  holders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  identifier?: InputMaybe<Scalars['BigInt']['input']>;
  identifierString?: InputMaybe<Scalars['String']['input']>;
  identifierString_contains?: InputMaybe<Scalars['String']['input']>;
  identifierString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_ends_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_gt?: InputMaybe<Scalars['String']['input']>;
  identifierString_gte?: InputMaybe<Scalars['String']['input']>;
  identifierString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  identifierString_lt?: InputMaybe<Scalars['String']['input']>;
  identifierString_lte?: InputMaybe<Scalars['String']['input']>;
  identifierString_not?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_contains?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  identifierString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifierString_starts_with?: InputMaybe<Scalars['String']['input']>;
  identifierString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  identifier_gt?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_gte?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  identifier_lt?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_lte?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_not?: InputMaybe<Scalars['BigInt']['input']>;
  identifier_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Erc1155Token_Filter>>>;
  totalSupply?: InputMaybe<Scalars['String']['input']>;
  totalSupply_?: InputMaybe<Erc1155Balance_Filter>;
  totalSupply_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupply_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['String']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['String']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['String']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  totalSupply_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transfers_?: InputMaybe<Erc1155Transfer_Filter>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  uri_lte?: InputMaybe<Scalars['String']['input']>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Erc1155Token_OrderBy {
  Balances = 'balances',
  Contract = 'contract',
  ContractId = 'contract__id',
  Holders = 'holders',
  HoldersString = 'holdersString',
  Id = 'id',
  Identifier = 'identifier',
  IdentifierString = 'identifierString',
  TotalSupply = 'totalSupply',
  TotalSupplyId = 'totalSupply__id',
  TotalSupplyValue = 'totalSupply__value',
  TotalSupplyValueExact = 'totalSupply__valueExact',
  TotalSupplyValueExactString = 'totalSupply__valueExactString',
  Transfers = 'transfers',
  Uri = 'uri'
}

export type Erc1155Transfer = Event & {
  __typename?: 'ERC1155Transfer';
  contract: Erc1155Contract;
  emitter: Account;
  from?: Maybe<Account>;
  fromBalance?: Maybe<Erc1155Balance>;
  id: Scalars['ID']['output'];
  operator: Account;
  timestamp: Scalars['BigInt']['output'];
  to?: Maybe<Account>;
  toBalance?: Maybe<Erc1155Balance>;
  token: Erc1155Token;
  transaction?: Maybe<Transaction>;
  value: Scalars['BigDecimal']['output'];
  valueExact: Scalars['BigInt']['output'];
};

export type Erc1155Transfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Erc1155Transfer_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Erc1155Contract_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  fromBalance?: InputMaybe<Scalars['String']['input']>;
  fromBalance_?: InputMaybe<Erc1155Balance_Filter>;
  fromBalance_contains?: InputMaybe<Scalars['String']['input']>;
  fromBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_gt?: InputMaybe<Scalars['String']['input']>;
  fromBalance_gte?: InputMaybe<Scalars['String']['input']>;
  fromBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromBalance_lt?: InputMaybe<Scalars['String']['input']>;
  fromBalance_lte?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<Account_Filter>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Account_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Erc1155Transfer_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  toBalance?: InputMaybe<Scalars['String']['input']>;
  toBalance_?: InputMaybe<Erc1155Balance_Filter>;
  toBalance_contains?: InputMaybe<Scalars['String']['input']>;
  toBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_gt?: InputMaybe<Scalars['String']['input']>;
  toBalance_gte?: InputMaybe<Scalars['String']['input']>;
  toBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toBalance_lt?: InputMaybe<Scalars['String']['input']>;
  toBalance_lte?: InputMaybe<Scalars['String']['input']>;
  toBalance_not?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  toBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<Account_Filter>;
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
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Erc1155Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueExact?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueExact_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueExact_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  value_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  value_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Erc1155Transfer_OrderBy {
  Contract = 'contract',
  ContractId = 'contract__id',
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  From = 'from',
  FromBalance = 'fromBalance',
  FromBalanceId = 'fromBalance__id',
  FromBalanceValue = 'fromBalance__value',
  FromBalanceValueExact = 'fromBalance__valueExact',
  FromBalanceValueExactString = 'fromBalance__valueExactString',
  FromId = 'from__id',
  FromIsContract = 'from__isContract',
  Id = 'id',
  Operator = 'operator',
  OperatorId = 'operator__id',
  OperatorIsContract = 'operator__isContract',
  Timestamp = 'timestamp',
  To = 'to',
  ToBalance = 'toBalance',
  ToBalanceId = 'toBalance__id',
  ToBalanceValue = 'toBalance__value',
  ToBalanceValueExact = 'toBalance__valueExact',
  ToBalanceValueExactString = 'toBalance__valueExactString',
  ToId = 'to__id',
  ToIsContract = 'to__isContract',
  Token = 'token',
  TokenHolders = 'token__holders',
  TokenHoldersString = 'token__holdersString',
  TokenId = 'token__id',
  TokenIdentifier = 'token__identifier',
  TokenIdentifierString = 'token__identifierString',
  TokenUri = 'token__uri',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString',
  Value = 'value',
  ValueExact = 'valueExact'
}

export type Event = {
  emitter: Account;
  id: Scalars['ID']['output'];
  timestamp: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
};

export type Event_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Event_OrderBy {
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
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

export type MasterChef = {
  __typename?: 'MasterChef';
  block: Scalars['BigInt']['output'];
  frtnRate: Scalars['BigInt']['output'];
  frtnStakingRatio: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  migrator?: Maybe<Scalars['Bytes']['output']>;
  paused: Scalars['Boolean']['output'];
  poolCount: Scalars['BigInt']['output'];
  pools?: Maybe<Array<Pool>>;
  tackleBox: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  totalRegularAllocPoint: Scalars['BigInt']['output'];
};


export type MasterChefPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};

export type MasterChef_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MasterChef_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  frtnRate?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  frtnRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  frtnRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  frtnStakingRatio?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  frtnStakingRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  frtnStakingRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  migrator?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_gt?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_gte?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  migrator_lt?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_lte?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_not?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  migrator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MasterChef_Filter>>>;
  paused?: InputMaybe<Scalars['Boolean']['input']>;
  paused_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  paused_not?: InputMaybe<Scalars['Boolean']['input']>;
  paused_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  poolCount?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pools_?: InputMaybe<Pool_Filter>;
  tackleBox?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tackleBox_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_not?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tackleBox_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRegularAllocPoint?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRegularAllocPoint_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum MasterChef_OrderBy {
  Block = 'block',
  FrtnRate = 'frtnRate',
  FrtnStakingRatio = 'frtnStakingRatio',
  Id = 'id',
  Migrator = 'migrator',
  Paused = 'paused',
  PoolCount = 'poolCount',
  Pools = 'pools',
  TackleBox = 'tackleBox',
  Timestamp = 'timestamp',
  TotalRegularAllocPoint = 'totalRegularAllocPoint'
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

export type Ownable = {
  __typename?: 'Ownable';
  asAccount: Account;
  id: Scalars['ID']['output'];
  owner: Account;
  ownershipTransferred: Array<OwnershipTransferred>;
};


export type OwnableOwnershipTransferredArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type Ownable_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Ownable_Filter>>>;
  asAccount?: InputMaybe<Scalars['String']['input']>;
  asAccount_?: InputMaybe<Account_Filter>;
  asAccount_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_gt?: InputMaybe<Scalars['String']['input']>;
  asAccount_gte?: InputMaybe<Scalars['String']['input']>;
  asAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_lt?: InputMaybe<Scalars['String']['input']>;
  asAccount_lte?: InputMaybe<Scalars['String']['input']>;
  asAccount_not?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  asAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Ownable_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownershipTransferred_?: InputMaybe<OwnershipTransferred_Filter>;
};

export enum Ownable_OrderBy {
  AsAccount = 'asAccount',
  AsAccountId = 'asAccount__id',
  AsAccountIsContract = 'asAccount__isContract',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  OwnerIsContract = 'owner__isContract',
  OwnershipTransferred = 'ownershipTransferred'
}

export type OwnershipTransferred = Event & {
  __typename?: 'OwnershipTransferred';
  contract: Ownable;
  emitter: Account;
  id: Scalars['ID']['output'];
  owner: Account;
  timestamp: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
};

export type OwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  contract?: InputMaybe<Scalars['String']['input']>;
  contract_?: InputMaybe<Ownable_Filter>;
  contract_contains?: InputMaybe<Scalars['String']['input']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_gt?: InputMaybe<Scalars['String']['input']>;
  contract_gte?: InputMaybe<Scalars['String']['input']>;
  contract_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_lt?: InputMaybe<Scalars['String']['input']>;
  contract_lte?: InputMaybe<Scalars['String']['input']>;
  contract_not?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains?: InputMaybe<Scalars['String']['input']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with?: InputMaybe<Scalars['String']['input']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum OwnershipTransferred_OrderBy {
  Contract = 'contract',
  ContractId = 'contract__id',
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  OwnerIsContract = 'owner__isContract',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
}

export type Pool = {
  __typename?: 'Pool';
  accFRTNPerShare: Scalars['BigInt']['output'];
  allocPoint: Scalars['BigInt']['output'];
  block: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  lastRewardBlock: Scalars['BigInt']['output'];
  lpBalance: Scalars['BigInt']['output'];
  masterChef: MasterChef;
  pair: Scalars['Bytes']['output'];
  rewarderCount: Scalars['BigInt']['output'];
  rewarderPools?: Maybe<Array<RewarderPool>>;
  timestamp: Scalars['BigInt']['output'];
  totalUsersCount: Scalars['BigInt']['output'];
  userCount: Scalars['BigInt']['output'];
  users: Array<User>;
};


export type PoolRewarderPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewarderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewarderPool_Filter>;
};


export type PoolUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<User_Filter>;
};

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accFRTNPerShare?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accFRTNPerShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_not?: InputMaybe<Scalars['BigInt']['input']>;
  accFRTNPerShare_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocPoint?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_gt?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_gte?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocPoint_lt?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_lte?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_not?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastRewardBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastRewardBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpBalance?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  masterChef?: InputMaybe<Scalars['String']['input']>;
  masterChef_?: InputMaybe<MasterChef_Filter>;
  masterChef_contains?: InputMaybe<Scalars['String']['input']>;
  masterChef_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  masterChef_ends_with?: InputMaybe<Scalars['String']['input']>;
  masterChef_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  masterChef_gt?: InputMaybe<Scalars['String']['input']>;
  masterChef_gte?: InputMaybe<Scalars['String']['input']>;
  masterChef_in?: InputMaybe<Array<Scalars['String']['input']>>;
  masterChef_lt?: InputMaybe<Scalars['String']['input']>;
  masterChef_lte?: InputMaybe<Scalars['String']['input']>;
  masterChef_not?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_contains?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  masterChef_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  masterChef_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  masterChef_starts_with?: InputMaybe<Scalars['String']['input']>;
  masterChef_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  pair?: InputMaybe<Scalars['Bytes']['input']>;
  pair_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pair_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pair_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pair_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pair_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pair_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pair_not?: InputMaybe<Scalars['Bytes']['input']>;
  pair_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewarderCount?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewarderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewarderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewarderPools_?: InputMaybe<RewarderPool_Filter>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUsersCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUsersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userCount?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  users_?: InputMaybe<User_Filter>;
};

export enum Pool_OrderBy {
  AccFrtnPerShare = 'accFRTNPerShare',
  AllocPoint = 'allocPoint',
  Block = 'block',
  Id = 'id',
  LastRewardBlock = 'lastRewardBlock',
  LpBalance = 'lpBalance',
  MasterChef = 'masterChef',
  MasterChefBlock = 'masterChef__block',
  MasterChefFrtnRate = 'masterChef__frtnRate',
  MasterChefFrtnStakingRatio = 'masterChef__frtnStakingRatio',
  MasterChefId = 'masterChef__id',
  MasterChefMigrator = 'masterChef__migrator',
  MasterChefPaused = 'masterChef__paused',
  MasterChefPoolCount = 'masterChef__poolCount',
  MasterChefTackleBox = 'masterChef__tackleBox',
  MasterChefTimestamp = 'masterChef__timestamp',
  MasterChefTotalRegularAllocPoint = 'masterChef__totalRegularAllocPoint',
  Pair = 'pair',
  RewarderCount = 'rewarderCount',
  RewarderPools = 'rewarderPools',
  Timestamp = 'timestamp',
  TotalUsersCount = 'totalUsersCount',
  UserCount = 'userCount',
  Users = 'users'
}

export type PresaleVault = {
  __typename?: 'PresaleVault';
  address: Scalars['String']['output'];
  beneficiary: Account;
  currentBalance: Scalars['BigInt']['output'];
  duration: Scalars['BigInt']['output'];
  endTime: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  initalBalance: Scalars['BigInt']['output'];
  releasedBalance: Scalars['BigInt']['output'];
  startTime: Scalars['BigInt']['output'];
};

export type PresaleVault_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<PresaleVault_Filter>>>;
  beneficiary?: InputMaybe<Scalars['String']['input']>;
  beneficiary_?: InputMaybe<Account_Filter>;
  beneficiary_contains?: InputMaybe<Scalars['String']['input']>;
  beneficiary_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beneficiary_ends_with?: InputMaybe<Scalars['String']['input']>;
  beneficiary_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beneficiary_gt?: InputMaybe<Scalars['String']['input']>;
  beneficiary_gte?: InputMaybe<Scalars['String']['input']>;
  beneficiary_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beneficiary_lt?: InputMaybe<Scalars['String']['input']>;
  beneficiary_lte?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_contains?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beneficiary_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beneficiary_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beneficiary_starts_with?: InputMaybe<Scalars['String']['input']>;
  beneficiary_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentBalance?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  duration?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  duration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  initalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  initalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  initalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PresaleVault_Filter>>>;
  releasedBalance?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  releasedBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  releasedBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PresaleVault_OrderBy {
  Address = 'address',
  Beneficiary = 'beneficiary',
  BeneficiaryBalance = 'beneficiary__balance',
  BeneficiaryId = 'beneficiary__id',
  CurrentBalance = 'currentBalance',
  Duration = 'duration',
  EndTime = 'endTime',
  Id = 'id',
  InitalBalance = 'initalBalance',
  ReleasedBalance = 'releasedBalance',
  StartTime = 'startTime'
}

export type Purchase = {
  __typename?: 'Purchase';
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Purchase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Purchase_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Purchase_Filter>>>;
};

export enum Purchase_OrderBy {
  Address = 'address',
  Amount = 'amount',
  Hash = 'hash',
  Id = 'id'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  accessControl?: Maybe<AccessControl>;
  accessControlRole?: Maybe<AccessControlRole>;
  accessControlRoleMember?: Maybe<AccessControlRoleMember>;
  accessControlRoleMembers: Array<AccessControlRoleMember>;
  accessControlRoles: Array<AccessControlRole>;
  accessControls: Array<AccessControl>;
  account?: Maybe<Account>;
  accountClosed?: Maybe<AccountClosed>;
  accountClosedByAdmin?: Maybe<AccountClosedByAdmin>;
  accountClosedByAdmins: Array<AccountClosedByAdmin>;
  accountCloseds: Array<AccountClosed>;
  accountOpened?: Maybe<AccountOpened>;
  accountOpeneds: Array<AccountOpened>;
  accountUpdated?: Maybe<AccountUpdated>;
  accountUpdateds: Array<AccountUpdated>;
  accounts: Array<Account>;
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
  erc721Contract?: Maybe<Erc721Contract>;
  erc721Contracts: Array<Erc721Contract>;
  erc721Operator?: Maybe<Erc721Operator>;
  erc721Operators: Array<Erc721Operator>;
  erc721Token?: Maybe<Erc721Token>;
  erc721TokenBalance?: Maybe<Erc721TokenBalance>;
  erc721TokenBalances: Array<Erc721TokenBalance>;
  erc721Tokens: Array<Erc721Token>;
  erc721Transfer?: Maybe<Erc721Transfer>;
  erc721Transfers: Array<Erc721Transfer>;
  erc1155Balance?: Maybe<Erc1155Balance>;
  erc1155Balances: Array<Erc1155Balance>;
  erc1155Contract?: Maybe<Erc1155Contract>;
  erc1155Contracts: Array<Erc1155Contract>;
  erc1155Operator?: Maybe<Erc1155Operator>;
  erc1155Operators: Array<Erc1155Operator>;
  erc1155Token?: Maybe<Erc1155Token>;
  erc1155Tokens: Array<Erc1155Token>;
  erc1155Transfer?: Maybe<Erc1155Transfer>;
  erc1155Transfers: Array<Erc1155Transfer>;
  event?: Maybe<Event>;
  events: Array<Event>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  masterChef?: Maybe<MasterChef>;
  masterChefs: Array<MasterChef>;
  meeple?: Maybe<Meeple>;
  meeples: Array<Meeple>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  mitamaTransfer?: Maybe<MitamaTransfer>;
  mitamaTransfers: Array<MitamaTransfer>;
  ownable?: Maybe<Ownable>;
  ownables: Array<Ownable>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  presaleVault?: Maybe<PresaleVault>;
  presaleVaults: Array<PresaleVault>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  rewarder?: Maybe<Rewarder>;
  rewarderPool?: Maybe<RewarderPool>;
  rewarderPools: Array<RewarderPool>;
  rewarders: Array<Rewarder>;
  role?: Maybe<Role>;
  roleAdminChanged?: Maybe<RoleAdminChanged>;
  roleAdminChangeds: Array<RoleAdminChanged>;
  roleGranted?: Maybe<RoleGranted>;
  roleGranteds: Array<RoleGranted>;
  roleRevoked?: Maybe<RoleRevoked>;
  roleRevokeds: Array<RoleRevoked>;
  roles: Array<Role>;
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
  total?: Maybe<Total>;
  totals: Array<Total>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  upkeep?: Maybe<Upkeep>;
  upkeeps: Array<Upkeep>;
  user?: Maybe<User>;
  users: Array<User>;
  vaultContract?: Maybe<VaultContract>;
  vaultContracts: Array<VaultContract>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccessControlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccessControlRoleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccessControlRoleMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccessControlRoleMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRoleMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControlRoleMember_Filter>;
};


export type QueryAccessControlRolesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRole_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControlRole_Filter>;
};


export type QueryAccessControlsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControl_Filter>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
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


export type QueryErc721ContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc721ContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Contract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Contract_Filter>;
};


export type QueryErc721OperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc721OperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Operator_Filter>;
};


export type QueryErc721TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc721TokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc721TokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721TokenBalance_Filter>;
};


export type QueryErc721TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Token_Filter>;
};


export type QueryErc721TransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc721TransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Transfer_Filter>;
};


export type QueryErc1155BalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc1155BalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Balance_Filter>;
};


export type QueryErc1155ContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc1155ContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Contract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Contract_Filter>;
};


export type QueryErc1155OperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc1155OperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Operator_Filter>;
};


export type QueryErc1155TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc1155TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Token_Filter>;
};


export type QueryErc1155TransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryErc1155TransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type QueryEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
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


export type QueryMasterChefArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMasterChefsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MasterChef_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MasterChef_Filter>;
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


export type QueryOwnableArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnablesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ownable_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ownable_Filter>;
};


export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QueryPresaleVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPresaleVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PresaleVault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PresaleVault_Filter>;
};


export type QueryPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Purchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Purchase_Filter>;
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


export type QueryRewarderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewarderPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewarderPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewarderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewarderPool_Filter>;
};


export type QueryRewardersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rewarder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rewarder_Filter>;
};


export type QueryRoleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRoleAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRoleAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleAdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleAdminChanged_Filter>;
};


export type QueryRoleGrantedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRoleGrantedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleGranted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleGranted_Filter>;
};


export type QueryRoleRevokedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRoleRevokedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleRevoked_Filter>;
};


export type QueryRolesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Role_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Role_Filter>;
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


export type QueryTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Total_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Total_Filter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
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


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};


export type QueryVaultContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultContract_Filter>;
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

export type Rewarder = {
  __typename?: 'Rewarder';
  id: Scalars['ID']['output'];
  poolCount: Scalars['BigInt']['output'];
  pools?: Maybe<Array<RewarderPool>>;
  rewardEnd: Scalars['BigInt']['output'];
  rewardPerSecond: Scalars['BigInt']['output'];
  rewardStart: Scalars['BigInt']['output'];
  token: Scalars['Bytes']['output'];
  totalRegularAllocPoint: Scalars['BigInt']['output'];
};


export type RewarderPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewarderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewarderPool_Filter>;
};

export type RewarderPool = {
  __typename?: 'RewarderPool';
  accRewardPerShare: Scalars['BigInt']['output'];
  allocPoint: Scalars['BigInt']['output'];
  attached: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  lastRewardBlock: Scalars['BigInt']['output'];
  lpBalance: Scalars['BigInt']['output'];
  pool: Pool;
  rewarder: Rewarder;
};

export type RewarderPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accRewardPerShare?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accRewardPerShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_not?: InputMaybe<Scalars['BigInt']['input']>;
  accRewardPerShare_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocPoint?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_gt?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_gte?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocPoint_lt?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_lte?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_not?: InputMaybe<Scalars['BigInt']['input']>;
  allocPoint_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<RewarderPool_Filter>>>;
  attached?: InputMaybe<Scalars['Boolean']['input']>;
  attached_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  attached_not?: InputMaybe<Scalars['Boolean']['input']>;
  attached_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastRewardBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastRewardBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastRewardBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpBalance?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewarderPool_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder?: InputMaybe<Scalars['String']['input']>;
  rewarder_?: InputMaybe<Rewarder_Filter>;
  rewarder_contains?: InputMaybe<Scalars['String']['input']>;
  rewarder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewarder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder_gt?: InputMaybe<Scalars['String']['input']>;
  rewarder_gte?: InputMaybe<Scalars['String']['input']>;
  rewarder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewarder_lt?: InputMaybe<Scalars['String']['input']>;
  rewarder_lte?: InputMaybe<Scalars['String']['input']>;
  rewarder_not?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewarder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewarder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewarder_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewarder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RewarderPool_OrderBy {
  AccRewardPerShare = 'accRewardPerShare',
  AllocPoint = 'allocPoint',
  Attached = 'attached',
  Id = 'id',
  LastRewardBlock = 'lastRewardBlock',
  LpBalance = 'lpBalance',
  Pool = 'pool',
  PoolAccFrtnPerShare = 'pool__accFRTNPerShare',
  PoolAllocPoint = 'pool__allocPoint',
  PoolBlock = 'pool__block',
  PoolId = 'pool__id',
  PoolLastRewardBlock = 'pool__lastRewardBlock',
  PoolLpBalance = 'pool__lpBalance',
  PoolPair = 'pool__pair',
  PoolRewarderCount = 'pool__rewarderCount',
  PoolTimestamp = 'pool__timestamp',
  PoolTotalUsersCount = 'pool__totalUsersCount',
  PoolUserCount = 'pool__userCount',
  Rewarder = 'rewarder',
  RewarderId = 'rewarder__id',
  RewarderPoolCount = 'rewarder__poolCount',
  RewarderRewardEnd = 'rewarder__rewardEnd',
  RewarderRewardPerSecond = 'rewarder__rewardPerSecond',
  RewarderRewardStart = 'rewarder__rewardStart',
  RewarderToken = 'rewarder__token',
  RewarderTotalRegularAllocPoint = 'rewarder__totalRegularAllocPoint'
}

export type Rewarder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Rewarder_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Rewarder_Filter>>>;
  poolCount?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pools_?: InputMaybe<RewarderPool_Filter>;
  rewardEnd?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardEnd_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardEnd_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardPerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardPerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerSecond_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardStart?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  totalRegularAllocPoint?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRegularAllocPoint_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRegularAllocPoint_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Rewarder_OrderBy {
  Id = 'id',
  PoolCount = 'poolCount',
  Pools = 'pools',
  RewardEnd = 'rewardEnd',
  RewardPerSecond = 'rewardPerSecond',
  RewardStart = 'rewardStart',
  Token = 'token',
  TotalRegularAllocPoint = 'totalRegularAllocPoint'
}

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID']['output'];
  roleOf: Array<AccessControlRole>;
};


export type RoleRoleOfArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRole_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccessControlRole_Filter>;
};

export type RoleAdminChanged = Event & {
  __typename?: 'RoleAdminChanged';
  emitter: Account;
  id: Scalars['ID']['output'];
  newAdminRole: AccessControlRole;
  previousAdminRole: AccessControlRole;
  role: AccessControlRole;
  timestamp: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
};

export type RoleAdminChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RoleAdminChanged_Filter>>>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  newAdminRole?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_?: InputMaybe<AccessControlRole_Filter>;
  newAdminRole_contains?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_ends_with?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_gt?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_gte?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newAdminRole_lt?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_lte?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_contains?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newAdminRole_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_starts_with?: InputMaybe<Scalars['String']['input']>;
  newAdminRole_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<RoleAdminChanged_Filter>>>;
  previousAdminRole?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_?: InputMaybe<AccessControlRole_Filter>;
  previousAdminRole_contains?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_gt?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_gte?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousAdminRole_lt?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_lte?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_contains?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousAdminRole_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousAdminRole_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  role_?: InputMaybe<AccessControlRole_Filter>;
  role_contains?: InputMaybe<Scalars['String']['input']>;
  role_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_gt?: InputMaybe<Scalars['String']['input']>;
  role_gte?: InputMaybe<Scalars['String']['input']>;
  role_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_lt?: InputMaybe<Scalars['String']['input']>;
  role_lte?: InputMaybe<Scalars['String']['input']>;
  role_not?: InputMaybe<Scalars['String']['input']>;
  role_not_contains?: InputMaybe<Scalars['String']['input']>;
  role_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RoleAdminChanged_OrderBy {
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  Id = 'id',
  NewAdminRole = 'newAdminRole',
  NewAdminRoleId = 'newAdminRole__id',
  PreviousAdminRole = 'previousAdminRole',
  PreviousAdminRoleId = 'previousAdminRole__id',
  Role = 'role',
  RoleId = 'role__id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
}

export type RoleGranted = Event & {
  __typename?: 'RoleGranted';
  account: Account;
  emitter: Account;
  id: Scalars['ID']['output'];
  role: AccessControlRole;
  sender: Account;
  timestamp: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
};

export type RoleGranted_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<RoleGranted_Filter>>>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RoleGranted_Filter>>>;
  role?: InputMaybe<Scalars['String']['input']>;
  role_?: InputMaybe<AccessControlRole_Filter>;
  role_contains?: InputMaybe<Scalars['String']['input']>;
  role_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_gt?: InputMaybe<Scalars['String']['input']>;
  role_gte?: InputMaybe<Scalars['String']['input']>;
  role_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_lt?: InputMaybe<Scalars['String']['input']>;
  role_lte?: InputMaybe<Scalars['String']['input']>;
  role_not?: InputMaybe<Scalars['String']['input']>;
  role_not_contains?: InputMaybe<Scalars['String']['input']>;
  role_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_?: InputMaybe<Account_Filter>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RoleGranted_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  AccountIsContract = 'account__isContract',
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  Id = 'id',
  Role = 'role',
  RoleId = 'role__id',
  Sender = 'sender',
  SenderId = 'sender__id',
  SenderIsContract = 'sender__isContract',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
}

export type RoleRevoked = Event & {
  __typename?: 'RoleRevoked';
  account: Account;
  emitter: Account;
  id: Scalars['ID']['output'];
  role: AccessControlRole;
  sender: Account;
  timestamp: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
};

export type RoleRevoked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<RoleRevoked_Filter>>>;
  emitter?: InputMaybe<Scalars['String']['input']>;
  emitter_?: InputMaybe<Account_Filter>;
  emitter_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_gt?: InputMaybe<Scalars['String']['input']>;
  emitter_gte?: InputMaybe<Scalars['String']['input']>;
  emitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_lt?: InputMaybe<Scalars['String']['input']>;
  emitter_lte?: InputMaybe<Scalars['String']['input']>;
  emitter_not?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  emitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  emitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  emitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RoleRevoked_Filter>>>;
  role?: InputMaybe<Scalars['String']['input']>;
  role_?: InputMaybe<AccessControlRole_Filter>;
  role_contains?: InputMaybe<Scalars['String']['input']>;
  role_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_gt?: InputMaybe<Scalars['String']['input']>;
  role_gte?: InputMaybe<Scalars['String']['input']>;
  role_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_lt?: InputMaybe<Scalars['String']['input']>;
  role_lte?: InputMaybe<Scalars['String']['input']>;
  role_not?: InputMaybe<Scalars['String']['input']>;
  role_not_contains?: InputMaybe<Scalars['String']['input']>;
  role_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  role_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  role_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_?: InputMaybe<Account_Filter>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RoleRevoked_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  AccountIsContract = 'account__isContract',
  Emitter = 'emitter',
  EmitterId = 'emitter__id',
  EmitterIsContract = 'emitter__isContract',
  Id = 'id',
  Role = 'role',
  RoleId = 'role__id',
  Sender = 'sender',
  SenderId = 'sender__id',
  SenderIsContract = 'sender__isContract',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionValue = 'transaction__value',
  TransactionValueString = 'transaction__valueString'
}

export type Role_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Role_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Role_Filter>>>;
  roleOf_?: InputMaybe<AccessControlRole_Filter>;
};

export enum Role_OrderBy {
  Id = 'id',
  RoleOf = 'roleOf'
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
  accessControl?: Maybe<AccessControl>;
  accessControlRole?: Maybe<AccessControlRole>;
  accessControlRoleMember?: Maybe<AccessControlRoleMember>;
  accessControlRoleMembers: Array<AccessControlRoleMember>;
  accessControlRoles: Array<AccessControlRole>;
  accessControls: Array<AccessControl>;
  account?: Maybe<Account>;
  accountClosed?: Maybe<AccountClosed>;
  accountClosedByAdmin?: Maybe<AccountClosedByAdmin>;
  accountClosedByAdmins: Array<AccountClosedByAdmin>;
  accountCloseds: Array<AccountClosed>;
  accountOpened?: Maybe<AccountOpened>;
  accountOpeneds: Array<AccountOpened>;
  accountUpdated?: Maybe<AccountUpdated>;
  accountUpdateds: Array<AccountUpdated>;
  accounts: Array<Account>;
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
  erc721Contract?: Maybe<Erc721Contract>;
  erc721Contracts: Array<Erc721Contract>;
  erc721Operator?: Maybe<Erc721Operator>;
  erc721Operators: Array<Erc721Operator>;
  erc721Token?: Maybe<Erc721Token>;
  erc721TokenBalance?: Maybe<Erc721TokenBalance>;
  erc721TokenBalances: Array<Erc721TokenBalance>;
  erc721Tokens: Array<Erc721Token>;
  erc721Transfer?: Maybe<Erc721Transfer>;
  erc721Transfers: Array<Erc721Transfer>;
  erc1155Balance?: Maybe<Erc1155Balance>;
  erc1155Balances: Array<Erc1155Balance>;
  erc1155Contract?: Maybe<Erc1155Contract>;
  erc1155Contracts: Array<Erc1155Contract>;
  erc1155Operator?: Maybe<Erc1155Operator>;
  erc1155Operators: Array<Erc1155Operator>;
  erc1155Token?: Maybe<Erc1155Token>;
  erc1155Tokens: Array<Erc1155Token>;
  erc1155Transfer?: Maybe<Erc1155Transfer>;
  erc1155Transfers: Array<Erc1155Transfer>;
  event?: Maybe<Event>;
  events: Array<Event>;
  fortuneStakingAccount?: Maybe<FortuneStakingAccount>;
  fortuneStakingAccounts: Array<FortuneStakingAccount>;
  masterChef?: Maybe<MasterChef>;
  masterChefs: Array<MasterChef>;
  meeple?: Maybe<Meeple>;
  meeples: Array<Meeple>;
  mintRequestCancelledEvent?: Maybe<MintRequestCancelledEvent>;
  mintRequestCancelledEvents: Array<MintRequestCancelledEvent>;
  mintRequestSuccessEvent?: Maybe<MintRequestSuccessEvent>;
  mintRequestSuccessEvents: Array<MintRequestSuccessEvent>;
  mitamaTransfer?: Maybe<MitamaTransfer>;
  mitamaTransfers: Array<MitamaTransfer>;
  ownable?: Maybe<Ownable>;
  ownables: Array<Ownable>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  presaleVault?: Maybe<PresaleVault>;
  presaleVaults: Array<PresaleVault>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  registeredSeason?: Maybe<RegisteredSeason>;
  registeredSeasons: Array<RegisteredSeason>;
  rewarder?: Maybe<Rewarder>;
  rewarderPool?: Maybe<RewarderPool>;
  rewarderPools: Array<RewarderPool>;
  rewarders: Array<Rewarder>;
  role?: Maybe<Role>;
  roleAdminChanged?: Maybe<RoleAdminChanged>;
  roleAdminChangeds: Array<RoleAdminChanged>;
  roleGranted?: Maybe<RoleGranted>;
  roleGranteds: Array<RoleGranted>;
  roleRevoked?: Maybe<RoleRevoked>;
  roleRevokeds: Array<RoleRevoked>;
  roles: Array<Role>;
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
  total?: Maybe<Total>;
  totals: Array<Total>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  upkeep?: Maybe<Upkeep>;
  upkeeps: Array<Upkeep>;
  user?: Maybe<User>;
  users: Array<User>;
  vaultContract?: Maybe<VaultContract>;
  vaultContracts: Array<VaultContract>;
  withdrawn?: Maybe<Withdrawn>;
  withdrawns: Array<Withdrawn>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccessControlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccessControlRoleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccessControlRoleMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccessControlRoleMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRoleMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControlRoleMember_Filter>;
};


export type SubscriptionAccessControlRolesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControlRole_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControlRole_Filter>;
};


export type SubscriptionAccessControlsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccessControl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccessControl_Filter>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
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


export type SubscriptionErc721ContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc721ContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Contract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Contract_Filter>;
};


export type SubscriptionErc721OperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc721OperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Operator_Filter>;
};


export type SubscriptionErc721TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc721TokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc721TokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721TokenBalance_Filter>;
};


export type SubscriptionErc721TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Token_Filter>;
};


export type SubscriptionErc721TransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc721TransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc721Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc721Transfer_Filter>;
};


export type SubscriptionErc1155BalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc1155BalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Balance_Filter>;
};


export type SubscriptionErc1155ContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc1155ContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Contract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Contract_Filter>;
};


export type SubscriptionErc1155OperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc1155OperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Operator_Filter>;
};


export type SubscriptionErc1155TokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc1155TokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Token_Filter>;
};


export type SubscriptionErc1155TransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionErc1155TransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Erc1155Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Erc1155Transfer_Filter>;
};


export type SubscriptionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
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


export type SubscriptionMasterChefArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMasterChefsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MasterChef_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MasterChef_Filter>;
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


export type SubscriptionOwnableArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnablesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ownable_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ownable_Filter>;
};


export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionPresaleVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPresaleVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PresaleVault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PresaleVault_Filter>;
};


export type SubscriptionPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Purchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Purchase_Filter>;
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


export type SubscriptionRewarderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewarderPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewarderPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewarderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewarderPool_Filter>;
};


export type SubscriptionRewardersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rewarder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rewarder_Filter>;
};


export type SubscriptionRoleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRoleAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRoleAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleAdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleAdminChanged_Filter>;
};


export type SubscriptionRoleGrantedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRoleGrantedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleGranted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleGranted_Filter>;
};


export type SubscriptionRoleRevokedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRoleRevokedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RoleRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RoleRevoked_Filter>;
};


export type SubscriptionRolesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Role_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Role_Filter>;
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


export type SubscriptionTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Total_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Total_Filter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
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


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};


export type SubscriptionVaultContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultContract_Filter>;
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

export type Total = {
  __typename?: 'Total';
  id: Scalars['ID']['output'];
  total: Scalars['BigInt']['output'];
};

export type Total_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Total_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Total_Filter>>>;
  total?: InputMaybe<Scalars['BigInt']['input']>;
  total_gt?: InputMaybe<Scalars['BigInt']['input']>;
  total_gte?: InputMaybe<Scalars['BigInt']['input']>;
  total_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  total_lt?: InputMaybe<Scalars['BigInt']['input']>;
  total_lte?: InputMaybe<Scalars['BigInt']['input']>;
  total_not?: InputMaybe<Scalars['BigInt']['input']>;
  total_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Total_OrderBy {
  Id = 'id',
  Total = 'total'
}

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt']['output'];
  events: Array<Event>;
  gasLimit?: Maybe<Scalars['BigInt']['output']>;
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  timestamp: Scalars['BigInt']['output'];
  value?: Maybe<Scalars['BigInt']['output']>;
  valueString?: Maybe<Scalars['String']['output']>;
};


export type TransactionEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Event_Filter>;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  events_?: InputMaybe<Event_Filter>;
  gasLimit?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  value?: InputMaybe<Scalars['BigInt']['input']>;
  valueString?: InputMaybe<Scalars['String']['input']>;
  valueString_contains?: InputMaybe<Scalars['String']['input']>;
  valueString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_gt?: InputMaybe<Scalars['String']['input']>;
  valueString_gte?: InputMaybe<Scalars['String']['input']>;
  valueString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueString_lt?: InputMaybe<Scalars['String']['input']>;
  valueString_lte?: InputMaybe<Scalars['String']['input']>;
  valueString_not?: InputMaybe<Scalars['String']['input']>;
  valueString_not_contains?: InputMaybe<Scalars['String']['input']>;
  valueString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  valueString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  valueString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueString_starts_with?: InputMaybe<Scalars['String']['input']>;
  valueString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_gt?: InputMaybe<Scalars['BigInt']['input']>;
  value_gte?: InputMaybe<Scalars['BigInt']['input']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  value_lt?: InputMaybe<Scalars['BigInt']['input']>;
  value_lte?: InputMaybe<Scalars['BigInt']['input']>;
  value_not?: InputMaybe<Scalars['BigInt']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Events = 'events',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  Id = 'id',
  Timestamp = 'timestamp',
  Value = 'value',
  ValueString = 'valueString'
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

export type User = {
  __typename?: 'User';
  address: Scalars['Bytes']['output'];
  amount: Scalars['BigInt']['output'];
  block: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  pool: Pool;
  rewardDebt: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardDebt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardDebt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardDebt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum User_OrderBy {
  Address = 'address',
  Amount = 'amount',
  Block = 'block',
  Id = 'id',
  Pool = 'pool',
  PoolAccFrtnPerShare = 'pool__accFRTNPerShare',
  PoolAllocPoint = 'pool__allocPoint',
  PoolBlock = 'pool__block',
  PoolId = 'pool__id',
  PoolLastRewardBlock = 'pool__lastRewardBlock',
  PoolLpBalance = 'pool__lpBalance',
  PoolPair = 'pool__pair',
  PoolRewarderCount = 'pool__rewarderCount',
  PoolTimestamp = 'pool__timestamp',
  PoolTotalUsersCount = 'pool__totalUsersCount',
  PoolUserCount = 'pool__userCount',
  RewardDebt = 'rewardDebt',
  Timestamp = 'timestamp'
}

export type VaultContract = {
  __typename?: 'VaultContract';
  cutoff: Scalars['BigInt']['output'];
  duration: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  startTime: Scalars['BigInt']['output'];
};

export type VaultContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultContract_Filter>>>;
  cutoff?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cutoff_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_not?: InputMaybe<Scalars['BigInt']['input']>;
  cutoff_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  duration?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  duration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultContract_Filter>>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum VaultContract_OrderBy {
  Cutoff = 'cutoff',
  Duration = 'duration',
  Id = 'id',
  StartTime = 'startTime'
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
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
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

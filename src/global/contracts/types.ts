import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bundle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bundleAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_market', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ApprovalCallerNotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'ApprovalQueryForNonexistentToken' },
  { type: 'error', inputs: [], name: 'BalanceQueryForZeroAddress' },
  { type: 'error', inputs: [], name: 'MintERC2309QuantityExceedsLimit' },
  { type: 'error', inputs: [], name: 'MintToZeroAddress' },
  { type: 'error', inputs: [], name: 'MintZeroQuantity' },
  { type: 'error', inputs: [], name: 'OwnerQueryForNonexistentToken' },
  { type: 'error', inputs: [], name: 'OwnershipNotInitializedForExtraData' },
  { type: 'error', inputs: [], name: 'TransferCallerNotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'TransferFromIncorrectOwner' },
  { type: 'error', inputs: [], name: 'TransferToNonERC721ReceiverImplementer' },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  { type: 'error', inputs: [], name: 'URIQueryForNonexistentToken' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'contracts',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'desc', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'BundleCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'BundleDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fromTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'toTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ConsecutiveTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'contents',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_uri', internalType: 'string', type: 'string' }],
    name: 'setUri',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'unwrap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_desc', internalType: 'string', type: 'string' },
    ],
    name: 'wrap',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_desc', internalType: 'string', type: 'string' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'wrapAndList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const bundleAddress =
  '0x40874F18922267cc2Ca7933828594aB5078C1065' as const

export const bundleConfig = { address: bundleAddress, abi: bundleAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// offer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const offerAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CollectionOfferAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CollectionOfferCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CollectionOfferMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CollectionOfferUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'coinAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OfferAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OfferCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'coinAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OfferMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'coinAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OfferRejected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'offerIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'coinAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OfferUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'IID_IERC1155',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'IID_IERC721',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAFF_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_collection', internalType: 'address', type: 'address' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptCollectionOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_collection', internalType: 'address', type: 'address' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelCollectionOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_nftId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'generateHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_collection', internalType: 'address', type: 'address' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCollectionOffer',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      {
        name: 'offer',
        internalType: 'struct Offer',
        type: 'tuple',
        components: [
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'buyer', internalType: 'address', type: 'address' },
          { name: 'coinAddress', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'date', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_collection', internalType: 'address', type: 'address' }],
    name: 'getCollectionOffers',
    outputs: [
      {
        name: '',
        internalType: 'struct Offer[]',
        type: 'tuple[]',
        components: [
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'buyer', internalType: 'address', type: 'address' },
          { name: 'coinAddress', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'date', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getOffer',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      {
        name: 'offer',
        internalType: 'struct Offer',
        type: 'tuple',
        components: [
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'buyer', internalType: 'address', type: 'address' },
          { name: 'coinAddress', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'date', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getOffers',
    outputs: [
      {
        name: '',
        internalType: 'struct Offer[]',
        type: 'tuple[]',
        components: [
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'buyer', internalType: 'address', type: 'address' },
          { name: 'coinAddress', internalType: 'address', type: 'address' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'date', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_market', internalType: 'address payable', type: 'address' },
      {
        name: '_stakerAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'is1155',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'is721',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'makeCollectionOffer',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeOffer',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rejectOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateOffer',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'uppdateCollectionOffer',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

export const offerAddress =
  '0x2bbCd54aC79E20974E02B07dB0F7e6c0AeA49305' as const

export const offerConfig = { address: offerAddress, abi: offerAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// port
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portAbi = [
  { type: 'error', inputs: [], name: 'InvalidERC721TransferAmount' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'enum ConduitItemType', type: 'uint8' }],
    name: 'InvalidItemType',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AdminWithdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Cancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'optedIn', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'EscrowChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'updater',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'reg', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'fm', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'admin',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeesUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Listed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'staffMember',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'collection',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ipHolder',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'RoyaltyChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'collection',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'ipholder',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RoyaltyPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'staffMember',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'collection',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoyaltyRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Sold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newStaker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'activeListing',
    outputs: [
      {
        name: '',
        internalType: 'struct IterableMapping.Listing',
        type: 'tuple',
        components: [
          { name: 'listingId', internalType: 'uint256', type: 'uint256' },
          { name: 'nftId', internalType: 'uint256', type: 'uint256' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
          { name: 'purchaser', internalType: 'address', type: 'address' },
          { name: 'is1155', internalType: 'bool', type: 'bool' },
          { name: 'listingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'saleTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'royalty', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'addToEscrow',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'bulkTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateRoyalty',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_seller', internalType: 'address', type: 'address' },
    ],
    name: 'cancelActive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'cancelListings',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelledListing',
    outputs: [
      {
        name: '',
        internalType: 'struct IterableMapping.Listing',
        type: 'tuple',
        components: [
          { name: 'listingId', internalType: 'uint256', type: 'uint256' },
          { name: 'nftId', internalType: 'uint256', type: 'uint256' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
          { name: 'purchaser', internalType: 'address', type: 'address' },
          { name: 'is1155', internalType: 'bool', type: 'bool' },
          { name: 'listingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'saleTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'royalty', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'completeListing',
    outputs: [
      {
        name: '',
        internalType: 'struct IterableMapping.Listing',
        type: 'tuple',
        components: [
          { name: 'listingId', internalType: 'uint256', type: 'uint256' },
          { name: 'nftId', internalType: 'uint256', type: 'uint256' },
          { name: 'seller', internalType: 'address', type: 'address' },
          { name: 'nft', internalType: 'address', type: 'address' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
          { name: 'purchaser', internalType: 'address', type: 'address' },
          { name: 'is1155', internalType: 'bool', type: 'bool' },
          { name: 'listingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'saleTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endingTime', internalType: 'uint256', type: 'uint256' },
          { name: 'royalty', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'transferInformation',
        internalType: 'struct ConduitTransfer[]',
        type: 'tuple[]',
        components: [
          {
            name: 'itemType',
            internalType: 'enum ConduitItemType',
            type: 'uint8',
          },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'identifier', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeTradesServer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'fee',
    outputs: [{ name: 'userFee', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contract', internalType: 'address', type: 'address' }],
    name: 'getRoyalty',
    outputs: [
      {
        name: '',
        internalType: 'struct Port.Royalty',
        type: 'tuple',
        components: [
          { name: 'ipHolder', internalType: 'address', type: 'address' },
          { name: 'percent', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStandardNFTRoyalty',
    outputs: [
      { name: 'ipHolder', internalType: 'address', type: 'address' },
      { name: 'royaltyAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberships',
        internalType: 'contract IERC1155',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_contract', internalType: 'address', type: 'address' }],
    name: 'isBundleContract',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isFM',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isMember',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contract', internalType: 'address', type: 'address' }],
    name: 'isRoyaltyStandard',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isVIP',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_buyer', internalType: 'address', type: 'address' },
    ],
    name: 'makeLegacyPurchase',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeListing',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_seller', internalType: 'address', type: 'address' },
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeListingServer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nfts', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_prices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'makeListings',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'memberFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'membershipStaker',
    outputs: [
      { name: '', internalType: 'contract IMembershipStaker', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'payRoyalty',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'payRoyaltyServer',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'dest', internalType: 'address', type: 'address' }],
    name: 'payments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'priceLookup',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'regFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nftContract', internalType: 'address', type: 'address' },
      { name: '_ipHolder', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'registerRoyalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nftContract', internalType: 'address', type: 'address' },
      { name: '_paymentAddress', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'registerRoyaltyAsOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nftContract', internalType: 'address', type: 'address' },
    ],
    name: 'removeRoyalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'royalties',
    outputs: [
      { name: 'ipHolder', internalType: 'address', type: 'address' },
      { name: 'percent', internalType: 'uint16', type: 'uint16' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'serverRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_membershipStaker', internalType: 'address', type: 'address' },
    ],
    name: 'setMembershipStaker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_pool', internalType: 'address', type: 'address' }],
    name: 'setPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ryoshi', internalType: 'address', type: 'address' }],
    name: 'setRyoshi',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_optIn', internalType: 'bool', type: 'bool' },
    ],
    name: 'setUseEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sigRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'staffRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'transferBulkServer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'enum ConduitItemType', type: 'uint8' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_identifier', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_regFee', internalType: 'uint16', type: 'uint16' },
      { name: '_memFee', internalType: 'uint16', type: 'uint16' },
      { name: '_vipFee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'upgraderRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'useEscrow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vipFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'payee', internalType: 'address payable', type: 'address' },
    ],
    name: 'withdrawPayments',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

export const portAddress = '0x8b5Eb1FeE264dc0Be38a42d36c5e4D25F4F40e4F' as const

export const portConfig = { address: portAddress, abi: portAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ship
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shipAbi = [
  { type: 'error', inputs: [], name: 'InvalidConsiderationsAmount' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'OrderInvalid',
  },
  {
    type: 'error',
    inputs: [
      {
        name: '',
        internalType: 'enum TradeshipCrates.ItemType',
        type: 'uint8',
      },
    ],
    name: 'UnsupportedItemType',
  },
  {
    type: 'error',
    inputs: [
      {
        name: '',
        internalType: 'enum TradeshipCrates.OrderType',
        type: 'uint8',
      },
    ],
    name: 'UnsupportedOrderType',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'OrderCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'filler',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'royaltyAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OrderFilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'collection',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'ipholder',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paymentToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoyaltyPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_approval',
        internalType: 'struct TradeshipCrates.Approval',
        type: 'tuple',
        components: [
          { name: 'expire', internalType: 'uint256', type: 'uint256' },
          { name: 'feeAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'feeToken', internalType: 'address', type: 'address' },
          { name: 'filler', internalType: 'address', type: 'address' },
          { name: 'sigs', internalType: 'bytes[]', type: 'bytes[]' },
        ],
      },
    ],
    name: '_hashApproval',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_order',
        internalType: 'struct TradeshipCrates.Order',
        type: 'tuple',
        components: [
          { name: 'offerer', internalType: 'address', type: 'address' },
          {
            name: 'offerings',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum TradeshipCrates.OrderType',
            type: 'uint8',
          },
          { name: 'startAt', internalType: 'uint256', type: 'uint256' },
          { name: 'endAt', internalType: 'uint256', type: 'uint256' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: '_hashOrder',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_orders',
        internalType: 'struct TradeshipCrates.Order[]',
        type: 'tuple[]',
        components: [
          { name: 'offerer', internalType: 'address', type: 'address' },
          {
            name: 'offerings',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum TradeshipCrates.OrderType',
            type: 'uint8',
          },
          { name: 'startAt', internalType: 'uint256', type: 'uint256' },
          { name: 'endAt', internalType: 'uint256', type: 'uint256' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'cancelOrders',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'domainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_orders',
        internalType: 'struct TradeshipCrates.Order[]',
        type: 'tuple[]',
        components: [
          { name: 'offerer', internalType: 'address', type: 'address' },
          {
            name: 'offerings',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              {
                name: 'itemType',
                internalType: 'enum TradeshipCrates.ItemType',
                type: 'uint8',
              },
              { name: 'token', internalType: 'address', type: 'address' },
              {
                name: 'identifierOrCriteria',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum TradeshipCrates.OrderType',
            type: 'uint8',
          },
          { name: 'startAt', internalType: 'uint256', type: 'uint256' },
          { name: 'endAt', internalType: 'uint256', type: 'uint256' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: '_approval',
        internalType: 'struct TradeshipCrates.Approval',
        type: 'tuple',
        components: [
          { name: 'expire', internalType: 'uint256', type: 'uint256' },
          { name: 'feeAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'feeToken', internalType: 'address', type: 'address' },
          { name: 'filler', internalType: 'address', type: 'address' },
          { name: 'sigs', internalType: 'bytes[]', type: 'bytes[]' },
        ],
      },
      { name: '_serverSig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'fillOrders',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_port', internalType: 'address payable', type: 'address' },
      {
        name: '_stakerAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'portContract',
    outputs: [{ name: '', internalType: 'contract IPort', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakerAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

export const shipAddress = '0xDd987d82FbBfad9c85ae46268f1A1bB9c2ef7F4a' as const

export const shipConfig = { address: shipAddress, abi: shipAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stake
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakeAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Harvest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'staker',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalStaked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MembershipStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'staker',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalStaked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MembershipUnstaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RyoshiStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RyoshiUnstaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'amountRyoshiStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'staker', internalType: 'address', type: 'address' }],
    name: 'amountStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'completedPool',
    outputs: [
      { name: '', internalType: 'contract RewardsPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'curPool',
    outputs: [
      { name: '', internalType: 'contract RewardsPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentPoolId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentStaked',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endInitPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'epochLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getReleasedReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address payable', type: 'address' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberships', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'periodEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'pools',
    outputs: [
      { name: '', internalType: 'contract RewardsPool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardsId',
    outputs: [{ name: '_value', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardsPaid',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_length', internalType: 'uint256', type: 'uint256' }],
    name: 'setEpochLength',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'contract IERC721', type: 'address' },
    ],
    name: 'setRyoshiVIP',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'stakeRyoshi',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'stakedRyoshi',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'unstakeRyoshi',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'updatePool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

export const stakeAddress =
  '0x36b95208BDb6d4048b4E581e174C1726e49aE1f4' as const

export const stakeConfig = { address: stakeAddress, abi: stakeAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__
 */
export const useReadBundle = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadBundleBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"contents"`
 */
export const useReadBundleContents = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'contents',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadBundleGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadBundleIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"name"`
 */
export const useReadBundleName = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBundleOwner = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadBundleOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadBundleSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadBundleSymbol = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadBundleTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadBundleTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__
 */
export const useWriteBundle = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteBundleApprove = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useWriteBundleOnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useWriteBundleOnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBundleRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteBundleSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteBundleSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"setUri"`
 */
export const useWriteBundleSetUri = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'setUri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteBundleTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBundleTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"unwrap"`
 */
export const useWriteBundleUnwrap = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'unwrap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"wrap"`
 */
export const useWriteBundleWrap = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'wrap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"wrapAndList"`
 */
export const useWriteBundleWrapAndList = /*#__PURE__*/ createUseWriteContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'wrapAndList',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__
 */
export const useSimulateBundle = /*#__PURE__*/ createUseSimulateContract({
  abi: bundleAbi,
  address: bundleAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateBundleApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: bundleAbi, address: bundleAddress, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useSimulateBundleOnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useSimulateBundleOnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBundleRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateBundleSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateBundleSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"setUri"`
 */
export const useSimulateBundleSetUri = /*#__PURE__*/ createUseSimulateContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'setUri',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateBundleTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBundleTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"unwrap"`
 */
export const useSimulateBundleUnwrap = /*#__PURE__*/ createUseSimulateContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'unwrap',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"wrap"`
 */
export const useSimulateBundleWrap = /*#__PURE__*/ createUseSimulateContract({
  abi: bundleAbi,
  address: bundleAddress,
  functionName: 'wrap',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bundleAbi}__ and `functionName` set to `"wrapAndList"`
 */
export const useSimulateBundleWrapAndList =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bundleAbi,
    address: bundleAddress,
    functionName: 'wrapAndList',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__
 */
export const useWatchBundleEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: bundleAbi,
  address: bundleAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchBundleApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchBundleApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"BundleCreated"`
 */
export const useWatchBundleBundleCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'BundleCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"BundleDestroyed"`
 */
export const useWatchBundleBundleDestroyedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'BundleDestroyed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"ConsecutiveTransfer"`
 */
export const useWatchBundleConsecutiveTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'ConsecutiveTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBundleOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bundleAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchBundleTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bundleAbi,
    address: bundleAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__
 */
export const useReadOffer = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadOfferDefaultAdminRole = /*#__PURE__*/ createUseReadContract(
  { abi: offerAbi, address: offerAddress, functionName: 'DEFAULT_ADMIN_ROLE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"IID_IERC1155"`
 */
export const useReadOfferIidIerc1155 = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'IID_IERC1155',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"IID_IERC721"`
 */
export const useReadOfferIidIerc721 = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'IID_IERC721',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"STAFF_ROLE"`
 */
export const useReadOfferStaffRole = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'STAFF_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"UPGRADER_ROLE"`
 */
export const useReadOfferUpgraderRole = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'UPGRADER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"generateHash"`
 */
export const useReadOfferGenerateHash = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'generateHash',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"getCollectionOffer"`
 */
export const useReadOfferGetCollectionOffer =
  /*#__PURE__*/ createUseReadContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'getCollectionOffer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"getCollectionOffers"`
 */
export const useReadOfferGetCollectionOffers =
  /*#__PURE__*/ createUseReadContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'getCollectionOffers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"getOffer"`
 */
export const useReadOfferGetOffer = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'getOffer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"getOffers"`
 */
export const useReadOfferGetOffers = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'getOffers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadOfferGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadOfferHasRole = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"is1155"`
 */
export const useReadOfferIs1155 = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'is1155',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"is721"`
 */
export const useReadOfferIs721 = /*#__PURE__*/ createUseReadContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'is721',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadOfferSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__
 */
export const useWriteOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"acceptCollectionOffer"`
 */
export const useWriteOfferAcceptCollectionOffer =
  /*#__PURE__*/ createUseWriteContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'acceptCollectionOffer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"acceptOffer"`
 */
export const useWriteOfferAcceptOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'acceptOffer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"cancelCollectionOffer"`
 */
export const useWriteOfferCancelCollectionOffer =
  /*#__PURE__*/ createUseWriteContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'cancelCollectionOffer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"cancelOffer"`
 */
export const useWriteOfferCancelOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'cancelOffer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteOfferGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOfferInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"makeCollectionOffer"`
 */
export const useWriteOfferMakeCollectionOffer =
  /*#__PURE__*/ createUseWriteContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'makeCollectionOffer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"makeOffer"`
 */
export const useWriteOfferMakeOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'makeOffer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"rejectOffer"`
 */
export const useWriteOfferRejectOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'rejectOffer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteOfferRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteOfferRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"updateOffer"`
 */
export const useWriteOfferUpdateOffer = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'updateOffer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteOfferUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: offerAbi,
  address: offerAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteOfferUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"uppdateCollectionOffer"`
 */
export const useWriteOfferUppdateCollectionOffer =
  /*#__PURE__*/ createUseWriteContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'uppdateCollectionOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__
 */
export const useSimulateOffer = /*#__PURE__*/ createUseSimulateContract({
  abi: offerAbi,
  address: offerAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"acceptCollectionOffer"`
 */
export const useSimulateOfferAcceptCollectionOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'acceptCollectionOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"acceptOffer"`
 */
export const useSimulateOfferAcceptOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'acceptOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"cancelCollectionOffer"`
 */
export const useSimulateOfferCancelCollectionOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'cancelCollectionOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"cancelOffer"`
 */
export const useSimulateOfferCancelOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'cancelOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateOfferGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOfferInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"makeCollectionOffer"`
 */
export const useSimulateOfferMakeCollectionOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'makeCollectionOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"makeOffer"`
 */
export const useSimulateOfferMakeOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'makeOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"rejectOffer"`
 */
export const useSimulateOfferRejectOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'rejectOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateOfferRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateOfferRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"updateOffer"`
 */
export const useSimulateOfferUpdateOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'updateOffer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateOfferUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateOfferUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link offerAbi}__ and `functionName` set to `"uppdateCollectionOffer"`
 */
export const useSimulateOfferUppdateCollectionOffer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: offerAbi,
    address: offerAddress,
    functionName: 'uppdateCollectionOffer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__
 */
export const useWatchOfferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: offerAbi,
  address: offerAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchOfferAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchOfferBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"CollectionOfferAccepted"`
 */
export const useWatchOfferCollectionOfferAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'CollectionOfferAccepted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"CollectionOfferCancelled"`
 */
export const useWatchOfferCollectionOfferCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'CollectionOfferCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"CollectionOfferMade"`
 */
export const useWatchOfferCollectionOfferMadeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'CollectionOfferMade',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"CollectionOfferUpdated"`
 */
export const useWatchOfferCollectionOfferUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'CollectionOfferUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"OfferAccepted"`
 */
export const useWatchOfferOfferAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'OfferAccepted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"OfferCancelled"`
 */
export const useWatchOfferOfferCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'OfferCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"OfferMade"`
 */
export const useWatchOfferOfferMadeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'OfferMade',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"OfferRejected"`
 */
export const useWatchOfferOfferRejectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'OfferRejected',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"OfferUpdated"`
 */
export const useWatchOfferOfferUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'OfferUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchOfferRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchOfferRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchOfferRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link offerAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchOfferUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: offerAbi,
    address: offerAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__
 */
export const useReadPort = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadPortDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"activeListing"`
 */
export const useReadPortActiveListing = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'activeListing',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"calculateRoyalty"`
 */
export const useReadPortCalculateRoyalty = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'calculateRoyalty',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelledListing"`
 */
export const useReadPortCancelledListing = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'cancelledListing',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"completeListing"`
 */
export const useReadPortCompleteListing = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'completeListing',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"fee"`
 */
export const useReadPortFee = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'fee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadPortGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"getRoyalty"`
 */
export const useReadPortGetRoyalty = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'getRoyalty',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"getStandardNFTRoyalty"`
 */
export const useReadPortGetStandardNftRoyalty =
  /*#__PURE__*/ createUseReadContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'getStandardNFTRoyalty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadPortHasRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"isBundleContract"`
 */
export const useReadPortIsBundleContract = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'isBundleContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"isFM"`
 */
export const useReadPortIsFm = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'isFM',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"isMember"`
 */
export const useReadPortIsMember = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'isMember',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"isRoyaltyStandard"`
 */
export const useReadPortIsRoyaltyStandard = /*#__PURE__*/ createUseReadContract(
  { abi: portAbi, address: portAddress, functionName: 'isRoyaltyStandard' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"isVIP"`
 */
export const useReadPortIsVip = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'isVIP',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"memberFee"`
 */
export const useReadPortMemberFee = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'memberFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"membershipStaker"`
 */
export const useReadPortMembershipStaker = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'membershipStaker',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"payments"`
 */
export const useReadPortPayments = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'payments',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"pool"`
 */
export const useReadPortPool = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'pool',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"priceLookup"`
 */
export const useReadPortPriceLookup = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'priceLookup',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadPortProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"regFee"`
 */
export const useReadPortRegFee = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'regFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"royalties"`
 */
export const useReadPortRoyalties = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'royalties',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"serverRole"`
 */
export const useReadPortServerRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'serverRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"sigRole"`
 */
export const useReadPortSigRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'sigRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"staffRole"`
 */
export const useReadPortStaffRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'staffRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadPortSupportsInterface = /*#__PURE__*/ createUseReadContract(
  { abi: portAbi, address: portAddress, functionName: 'supportsInterface' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"upgraderRole"`
 */
export const useReadPortUpgraderRole = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'upgraderRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"useEscrow"`
 */
export const useReadPortUseEscrow = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'useEscrow',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"vipFee"`
 */
export const useReadPortVipFee = /*#__PURE__*/ createUseReadContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'vipFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__
 */
export const useWritePort = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"addToEscrow"`
 */
export const useWritePortAddToEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'addToEscrow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"bulkTransfer"`
 */
export const useWritePortBulkTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'bulkTransfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelActive"`
 */
export const useWritePortCancelActive = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'cancelActive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelListing"`
 */
export const useWritePortCancelListing = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'cancelListing',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelListings"`
 */
export const useWritePortCancelListings = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'cancelListings',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"executeTradesServer"`
 */
export const useWritePortExecuteTradesServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'executeTradesServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWritePortGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePortInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeLegacyPurchase"`
 */
export const useWritePortMakeLegacyPurchase =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeLegacyPurchase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListing"`
 */
export const useWritePortMakeListing = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'makeListing',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListingServer"`
 */
export const useWritePortMakeListingServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeListingServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListings"`
 */
export const useWritePortMakeListings = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'makeListings',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"payRoyalty"`
 */
export const useWritePortPayRoyalty = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'payRoyalty',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"payRoyaltyServer"`
 */
export const useWritePortPayRoyaltyServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'payRoyaltyServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"registerRoyalty"`
 */
export const useWritePortRegisterRoyalty = /*#__PURE__*/ createUseWriteContract(
  { abi: portAbi, address: portAddress, functionName: 'registerRoyalty' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"registerRoyaltyAsOwner"`
 */
export const useWritePortRegisterRoyaltyAsOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'registerRoyaltyAsOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"removeRoyalty"`
 */
export const useWritePortRemoveRoyalty = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'removeRoyalty',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWritePortRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWritePortRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setMembershipStaker"`
 */
export const useWritePortSetMembershipStaker =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'setMembershipStaker',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setPool"`
 */
export const useWritePortSetPool = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'setPool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setRyoshi"`
 */
export const useWritePortSetRyoshi = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'setRyoshi',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setUseEscrow"`
 */
export const useWritePortSetUseEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'setUseEscrow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"transferBulkServer"`
 */
export const useWritePortTransferBulkServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'transferBulkServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"transferToken"`
 */
export const useWritePortTransferToken = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'transferToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"updateFees"`
 */
export const useWritePortUpdateFees = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'updateFees',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWritePortUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWritePortUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWritePortWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"withdrawPayments"`
 */
export const useWritePortWithdrawPayments =
  /*#__PURE__*/ createUseWriteContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'withdrawPayments',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__
 */
export const useSimulatePort = /*#__PURE__*/ createUseSimulateContract({
  abi: portAbi,
  address: portAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"addToEscrow"`
 */
export const useSimulatePortAddToEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'addToEscrow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"bulkTransfer"`
 */
export const useSimulatePortBulkTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'bulkTransfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelActive"`
 */
export const useSimulatePortCancelActive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'cancelActive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelListing"`
 */
export const useSimulatePortCancelListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'cancelListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"cancelListings"`
 */
export const useSimulatePortCancelListings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'cancelListings',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"executeTradesServer"`
 */
export const useSimulatePortExecuteTradesServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'executeTradesServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulatePortGrantRole = /*#__PURE__*/ createUseSimulateContract(
  { abi: portAbi, address: portAddress, functionName: 'grantRole' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePortInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeLegacyPurchase"`
 */
export const useSimulatePortMakeLegacyPurchase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeLegacyPurchase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListing"`
 */
export const useSimulatePortMakeListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListingServer"`
 */
export const useSimulatePortMakeListingServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeListingServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"makeListings"`
 */
export const useSimulatePortMakeListings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'makeListings',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"payRoyalty"`
 */
export const useSimulatePortPayRoyalty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'payRoyalty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"payRoyaltyServer"`
 */
export const useSimulatePortPayRoyaltyServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'payRoyaltyServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"registerRoyalty"`
 */
export const useSimulatePortRegisterRoyalty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'registerRoyalty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"registerRoyaltyAsOwner"`
 */
export const useSimulatePortRegisterRoyaltyAsOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'registerRoyaltyAsOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"removeRoyalty"`
 */
export const useSimulatePortRemoveRoyalty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'removeRoyalty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulatePortRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulatePortRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setMembershipStaker"`
 */
export const useSimulatePortSetMembershipStaker =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'setMembershipStaker',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setPool"`
 */
export const useSimulatePortSetPool = /*#__PURE__*/ createUseSimulateContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'setPool',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setRyoshi"`
 */
export const useSimulatePortSetRyoshi = /*#__PURE__*/ createUseSimulateContract(
  { abi: portAbi, address: portAddress, functionName: 'setRyoshi' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"setUseEscrow"`
 */
export const useSimulatePortSetUseEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'setUseEscrow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"transferBulkServer"`
 */
export const useSimulatePortTransferBulkServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'transferBulkServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"transferToken"`
 */
export const useSimulatePortTransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"updateFees"`
 */
export const useSimulatePortUpdateFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'updateFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulatePortUpgradeTo = /*#__PURE__*/ createUseSimulateContract(
  { abi: portAbi, address: portAddress, functionName: 'upgradeTo' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulatePortUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulatePortWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: portAbi,
  address: portAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portAbi}__ and `functionName` set to `"withdrawPayments"`
 */
export const useSimulatePortWithdrawPayments =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portAbi,
    address: portAddress,
    functionName: 'withdrawPayments',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__
 */
export const useWatchPortEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: portAbi,
  address: portAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchPortAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"AdminWithdraw"`
 */
export const useWatchPortAdminWithdrawEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'AdminWithdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchPortBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"Cancelled"`
 */
export const useWatchPortCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'Cancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"EscrowChanged"`
 */
export const useWatchPortEscrowChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'EscrowChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"FeesUpdate"`
 */
export const useWatchPortFeesUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'FeesUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchPortInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"Listed"`
 */
export const useWatchPortListedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'Listed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchPortRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchPortRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchPortRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoyaltyChanged"`
 */
export const useWatchPortRoyaltyChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoyaltyChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoyaltyPaid"`
 */
export const useWatchPortRoyaltyPaidEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoyaltyPaid',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"RoyaltyRemoved"`
 */
export const useWatchPortRoyaltyRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'RoyaltyRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"Sold"`
 */
export const useWatchPortSoldEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: portAbi,
  address: portAddress,
  eventName: 'Sold',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"StakerUpdated"`
 */
export const useWatchPortStakerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'StakerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchPortUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portAbi,
    address: portAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__
 */
export const useReadShip = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadShipDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"_hashApproval"`
 */
export const useReadShipHashApproval = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: '_hashApproval',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"_hashOrder"`
 */
export const useReadShipHashOrder = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: '_hashOrder',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"domainSeparator"`
 */
export const useReadShipDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'domainSeparator',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"executed"`
 */
export const useReadShipExecuted = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'executed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadShipGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadShipHasRole = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"portContract"`
 */
export const useReadShipPortContract = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'portContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadShipProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"stakerAddress"`
 */
export const useReadShipStakerAddress = /*#__PURE__*/ createUseReadContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'stakerAddress',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadShipSupportsInterface = /*#__PURE__*/ createUseReadContract(
  { abi: shipAbi, address: shipAddress, functionName: 'supportsInterface' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__
 */
export const useWriteShip = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"cancelOrders"`
 */
export const useWriteShipCancelOrders = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'cancelOrders',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"fillOrders"`
 */
export const useWriteShipFillOrders = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'fillOrders',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteShipGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteShipInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteShipRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteShipRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteShipUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: shipAbi,
  address: shipAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteShipUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__
 */
export const useSimulateShip = /*#__PURE__*/ createUseSimulateContract({
  abi: shipAbi,
  address: shipAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"cancelOrders"`
 */
export const useSimulateShipCancelOrders =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'cancelOrders',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"fillOrders"`
 */
export const useSimulateShipFillOrders =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'fillOrders',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateShipGrantRole = /*#__PURE__*/ createUseSimulateContract(
  { abi: shipAbi, address: shipAddress, functionName: 'grantRole' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateShipInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateShipRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateShipRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateShipUpgradeTo = /*#__PURE__*/ createUseSimulateContract(
  { abi: shipAbi, address: shipAddress, functionName: 'upgradeTo' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link shipAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateShipUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: shipAbi,
    address: shipAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__
 */
export const useWatchShipEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: shipAbi,
  address: shipAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchShipAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchShipBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchShipInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"OrderCancelled"`
 */
export const useWatchShipOrderCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'OrderCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"OrderFilled"`
 */
export const useWatchShipOrderFilledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'OrderFilled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchShipRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchShipRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchShipRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"RoyaltyPaid"`
 */
export const useWatchShipRoyaltyPaidEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'RoyaltyPaid',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link shipAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchShipUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: shipAbi,
    address: shipAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__
 */
export const useReadStake = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"amountRyoshiStaked"`
 */
export const useReadStakeAmountRyoshiStaked =
  /*#__PURE__*/ createUseReadContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'amountRyoshiStaked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"amountStaked"`
 */
export const useReadStakeAmountStaked = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'amountStaked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"completedPool"`
 */
export const useReadStakeCompletedPool = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'completedPool',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"curPool"`
 */
export const useReadStakeCurPool = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'curPool',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"currentPoolId"`
 */
export const useReadStakeCurrentPoolId = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'currentPoolId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"currentStaked"`
 */
export const useReadStakeCurrentStaked = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'currentStaked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"epochLength"`
 */
export const useReadStakeEpochLength = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'epochLength',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"getReleasedReward"`
 */
export const useReadStakeGetReleasedReward =
  /*#__PURE__*/ createUseReadContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'getReleasedReward',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"getReward"`
 */
export const useReadStakeGetReward = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'getReward',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"name"`
 */
export const useReadStakeName = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"owner"`
 */
export const useReadStakeOwner = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"periodEnd"`
 */
export const useReadStakePeriodEnd = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'periodEnd',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"poolBalance"`
 */
export const useReadStakePoolBalance = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'poolBalance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"pools"`
 */
export const useReadStakePools = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'pools',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"rewardsId"`
 */
export const useReadStakeRewardsId = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'rewardsId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"rewardsPaid"`
 */
export const useReadStakeRewardsPaid = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'rewardsPaid',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"stakedRyoshi"`
 */
export const useReadStakeStakedRyoshi = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'stakedRyoshi',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadStakeSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"totalStaked"`
 */
export const useReadStakeTotalStaked = /*#__PURE__*/ createUseReadContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'totalStaked',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__
 */
export const useWriteStake = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"endInitPeriod"`
 */
export const useWriteStakeEndInitPeriod = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'endInitPeriod',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"harvest"`
 */
export const useWriteStakeHarvest = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'harvest',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteStakeInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useWriteStakeOnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useWriteStakeOnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteStakeRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"setEpochLength"`
 */
export const useWriteStakeSetEpochLength = /*#__PURE__*/ createUseWriteContract(
  { abi: stakeAbi, address: stakeAddress, functionName: 'setEpochLength' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"setRyoshiVIP"`
 */
export const useWriteStakeSetRyoshiVip = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'setRyoshiVIP',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"stake"`
 */
export const useWriteStakeStake = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"stakeRyoshi"`
 */
export const useWriteStakeStakeRyoshi = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'stakeRyoshi',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteStakeTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"unstake"`
 */
export const useWriteStakeUnstake = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"unstakeRyoshi"`
 */
export const useWriteStakeUnstakeRyoshi = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'unstakeRyoshi',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"updatePool"`
 */
export const useWriteStakeUpdatePool = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'updatePool',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteStakeUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteStakeUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__
 */
export const useSimulateStake = /*#__PURE__*/ createUseSimulateContract({
  abi: stakeAbi,
  address: stakeAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"endInitPeriod"`
 */
export const useSimulateStakeEndInitPeriod =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'endInitPeriod',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"harvest"`
 */
export const useSimulateStakeHarvest = /*#__PURE__*/ createUseSimulateContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'harvest',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateStakeInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useSimulateStakeOnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useSimulateStakeOnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateStakeRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"setEpochLength"`
 */
export const useSimulateStakeSetEpochLength =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'setEpochLength',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"setRyoshiVIP"`
 */
export const useSimulateStakeSetRyoshiVip =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'setRyoshiVIP',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"stake"`
 */
export const useSimulateStakeStake = /*#__PURE__*/ createUseSimulateContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"stakeRyoshi"`
 */
export const useSimulateStakeStakeRyoshi =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'stakeRyoshi',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateStakeTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"unstake"`
 */
export const useSimulateStakeUnstake = /*#__PURE__*/ createUseSimulateContract({
  abi: stakeAbi,
  address: stakeAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"unstakeRyoshi"`
 */
export const useSimulateStakeUnstakeRyoshi =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'unstakeRyoshi',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"updatePool"`
 */
export const useSimulateStakeUpdatePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'updatePool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateStakeUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakeAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateStakeUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakeAbi,
    address: stakeAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__
 */
export const useWatchStakeEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stakeAbi,
  address: stakeAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchStakeAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchStakeBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"Harvest"`
 */
export const useWatchStakeHarvestEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'Harvest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"MembershipStaked"`
 */
export const useWatchStakeMembershipStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'MembershipStaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"MembershipUnstaked"`
 */
export const useWatchStakeMembershipUnstakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'MembershipUnstaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchStakeOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"RyoshiStaked"`
 */
export const useWatchStakeRyoshiStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'RyoshiStaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"RyoshiUnstaked"`
 */
export const useWatchStakeRyoshiUnstakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'RyoshiUnstaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakeAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchStakeUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakeAbi,
    address: stakeAddress,
    eventName: 'Upgraded',
  })

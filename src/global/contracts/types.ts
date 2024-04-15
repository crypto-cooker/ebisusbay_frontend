import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi';
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bundle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bundleABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_market', internalType: 'address', type: 'address' }],
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
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'contracts', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'desc', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'BundleCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'BundleDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'fromTokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'toTokenId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ConsecutiveTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'contents',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
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
  },
  {
    stateMutability: 'nonpayable',
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_uri', internalType: 'string', type: 'string' }],
    name: 'setUri',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'unwrap',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_desc', internalType: 'string', type: 'string' },
    ],
    name: 'wrap',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
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
  },
] as const;

export const bundleAddress = '0x40874F18922267cc2Ca7933828594aB5078C1065' as const;

export const bundleConfig = { address: bundleAddress, abi: bundleABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// offer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const offerABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'seller', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CollectionOfferAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CollectionOfferCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CollectionOfferMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CollectionOfferUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'seller', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'coinAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OfferAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OfferCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'coinAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OfferMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'seller', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'coinAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OfferRejected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'buyer', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'coinAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'time', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OfferUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'previousAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'IID_IERC1155',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'IID_IERC721',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'STAFF_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'UPGRADER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_collection', internalType: 'address', type: 'address' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptCollectionOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_collection', internalType: 'address', type: 'address' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelCollectionOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelOffer',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_nftId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'generateHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_market', internalType: 'address payable', type: 'address' },
      { name: '_stakerAddress', internalType: 'address payable', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'is1155',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'is721',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: '_nft', internalType: 'address', type: 'address' }],
    name: 'makeCollectionOffer',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rejectOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'offerIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateOffer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'uppdateCollectionOffer',
    outputs: [],
  },
] as const;

export const offerAddress = '0x2bbCd54aC79E20974E02B07dB0F7e6c0AeA49305' as const;

export const offerConfig = { address: offerAddress, abi: offerABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// port
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portABI = [
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
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AdminWithdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'Cancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: false },
      { name: 'optedIn', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'EscrowChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'updater', internalType: 'address', type: 'address', indexed: true },
      { name: 'reg', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'fm', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'admin', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'FeesUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'Listed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'previousAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'staffMember', internalType: 'address', type: 'address', indexed: true },
      { name: 'collection', internalType: 'address', type: 'address', indexed: true },
      { name: 'ipHolder', internalType: 'address', type: 'address', indexed: false },
      { name: 'fee', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'RoyaltyChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'collection', internalType: 'address', type: 'address', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'ipholder', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RoyaltyPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'staffMember', internalType: 'address', type: 'address', indexed: true },
      { name: 'collection', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoyaltyRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'Sold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address', indexed: true },
      { name: 'newStaker', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'StakerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'addToEscrow',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'bulkTransfer',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateRoyalty',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_seller', internalType: 'address', type: 'address' },
    ],
    name: 'cancelActive',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelListing',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'cancelListings',
    outputs: [],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'transferInformation',
        internalType: 'struct ConduitTransfer[]',
        type: 'tuple[]',
        components: [
          { name: 'itemType', internalType: 'enum ConduitItemType', type: 'uint8' },
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'fee',
    outputs: [{ name: 'userFee', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_memberships', internalType: 'contract IERC1155', type: 'address' }],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_contract', internalType: 'address', type: 'address' }],
    name: 'isBundleContract',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isFM',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isMember',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_contract', internalType: 'address', type: 'address' }],
    name: 'isRoyaltyStandard',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isVIP',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_buyer', internalType: 'address', type: 'address' },
    ],
    name: 'makeLegacyPurchase',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeListing',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_seller', internalType: 'address', type: 'address' },
      { name: '_nft', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makeListingServer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_nfts', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_prices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'makeListings',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'memberFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'membershipStaker',
    outputs: [{ name: '', internalType: 'contract IMembershipStaker', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'payRoyalty',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'payRoyaltyServer',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'dest', internalType: 'address', type: 'address' }],
    name: 'payments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'priceLookup',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'regFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_nftContract', internalType: 'address', type: 'address' },
      { name: '_ipHolder', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'registerRoyalty',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_nftContract', internalType: 'address', type: 'address' },
      { name: '_paymentAddress', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'registerRoyaltyAsOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_nftContract', internalType: 'address', type: 'address' }],
    name: 'removeRoyalty',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'royalties',
    outputs: [
      { name: 'ipHolder', internalType: 'address', type: 'address' },
      { name: 'percent', internalType: 'uint16', type: 'uint16' },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'serverRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_membershipStaker', internalType: 'address', type: 'address' }],
    name: 'setMembershipStaker',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_pool', internalType: 'address', type: 'address' }],
    name: 'setPool',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_ryoshi', internalType: 'address', type: 'address' }],
    name: 'setRyoshi',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_optIn', internalType: 'bool', type: 'bool' },
    ],
    name: 'setUseEscrow',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'sigRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'staffRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'transferBulkServer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
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
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_regFee', internalType: 'uint16', type: 'uint16' },
      { name: '_memFee', internalType: 'uint16', type: 'uint16' },
      { name: '_vipFee', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateFees',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'upgraderRole',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'useEscrow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'vipFee',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'withdraw', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'payee', internalType: 'address payable', type: 'address' }],
    name: 'withdrawPayments',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;

export const portAddress = '0x8b5Eb1FeE264dc0Be38a42d36c5e4D25F4F40e4F' as const;

export const portConfig = { address: portAddress, abi: portABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ship
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shipABI = [
  { type: 'error', inputs: [], name: 'InvalidConsiderationsAmount' },
  { type: 'error', inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }], name: 'OrderInvalid' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' }],
    name: 'UnsupportedItemType',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'enum TradeshipCrates.OrderType', type: 'uint8' }],
    name: 'UnsupportedOrderType',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'orderHash', internalType: 'bytes32', type: 'bytes32', indexed: true }],
    name: 'OrderCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'orderHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'filler', internalType: 'address', type: 'address', indexed: false },
      { name: 'royaltyAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OrderFilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'previousAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'collection', internalType: 'address', type: 'address', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'ipholder', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'paymentToken', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'RoyaltyPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
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
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'orderType', internalType: 'enum TradeshipCrates.OrderType', type: 'uint8' },
          { name: 'startAt', internalType: 'uint256', type: 'uint256' },
          { name: 'endAt', internalType: 'uint256', type: 'uint256' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: '_hashOrder',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
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
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'orderType', internalType: 'enum TradeshipCrates.OrderType', type: 'uint8' },
          { name: 'startAt', internalType: 'uint256', type: 'uint256' },
          { name: 'endAt', internalType: 'uint256', type: 'uint256' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'cancelOrders',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'domainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'executed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
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
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'considerations',
            internalType: 'struct TradeshipCrates.OfferItem[]',
            type: 'tuple[]',
            components: [
              { name: 'itemType', internalType: 'enum TradeshipCrates.ItemType', type: 'uint8' },
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'identifierOrCriteria', internalType: 'uint256', type: 'uint256' },
              { name: 'startAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'endAmount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'orderType', internalType: 'enum TradeshipCrates.OrderType', type: 'uint8' },
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_port', internalType: 'address payable', type: 'address' },
      { name: '_stakerAddress', internalType: 'address payable', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'portContract',
    outputs: [{ name: '', internalType: 'contract IPort', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'stakerAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const;

export const shipAddress = '0xDd987d82FbBfad9c85ae46268f1A1bB9c2ef7F4a' as const;

export const shipConfig = { address: shipAddress, abi: shipABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stake
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakeABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Harvest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'staker', internalType: 'address', type: 'address', indexed: true },
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MembershipStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'staker', internalType: 'address', type: 'address', indexed: true },
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MembershipUnstaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'RyoshiStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'RyoshiUnstaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'amountRyoshiStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'staker', internalType: 'address', type: 'address' }],
    name: 'amountStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'completedPool',
    outputs: [{ name: '', internalType: 'contract RewardsPool', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'curPool',
    outputs: [{ name: '', internalType: 'contract RewardsPool', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'currentPoolId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'currentStaked',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'endInitPeriod', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'epochLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getReleasedReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address payable', type: 'address' }],
    name: 'harvest',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_memberships', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
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
  },
  {
    stateMutability: 'nonpayable',
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'periodEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'poolBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'pools',
    outputs: [{ name: '', internalType: 'contract RewardsPool', type: 'address' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'rewardsId',
    outputs: [{ name: '_value', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'rewardsPaid',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_length', internalType: 'uint256', type: 'uint256' }],
    name: 'setEpochLength',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'contract IERC721', type: 'address' }],
    name: 'setRyoshiVIP',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stake',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'stakeRyoshi',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'stakedRyoshi',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_ids', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'unstakeRyoshi',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'updatePool', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;

export const stakeAddress = '0x36b95208BDb6d4048b4E581e174C1726e49aE1f4' as const;

export const stakeConfig = { address: stakeAddress, abi: stakeABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__.
 */
export function useBundleRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any) {
  return useContractRead({ abi: bundleABI, address: bundleAddress, ...config } as UseContractReadConfig<
    typeof bundleABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useBundleBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"contents"`.
 */
export function useBundleContents<
  TFunctionName extends 'contents',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'contents',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"getApproved"`.
 */
export function useBundleGetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'getApproved',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useBundleIsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"name"`.
 */
export function useBundleName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"owner"`.
 */
export function useBundleOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useBundleOwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'ownerOf',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useBundleSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"symbol"`.
 */
export function useBundleSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useBundleTokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useBundleTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof bundleABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof bundleABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__.
 */
export function useBundleWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof bundleABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, TFunctionName, TMode>({
    abi: bundleABI,
    address: bundleAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"approve"`.
 */
export function useBundleApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof bundleABI, 'approve', TMode> & {
        abi?: never;
        functionName?: 'approve';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'approve', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'approve',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 */
export function useBundleOnErc1155BatchReceived<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'onERC1155BatchReceived'>['request']['abi'],
        'onERC1155BatchReceived',
        TMode
      > & { functionName?: 'onERC1155BatchReceived' }
    : UseContractWriteConfig<typeof bundleABI, 'onERC1155BatchReceived', TMode> & {
        abi?: never;
        functionName?: 'onERC1155BatchReceived';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'onERC1155BatchReceived', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"onERC1155Received"`.
 */
export function useBundleOnErc1155Received<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'onERC1155Received'>['request']['abi'],
        'onERC1155Received',
        TMode
      > & { functionName?: 'onERC1155Received' }
    : UseContractWriteConfig<typeof bundleABI, 'onERC1155Received', TMode> & {
        abi?: never;
        functionName?: 'onERC1155Received';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'onERC1155Received', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'onERC1155Received',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useBundleRenounceOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof bundleABI, 'renounceOwnership', TMode> & {
        abi?: never;
        functionName?: 'renounceOwnership';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'renounceOwnership', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'renounceOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useBundleSafeTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'safeTransferFrom'>['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof bundleABI, 'safeTransferFrom', TMode> & {
        abi?: never;
        functionName?: 'safeTransferFrom';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'safeTransferFrom', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'safeTransferFrom',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useBundleSetApprovalForAll<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'setApprovalForAll'>['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof bundleABI, 'setApprovalForAll', TMode> & {
        abi?: never;
        functionName?: 'setApprovalForAll';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'setApprovalForAll', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'setApprovalForAll',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"setUri"`.
 */
export function useBundleSetUri<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'setUri'>['request']['abi'],
        'setUri',
        TMode
      > & { functionName?: 'setUri' }
    : UseContractWriteConfig<typeof bundleABI, 'setUri', TMode> & {
        abi?: never;
        functionName?: 'setUri';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'setUri', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'setUri',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useBundleTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof bundleABI, 'transferFrom', TMode> & {
        abi?: never;
        functionName?: 'transferFrom';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'transferFrom', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'transferFrom',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useBundleTransferOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof bundleABI, 'transferOwnership', TMode> & {
        abi?: never;
        functionName?: 'transferOwnership';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'transferOwnership', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'transferOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"unwrap"`.
 */
export function useBundleUnwrap<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'unwrap'>['request']['abi'],
        'unwrap',
        TMode
      > & { functionName?: 'unwrap' }
    : UseContractWriteConfig<typeof bundleABI, 'unwrap', TMode> & {
        abi?: never;
        functionName?: 'unwrap';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'unwrap', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'unwrap',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"wrap"`.
 */
export function useBundleWrap<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof bundleABI, 'wrap'>['request']['abi'], 'wrap', TMode> & {
        functionName?: 'wrap';
      }
    : UseContractWriteConfig<typeof bundleABI, 'wrap', TMode> & {
        abi?: never;
        functionName?: 'wrap';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'wrap', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'wrap',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"wrapAndList"`.
 */
export function useBundleWrapAndList<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bundleABI, 'wrapAndList'>['request']['abi'],
        'wrapAndList',
        TMode
      > & { functionName?: 'wrapAndList' }
    : UseContractWriteConfig<typeof bundleABI, 'wrapAndList', TMode> & {
        abi?: never;
        functionName?: 'wrapAndList';
      } = {} as any,
) {
  return useContractWrite<typeof bundleABI, 'wrapAndList', TMode>({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'wrapAndList',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__.
 */
export function usePrepareBundleWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof bundleABI, TFunctionName>, 'abi' | 'address'> = {} as any,
) {
  return usePrepareContractWrite({ abi: bundleABI, address: bundleAddress, ...config } as UsePrepareContractWriteConfig<
    typeof bundleABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareBundleApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'approve'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 */
export function usePrepareBundleOnErc1155BatchReceived(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'onERC1155BatchReceived'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'onERC1155BatchReceived'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"onERC1155Received"`.
 */
export function usePrepareBundleOnErc1155Received(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'onERC1155Received'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'onERC1155Received',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'onERC1155Received'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareBundleRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'renounceOwnership'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareBundleSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'safeTransferFrom'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareBundleSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'setApprovalForAll'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"setUri"`.
 */
export function usePrepareBundleSetUri(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'setUri'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'setUri',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'setUri'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareBundleTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'transferFrom'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareBundleTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'transferOwnership'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"unwrap"`.
 */
export function usePrepareBundleUnwrap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'unwrap'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'unwrap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'unwrap'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"wrap"`.
 */
export function usePrepareBundleWrap(
  config: Omit<UsePrepareContractWriteConfig<typeof bundleABI, 'wrap'>, 'abi' | 'address' | 'functionName'> = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'wrap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'wrap'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bundleABI}__ and `functionName` set to `"wrapAndList"`.
 */
export function usePrepareBundleWrapAndList(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bundleABI, 'wrapAndList'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bundleABI,
    address: bundleAddress,
    functionName: 'wrapAndList',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bundleABI, 'wrapAndList'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__.
 */
export function useBundleEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof bundleABI, TEventName>, 'abi' | 'address'> = {} as any,
) {
  return useContractEvent({ abi: bundleABI, address: bundleAddress, ...config } as UseContractEventConfig<
    typeof bundleABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"Approval"`.
 */
export function useBundleApprovalEvent(
  config: Omit<UseContractEventConfig<typeof bundleABI, 'Approval'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'Approval'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useBundleApprovalForAllEvent(
  config: Omit<UseContractEventConfig<typeof bundleABI, 'ApprovalForAll'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'ApprovalForAll'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"BundleCreated"`.
 */
export function useBundleBundleCreatedEvent(
  config: Omit<UseContractEventConfig<typeof bundleABI, 'BundleCreated'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'BundleCreated',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'BundleCreated'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"BundleDestroyed"`.
 */
export function useBundleBundleDestroyedEvent(
  config: Omit<
    UseContractEventConfig<typeof bundleABI, 'BundleDestroyed'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'BundleDestroyed',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'BundleDestroyed'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"ConsecutiveTransfer"`.
 */
export function useBundleConsecutiveTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof bundleABI, 'ConsecutiveTransfer'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'ConsecutiveTransfer',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'ConsecutiveTransfer'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useBundleOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof bundleABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'OwnershipTransferred'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bundleABI}__ and `eventName` set to `"Transfer"`.
 */
export function useBundleTransferEvent(
  config: Omit<UseContractEventConfig<typeof bundleABI, 'Transfer'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: bundleABI,
    address: bundleAddress,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof bundleABI, 'Transfer'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__.
 */
export function useOfferRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any) {
  return useContractRead({ abi: offerABI, address: offerAddress, ...config } as UseContractReadConfig<
    typeof offerABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useOfferDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"IID_IERC1155"`.
 */
export function useOfferIidIerc1155<
  TFunctionName extends 'IID_IERC1155',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'IID_IERC1155',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"IID_IERC721"`.
 */
export function useOfferIidIerc721<
  TFunctionName extends 'IID_IERC721',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'IID_IERC721',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"STAFF_ROLE"`.
 */
export function useOfferStaffRole<
  TFunctionName extends 'STAFF_ROLE',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'STAFF_ROLE',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"UPGRADER_ROLE"`.
 */
export function useOfferUpgraderRole<
  TFunctionName extends 'UPGRADER_ROLE',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'UPGRADER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"generateHash"`.
 */
export function useOfferGenerateHash<
  TFunctionName extends 'generateHash',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'generateHash',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"getCollectionOffer"`.
 */
export function useOfferGetCollectionOffer<
  TFunctionName extends 'getCollectionOffer',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'getCollectionOffer',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"getCollectionOffers"`.
 */
export function useOfferGetCollectionOffers<
  TFunctionName extends 'getCollectionOffers',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'getCollectionOffers',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"getOffer"`.
 */
export function useOfferGetOffer<
  TFunctionName extends 'getOffer',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'getOffer',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"getOffers"`.
 */
export function useOfferGetOffers<
  TFunctionName extends 'getOffers',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'getOffers',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useOfferGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"hasRole"`.
 */
export function useOfferHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"is1155"`.
 */
export function useOfferIs1155<
  TFunctionName extends 'is1155',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'is1155',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"is721"`.
 */
export function useOfferIs721<
  TFunctionName extends 'is721',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'is721',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useOfferSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof offerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: offerABI,
    address: offerAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof offerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__.
 */
export function useOfferWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof offerABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, TFunctionName, TMode>({
    abi: offerABI,
    address: offerAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"acceptCollectionOffer"`.
 */
export function useOfferAcceptCollectionOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'acceptCollectionOffer'>['request']['abi'],
        'acceptCollectionOffer',
        TMode
      > & { functionName?: 'acceptCollectionOffer' }
    : UseContractWriteConfig<typeof offerABI, 'acceptCollectionOffer', TMode> & {
        abi?: never;
        functionName?: 'acceptCollectionOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'acceptCollectionOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'acceptCollectionOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"acceptOffer"`.
 */
export function useOfferAcceptOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'acceptOffer'>['request']['abi'],
        'acceptOffer',
        TMode
      > & { functionName?: 'acceptOffer' }
    : UseContractWriteConfig<typeof offerABI, 'acceptOffer', TMode> & {
        abi?: never;
        functionName?: 'acceptOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'acceptOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'acceptOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"cancelCollectionOffer"`.
 */
export function useOfferCancelCollectionOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'cancelCollectionOffer'>['request']['abi'],
        'cancelCollectionOffer',
        TMode
      > & { functionName?: 'cancelCollectionOffer' }
    : UseContractWriteConfig<typeof offerABI, 'cancelCollectionOffer', TMode> & {
        abi?: never;
        functionName?: 'cancelCollectionOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'cancelCollectionOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'cancelCollectionOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"cancelOffer"`.
 */
export function useOfferCancelOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'cancelOffer'>['request']['abi'],
        'cancelOffer',
        TMode
      > & { functionName?: 'cancelOffer' }
    : UseContractWriteConfig<typeof offerABI, 'cancelOffer', TMode> & {
        abi?: never;
        functionName?: 'cancelOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'cancelOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'cancelOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"grantRole"`.
 */
export function useOfferGrantRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'grantRole'>['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof offerABI, 'grantRole', TMode> & {
        abi?: never;
        functionName?: 'grantRole';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'grantRole', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'grantRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"initialize"`.
 */
export function useOfferInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof offerABI, 'initialize', TMode> & {
        abi?: never;
        functionName?: 'initialize';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'initialize', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'initialize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"makeCollectionOffer"`.
 */
export function useOfferMakeCollectionOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'makeCollectionOffer'>['request']['abi'],
        'makeCollectionOffer',
        TMode
      > & { functionName?: 'makeCollectionOffer' }
    : UseContractWriteConfig<typeof offerABI, 'makeCollectionOffer', TMode> & {
        abi?: never;
        functionName?: 'makeCollectionOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'makeCollectionOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'makeCollectionOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"makeOffer"`.
 */
export function useOfferMakeOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'makeOffer'>['request']['abi'],
        'makeOffer',
        TMode
      > & { functionName?: 'makeOffer' }
    : UseContractWriteConfig<typeof offerABI, 'makeOffer', TMode> & {
        abi?: never;
        functionName?: 'makeOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'makeOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'makeOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"rejectOffer"`.
 */
export function useOfferRejectOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'rejectOffer'>['request']['abi'],
        'rejectOffer',
        TMode
      > & { functionName?: 'rejectOffer' }
    : UseContractWriteConfig<typeof offerABI, 'rejectOffer', TMode> & {
        abi?: never;
        functionName?: 'rejectOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'rejectOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'rejectOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useOfferRenounceRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'renounceRole'>['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof offerABI, 'renounceRole', TMode> & {
        abi?: never;
        functionName?: 'renounceRole';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'renounceRole', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'renounceRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useOfferRevokeRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'revokeRole'>['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof offerABI, 'revokeRole', TMode> & {
        abi?: never;
        functionName?: 'revokeRole';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'revokeRole', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'revokeRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"updateOffer"`.
 */
export function useOfferUpdateOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'updateOffer'>['request']['abi'],
        'updateOffer',
        TMode
      > & { functionName?: 'updateOffer' }
    : UseContractWriteConfig<typeof offerABI, 'updateOffer', TMode> & {
        abi?: never;
        functionName?: 'updateOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'updateOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'updateOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useOfferUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof offerABI, 'upgradeTo', TMode> & {
        abi?: never;
        functionName?: 'upgradeTo';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'upgradeTo', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'upgradeTo',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useOfferUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof offerABI, 'upgradeToAndCall', TMode> & {
        abi?: never;
        functionName?: 'upgradeToAndCall';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'upgradeToAndCall', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"uppdateCollectionOffer"`.
 */
export function useOfferUppdateCollectionOffer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof offerABI, 'uppdateCollectionOffer'>['request']['abi'],
        'uppdateCollectionOffer',
        TMode
      > & { functionName?: 'uppdateCollectionOffer' }
    : UseContractWriteConfig<typeof offerABI, 'uppdateCollectionOffer', TMode> & {
        abi?: never;
        functionName?: 'uppdateCollectionOffer';
      } = {} as any,
) {
  return useContractWrite<typeof offerABI, 'uppdateCollectionOffer', TMode>({
    abi: offerABI,
    address: offerAddress,
    functionName: 'uppdateCollectionOffer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__.
 */
export function usePrepareOfferWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof offerABI, TFunctionName>, 'abi' | 'address'> = {} as any,
) {
  return usePrepareContractWrite({ abi: offerABI, address: offerAddress, ...config } as UsePrepareContractWriteConfig<
    typeof offerABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"acceptCollectionOffer"`.
 */
export function usePrepareOfferAcceptCollectionOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'acceptCollectionOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'acceptCollectionOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'acceptCollectionOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"acceptOffer"`.
 */
export function usePrepareOfferAcceptOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'acceptOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'acceptOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'acceptOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"cancelCollectionOffer"`.
 */
export function usePrepareOfferCancelCollectionOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'cancelCollectionOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'cancelCollectionOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'cancelCollectionOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"cancelOffer"`.
 */
export function usePrepareOfferCancelOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'cancelOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'cancelOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'cancelOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareOfferGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'grantRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareOfferInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'initialize'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"makeCollectionOffer"`.
 */
export function usePrepareOfferMakeCollectionOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'makeCollectionOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'makeCollectionOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'makeCollectionOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"makeOffer"`.
 */
export function usePrepareOfferMakeOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'makeOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'makeOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'makeOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"rejectOffer"`.
 */
export function usePrepareOfferRejectOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'rejectOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'rejectOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'rejectOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareOfferRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'renounceRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareOfferRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'revokeRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"updateOffer"`.
 */
export function usePrepareOfferUpdateOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'updateOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'updateOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'updateOffer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareOfferUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'upgradeTo'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareOfferUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'upgradeToAndCall'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link offerABI}__ and `functionName` set to `"uppdateCollectionOffer"`.
 */
export function usePrepareOfferUppdateCollectionOffer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof offerABI, 'uppdateCollectionOffer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: offerABI,
    address: offerAddress,
    functionName: 'uppdateCollectionOffer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof offerABI, 'uppdateCollectionOffer'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__.
 */
export function useOfferEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof offerABI, TEventName>, 'abi' | 'address'> = {} as any,
) {
  return useContractEvent({ abi: offerABI, address: offerAddress, ...config } as UseContractEventConfig<
    typeof offerABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"AdminChanged"`.
 */
export function useOfferAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'AdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"BeaconUpgraded"`.
 */
export function useOfferBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'BeaconUpgraded'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"CollectionOfferAccepted"`.
 */
export function useOfferCollectionOfferAcceptedEvent(
  config: Omit<
    UseContractEventConfig<typeof offerABI, 'CollectionOfferAccepted'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'CollectionOfferAccepted',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'CollectionOfferAccepted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"CollectionOfferCancelled"`.
 */
export function useOfferCollectionOfferCancelledEvent(
  config: Omit<
    UseContractEventConfig<typeof offerABI, 'CollectionOfferCancelled'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'CollectionOfferCancelled',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'CollectionOfferCancelled'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"CollectionOfferMade"`.
 */
export function useOfferCollectionOfferMadeEvent(
  config: Omit<
    UseContractEventConfig<typeof offerABI, 'CollectionOfferMade'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'CollectionOfferMade',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'CollectionOfferMade'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"CollectionOfferUpdated"`.
 */
export function useOfferCollectionOfferUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof offerABI, 'CollectionOfferUpdated'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'CollectionOfferUpdated',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'CollectionOfferUpdated'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"OfferAccepted"`.
 */
export function useOfferOfferAcceptedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'OfferAccepted'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'OfferAccepted',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'OfferAccepted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"OfferCancelled"`.
 */
export function useOfferOfferCancelledEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'OfferCancelled'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'OfferCancelled',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'OfferCancelled'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"OfferMade"`.
 */
export function useOfferOfferMadeEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'OfferMade'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'OfferMade',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'OfferMade'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"OfferRejected"`.
 */
export function useOfferOfferRejectedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'OfferRejected'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'OfferRejected',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'OfferRejected'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"OfferUpdated"`.
 */
export function useOfferOfferUpdatedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'OfferUpdated'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'OfferUpdated',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'OfferUpdated'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useOfferRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof offerABI, 'RoleAdminChanged'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'RoleAdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useOfferRoleGrantedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'RoleGranted'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'RoleGranted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useOfferRoleRevokedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'RoleRevoked'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'RoleRevoked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link offerABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useOfferUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof offerABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: offerABI,
    address: offerAddress,
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof offerABI, 'Upgraded'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__.
 */
export function usePortRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any) {
  return useContractRead({ abi: portABI, address: portAddress, ...config } as UseContractReadConfig<
    typeof portABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function usePortDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"activeListing"`.
 */
export function usePortActiveListing<
  TFunctionName extends 'activeListing',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'activeListing',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"calculateRoyalty"`.
 */
export function usePortCalculateRoyalty<
  TFunctionName extends 'calculateRoyalty',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'calculateRoyalty',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelledListing"`.
 */
export function usePortCancelledListing<
  TFunctionName extends 'cancelledListing',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelledListing',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"completeListing"`.
 */
export function usePortCompleteListing<
  TFunctionName extends 'completeListing',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'completeListing',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"fee"`.
 */
export function usePortFee<
  TFunctionName extends 'fee',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'fee',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function usePortGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"getRoyalty"`.
 */
export function usePortGetRoyalty<
  TFunctionName extends 'getRoyalty',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'getRoyalty',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"getStandardNFTRoyalty"`.
 */
export function usePortGetStandardNftRoyalty<
  TFunctionName extends 'getStandardNFTRoyalty',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'getStandardNFTRoyalty',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"hasRole"`.
 */
export function usePortHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"isBundleContract"`.
 */
export function usePortIsBundleContract<
  TFunctionName extends 'isBundleContract',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'isBundleContract',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"isFM"`.
 */
export function usePortIsFm<
  TFunctionName extends 'isFM',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'isFM',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"isMember"`.
 */
export function usePortIsMember<
  TFunctionName extends 'isMember',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'isMember',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"isRoyaltyStandard"`.
 */
export function usePortIsRoyaltyStandard<
  TFunctionName extends 'isRoyaltyStandard',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'isRoyaltyStandard',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"isVIP"`.
 */
export function usePortIsVip<
  TFunctionName extends 'isVIP',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'isVIP',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"memberFee"`.
 */
export function usePortMemberFee<
  TFunctionName extends 'memberFee',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'memberFee',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"membershipStaker"`.
 */
export function usePortMembershipStaker<
  TFunctionName extends 'membershipStaker',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'membershipStaker',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"payments"`.
 */
export function usePortPayments<
  TFunctionName extends 'payments',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'payments',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"pool"`.
 */
export function usePortPool<
  TFunctionName extends 'pool',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'pool',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"priceLookup"`.
 */
export function usePortPriceLookup<
  TFunctionName extends 'priceLookup',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'priceLookup',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"proxiableUUID"`.
 */
export function usePortProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"regFee"`.
 */
export function usePortRegFee<
  TFunctionName extends 'regFee',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'regFee',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"royalties"`.
 */
export function usePortRoyalties<
  TFunctionName extends 'royalties',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'royalties',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"serverRole"`.
 */
export function usePortServerRole<
  TFunctionName extends 'serverRole',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'serverRole',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"sigRole"`.
 */
export function usePortSigRole<
  TFunctionName extends 'sigRole',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'sigRole',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"staffRole"`.
 */
export function usePortStaffRole<
  TFunctionName extends 'staffRole',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'staffRole',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function usePortSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"upgraderRole"`.
 */
export function usePortUpgraderRole<
  TFunctionName extends 'upgraderRole',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'upgraderRole',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"useEscrow"`.
 */
export function usePortUseEscrow<
  TFunctionName extends 'useEscrow',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'useEscrow',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"vipFee"`.
 */
export function usePortVipFee<
  TFunctionName extends 'vipFee',
  TSelectData = ReadContractResult<typeof portABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portABI,
    address: portAddress,
    functionName: 'vipFee',
    ...config,
  } as UseContractReadConfig<typeof portABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__.
 */
export function usePortWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof portABI, string>['request']['abi'], TFunctionName, TMode>
    : UseContractWriteConfig<typeof portABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof portABI, TFunctionName, TMode>({
    abi: portABI,
    address: portAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"addToEscrow"`.
 */
export function usePortAddToEscrow<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'addToEscrow'>['request']['abi'],
        'addToEscrow',
        TMode
      > & { functionName?: 'addToEscrow' }
    : UseContractWriteConfig<typeof portABI, 'addToEscrow', TMode> & {
        abi?: never;
        functionName?: 'addToEscrow';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'addToEscrow', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'addToEscrow',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"bulkTransfer"`.
 */
export function usePortBulkTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'bulkTransfer'>['request']['abi'],
        'bulkTransfer',
        TMode
      > & { functionName?: 'bulkTransfer' }
    : UseContractWriteConfig<typeof portABI, 'bulkTransfer', TMode> & {
        abi?: never;
        functionName?: 'bulkTransfer';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'bulkTransfer', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'bulkTransfer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelActive"`.
 */
export function usePortCancelActive<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'cancelActive'>['request']['abi'],
        'cancelActive',
        TMode
      > & { functionName?: 'cancelActive' }
    : UseContractWriteConfig<typeof portABI, 'cancelActive', TMode> & {
        abi?: never;
        functionName?: 'cancelActive';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'cancelActive', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelActive',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelListing"`.
 */
export function usePortCancelListing<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'cancelListing'>['request']['abi'],
        'cancelListing',
        TMode
      > & { functionName?: 'cancelListing' }
    : UseContractWriteConfig<typeof portABI, 'cancelListing', TMode> & {
        abi?: never;
        functionName?: 'cancelListing';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'cancelListing', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelListing',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelListings"`.
 */
export function usePortCancelListings<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'cancelListings'>['request']['abi'],
        'cancelListings',
        TMode
      > & { functionName?: 'cancelListings' }
    : UseContractWriteConfig<typeof portABI, 'cancelListings', TMode> & {
        abi?: never;
        functionName?: 'cancelListings';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'cancelListings', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelListings',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"executeTradesServer"`.
 */
export function usePortExecuteTradesServer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'executeTradesServer'>['request']['abi'],
        'executeTradesServer',
        TMode
      > & { functionName?: 'executeTradesServer' }
    : UseContractWriteConfig<typeof portABI, 'executeTradesServer', TMode> & {
        abi?: never;
        functionName?: 'executeTradesServer';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'executeTradesServer', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'executeTradesServer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePortGrantRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'grantRole'>['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof portABI, 'grantRole', TMode> & {
        abi?: never;
        functionName?: 'grantRole';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'grantRole', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'grantRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"initialize"`.
 */
export function usePortInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof portABI, 'initialize', TMode> & {
        abi?: never;
        functionName?: 'initialize';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'initialize', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'initialize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeLegacyPurchase"`.
 */
export function usePortMakeLegacyPurchase<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'makeLegacyPurchase'>['request']['abi'],
        'makeLegacyPurchase',
        TMode
      > & { functionName?: 'makeLegacyPurchase' }
    : UseContractWriteConfig<typeof portABI, 'makeLegacyPurchase', TMode> & {
        abi?: never;
        functionName?: 'makeLegacyPurchase';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'makeLegacyPurchase', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'makeLegacyPurchase',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListing"`.
 */
export function usePortMakeListing<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'makeListing'>['request']['abi'],
        'makeListing',
        TMode
      > & { functionName?: 'makeListing' }
    : UseContractWriteConfig<typeof portABI, 'makeListing', TMode> & {
        abi?: never;
        functionName?: 'makeListing';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'makeListing', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListing',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListingServer"`.
 */
export function usePortMakeListingServer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'makeListingServer'>['request']['abi'],
        'makeListingServer',
        TMode
      > & { functionName?: 'makeListingServer' }
    : UseContractWriteConfig<typeof portABI, 'makeListingServer', TMode> & {
        abi?: never;
        functionName?: 'makeListingServer';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'makeListingServer', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListingServer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListings"`.
 */
export function usePortMakeListings<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'makeListings'>['request']['abi'],
        'makeListings',
        TMode
      > & { functionName?: 'makeListings' }
    : UseContractWriteConfig<typeof portABI, 'makeListings', TMode> & {
        abi?: never;
        functionName?: 'makeListings';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'makeListings', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListings',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"payRoyalty"`.
 */
export function usePortPayRoyalty<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'payRoyalty'>['request']['abi'],
        'payRoyalty',
        TMode
      > & { functionName?: 'payRoyalty' }
    : UseContractWriteConfig<typeof portABI, 'payRoyalty', TMode> & {
        abi?: never;
        functionName?: 'payRoyalty';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'payRoyalty', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'payRoyalty',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"payRoyaltyServer"`.
 */
export function usePortPayRoyaltyServer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'payRoyaltyServer'>['request']['abi'],
        'payRoyaltyServer',
        TMode
      > & { functionName?: 'payRoyaltyServer' }
    : UseContractWriteConfig<typeof portABI, 'payRoyaltyServer', TMode> & {
        abi?: never;
        functionName?: 'payRoyaltyServer';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'payRoyaltyServer', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'payRoyaltyServer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"registerRoyalty"`.
 */
export function usePortRegisterRoyalty<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'registerRoyalty'>['request']['abi'],
        'registerRoyalty',
        TMode
      > & { functionName?: 'registerRoyalty' }
    : UseContractWriteConfig<typeof portABI, 'registerRoyalty', TMode> & {
        abi?: never;
        functionName?: 'registerRoyalty';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'registerRoyalty', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'registerRoyalty',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"registerRoyaltyAsOwner"`.
 */
export function usePortRegisterRoyaltyAsOwner<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'registerRoyaltyAsOwner'>['request']['abi'],
        'registerRoyaltyAsOwner',
        TMode
      > & { functionName?: 'registerRoyaltyAsOwner' }
    : UseContractWriteConfig<typeof portABI, 'registerRoyaltyAsOwner', TMode> & {
        abi?: never;
        functionName?: 'registerRoyaltyAsOwner';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'registerRoyaltyAsOwner', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'registerRoyaltyAsOwner',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"removeRoyalty"`.
 */
export function usePortRemoveRoyalty<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'removeRoyalty'>['request']['abi'],
        'removeRoyalty',
        TMode
      > & { functionName?: 'removeRoyalty' }
    : UseContractWriteConfig<typeof portABI, 'removeRoyalty', TMode> & {
        abi?: never;
        functionName?: 'removeRoyalty';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'removeRoyalty', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'removeRoyalty',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePortRenounceRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'renounceRole'>['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof portABI, 'renounceRole', TMode> & {
        abi?: never;
        functionName?: 'renounceRole';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'renounceRole', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'renounceRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePortRevokeRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'revokeRole'>['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof portABI, 'revokeRole', TMode> & {
        abi?: never;
        functionName?: 'revokeRole';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'revokeRole', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'revokeRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setMembershipStaker"`.
 */
export function usePortSetMembershipStaker<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'setMembershipStaker'>['request']['abi'],
        'setMembershipStaker',
        TMode
      > & { functionName?: 'setMembershipStaker' }
    : UseContractWriteConfig<typeof portABI, 'setMembershipStaker', TMode> & {
        abi?: never;
        functionName?: 'setMembershipStaker';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'setMembershipStaker', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'setMembershipStaker',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setPool"`.
 */
export function usePortSetPool<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'setPool'>['request']['abi'],
        'setPool',
        TMode
      > & { functionName?: 'setPool' }
    : UseContractWriteConfig<typeof portABI, 'setPool', TMode> & {
        abi?: never;
        functionName?: 'setPool';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'setPool', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'setPool',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setRyoshi"`.
 */
export function usePortSetRyoshi<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'setRyoshi'>['request']['abi'],
        'setRyoshi',
        TMode
      > & { functionName?: 'setRyoshi' }
    : UseContractWriteConfig<typeof portABI, 'setRyoshi', TMode> & {
        abi?: never;
        functionName?: 'setRyoshi';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'setRyoshi', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'setRyoshi',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setUseEscrow"`.
 */
export function usePortSetUseEscrow<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'setUseEscrow'>['request']['abi'],
        'setUseEscrow',
        TMode
      > & { functionName?: 'setUseEscrow' }
    : UseContractWriteConfig<typeof portABI, 'setUseEscrow', TMode> & {
        abi?: never;
        functionName?: 'setUseEscrow';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'setUseEscrow', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'setUseEscrow',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"transferBulkServer"`.
 */
export function usePortTransferBulkServer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'transferBulkServer'>['request']['abi'],
        'transferBulkServer',
        TMode
      > & { functionName?: 'transferBulkServer' }
    : UseContractWriteConfig<typeof portABI, 'transferBulkServer', TMode> & {
        abi?: never;
        functionName?: 'transferBulkServer';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'transferBulkServer', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'transferBulkServer',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"transferToken"`.
 */
export function usePortTransferToken<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'transferToken'>['request']['abi'],
        'transferToken',
        TMode
      > & { functionName?: 'transferToken' }
    : UseContractWriteConfig<typeof portABI, 'transferToken', TMode> & {
        abi?: never;
        functionName?: 'transferToken';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'transferToken', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'transferToken',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"updateFees"`.
 */
export function usePortUpdateFees<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'updateFees'>['request']['abi'],
        'updateFees',
        TMode
      > & { functionName?: 'updateFees' }
    : UseContractWriteConfig<typeof portABI, 'updateFees', TMode> & {
        abi?: never;
        functionName?: 'updateFees';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'updateFees', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'updateFees',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePortUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof portABI, 'upgradeTo', TMode> & {
        abi?: never;
        functionName?: 'upgradeTo';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'upgradeTo', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'upgradeTo',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePortUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof portABI, 'upgradeToAndCall', TMode> & {
        abi?: never;
        functionName?: 'upgradeToAndCall';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'upgradeToAndCall', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePortWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'withdraw'>['request']['abi'],
        'withdraw',
        TMode
      > & { functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof portABI, 'withdraw', TMode> & {
        abi?: never;
        functionName?: 'withdraw';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'withdraw', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'withdraw',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"withdrawPayments"`.
 */
export function usePortWithdrawPayments<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portABI, 'withdrawPayments'>['request']['abi'],
        'withdrawPayments',
        TMode
      > & { functionName?: 'withdrawPayments' }
    : UseContractWriteConfig<typeof portABI, 'withdrawPayments', TMode> & {
        abi?: never;
        functionName?: 'withdrawPayments';
      } = {} as any,
) {
  return useContractWrite<typeof portABI, 'withdrawPayments', TMode>({
    abi: portABI,
    address: portAddress,
    functionName: 'withdrawPayments',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__.
 */
export function usePreparePortWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof portABI, TFunctionName>, 'abi' | 'address'> = {} as any,
) {
  return usePrepareContractWrite({ abi: portABI, address: portAddress, ...config } as UsePrepareContractWriteConfig<
    typeof portABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"addToEscrow"`.
 */
export function usePreparePortAddToEscrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'addToEscrow'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'addToEscrow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'addToEscrow'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"bulkTransfer"`.
 */
export function usePreparePortBulkTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'bulkTransfer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'bulkTransfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'bulkTransfer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelActive"`.
 */
export function usePreparePortCancelActive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'cancelActive'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelActive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'cancelActive'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelListing"`.
 */
export function usePreparePortCancelListing(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'cancelListing'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelListing',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'cancelListing'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"cancelListings"`.
 */
export function usePreparePortCancelListings(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'cancelListings'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'cancelListings',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'cancelListings'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"executeTradesServer"`.
 */
export function usePreparePortExecuteTradesServer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'executeTradesServer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'executeTradesServer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'executeTradesServer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePreparePortGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'grantRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"initialize"`.
 */
export function usePreparePortInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'initialize'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeLegacyPurchase"`.
 */
export function usePreparePortMakeLegacyPurchase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'makeLegacyPurchase'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'makeLegacyPurchase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'makeLegacyPurchase'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListing"`.
 */
export function usePreparePortMakeListing(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'makeListing'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListing',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'makeListing'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListingServer"`.
 */
export function usePreparePortMakeListingServer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'makeListingServer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListingServer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'makeListingServer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"makeListings"`.
 */
export function usePreparePortMakeListings(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'makeListings'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'makeListings',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'makeListings'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"payRoyalty"`.
 */
export function usePreparePortPayRoyalty(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'payRoyalty'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'payRoyalty',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'payRoyalty'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"payRoyaltyServer"`.
 */
export function usePreparePortPayRoyaltyServer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'payRoyaltyServer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'payRoyaltyServer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'payRoyaltyServer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"registerRoyalty"`.
 */
export function usePreparePortRegisterRoyalty(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'registerRoyalty'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'registerRoyalty',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'registerRoyalty'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"registerRoyaltyAsOwner"`.
 */
export function usePreparePortRegisterRoyaltyAsOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'registerRoyaltyAsOwner'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'registerRoyaltyAsOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'registerRoyaltyAsOwner'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"removeRoyalty"`.
 */
export function usePreparePortRemoveRoyalty(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'removeRoyalty'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'removeRoyalty',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'removeRoyalty'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePreparePortRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'renounceRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePreparePortRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'revokeRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setMembershipStaker"`.
 */
export function usePreparePortSetMembershipStaker(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'setMembershipStaker'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'setMembershipStaker',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'setMembershipStaker'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setPool"`.
 */
export function usePreparePortSetPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'setPool'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'setPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'setPool'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setRyoshi"`.
 */
export function usePreparePortSetRyoshi(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'setRyoshi'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'setRyoshi',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'setRyoshi'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"setUseEscrow"`.
 */
export function usePreparePortSetUseEscrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'setUseEscrow'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'setUseEscrow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'setUseEscrow'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"transferBulkServer"`.
 */
export function usePreparePortTransferBulkServer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'transferBulkServer'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'transferBulkServer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'transferBulkServer'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"transferToken"`.
 */
export function usePreparePortTransferToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'transferToken'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'transferToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'transferToken'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"updateFees"`.
 */
export function usePreparePortUpdateFees(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'updateFees'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'updateFees',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'updateFees'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePreparePortUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'upgradeTo'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePreparePortUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'upgradeToAndCall'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePreparePortWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'withdraw'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portABI}__ and `functionName` set to `"withdrawPayments"`.
 */
export function usePreparePortWithdrawPayments(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portABI, 'withdrawPayments'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portABI,
    address: portAddress,
    functionName: 'withdrawPayments',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portABI, 'withdrawPayments'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__.
 */
export function usePortEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof portABI, TEventName>, 'abi' | 'address'> = {} as any,
) {
  return useContractEvent({ abi: portABI, address: portAddress, ...config } as UseContractEventConfig<
    typeof portABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"AdminChanged"`.
 */
export function usePortAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'AdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"AdminWithdraw"`.
 */
export function usePortAdminWithdrawEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'AdminWithdraw'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'AdminWithdraw',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'AdminWithdraw'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"BeaconUpgraded"`.
 */
export function usePortBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'BeaconUpgraded'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"Cancelled"`.
 */
export function usePortCancelledEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'Cancelled'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'Cancelled',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'Cancelled'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"EscrowChanged"`.
 */
export function usePortEscrowChangedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'EscrowChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'EscrowChanged',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'EscrowChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"FeesUpdate"`.
 */
export function usePortFeesUpdateEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'FeesUpdate'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'FeesUpdate',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'FeesUpdate'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"Initialized"`.
 */
export function usePortInitializedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'Initialized'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'Initialized'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"Listed"`.
 */
export function usePortListedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'Listed'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'Listed',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'Listed'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function usePortRoleAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoleAdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoleAdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function usePortRoleGrantedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoleGranted'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoleGranted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function usePortRoleRevokedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoleRevoked'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoleRevoked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoyaltyChanged"`.
 */
export function usePortRoyaltyChangedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoyaltyChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoyaltyChanged',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoyaltyChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoyaltyPaid"`.
 */
export function usePortRoyaltyPaidEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoyaltyPaid'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoyaltyPaid',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoyaltyPaid'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"RoyaltyRemoved"`.
 */
export function usePortRoyaltyRemovedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'RoyaltyRemoved'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'RoyaltyRemoved',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'RoyaltyRemoved'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"Sold"`.
 */
export function usePortSoldEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'Sold'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'Sold',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'Sold'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"StakerUpdated"`.
 */
export function usePortStakerUpdatedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'StakerUpdated'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'StakerUpdated',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'StakerUpdated'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link portABI}__ and `eventName` set to `"Upgraded"`.
 */
export function usePortUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof portABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: portABI,
    address: portAddress,
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof portABI, 'Upgraded'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__.
 */
export function useShipRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any) {
  return useContractRead({ abi: shipABI, address: shipAddress, ...config } as UseContractReadConfig<
    typeof shipABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useShipDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"_hashApproval"`.
 */
export function useShipHashApproval<
  TFunctionName extends '_hashApproval',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: '_hashApproval',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"_hashOrder"`.
 */
export function useShipHashOrder<
  TFunctionName extends '_hashOrder',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: '_hashOrder',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"domainSeparator"`.
 */
export function useShipDomainSeparator<
  TFunctionName extends 'domainSeparator',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'domainSeparator',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"executed"`.
 */
export function useShipExecuted<
  TFunctionName extends 'executed',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'executed',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useShipGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"hasRole"`.
 */
export function useShipHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"portContract"`.
 */
export function useShipPortContract<
  TFunctionName extends 'portContract',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'portContract',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"proxiableUUID"`.
 */
export function useShipProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"stakerAddress"`.
 */
export function useShipStakerAddress<
  TFunctionName extends 'stakerAddress',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'stakerAddress',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useShipSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof shipABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: shipABI,
    address: shipAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof shipABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__.
 */
export function useShipWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof shipABI, string>['request']['abi'], TFunctionName, TMode>
    : UseContractWriteConfig<typeof shipABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, TFunctionName, TMode>({
    abi: shipABI,
    address: shipAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"cancelOrders"`.
 */
export function useShipCancelOrders<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'cancelOrders'>['request']['abi'],
        'cancelOrders',
        TMode
      > & { functionName?: 'cancelOrders' }
    : UseContractWriteConfig<typeof shipABI, 'cancelOrders', TMode> & {
        abi?: never;
        functionName?: 'cancelOrders';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'cancelOrders', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'cancelOrders',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"fillOrders"`.
 */
export function useShipFillOrders<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'fillOrders'>['request']['abi'],
        'fillOrders',
        TMode
      > & { functionName?: 'fillOrders' }
    : UseContractWriteConfig<typeof shipABI, 'fillOrders', TMode> & {
        abi?: never;
        functionName?: 'fillOrders';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'fillOrders', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'fillOrders',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"grantRole"`.
 */
export function useShipGrantRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'grantRole'>['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof shipABI, 'grantRole', TMode> & {
        abi?: never;
        functionName?: 'grantRole';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'grantRole', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'grantRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"initialize"`.
 */
export function useShipInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof shipABI, 'initialize', TMode> & {
        abi?: never;
        functionName?: 'initialize';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'initialize', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'initialize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useShipRenounceRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'renounceRole'>['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof shipABI, 'renounceRole', TMode> & {
        abi?: never;
        functionName?: 'renounceRole';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'renounceRole', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'renounceRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useShipRevokeRole<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'revokeRole'>['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof shipABI, 'revokeRole', TMode> & {
        abi?: never;
        functionName?: 'revokeRole';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'revokeRole', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'revokeRole',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useShipUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof shipABI, 'upgradeTo', TMode> & {
        abi?: never;
        functionName?: 'upgradeTo';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'upgradeTo', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'upgradeTo',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useShipUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof shipABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof shipABI, 'upgradeToAndCall', TMode> & {
        abi?: never;
        functionName?: 'upgradeToAndCall';
      } = {} as any,
) {
  return useContractWrite<typeof shipABI, 'upgradeToAndCall', TMode>({
    abi: shipABI,
    address: shipAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__.
 */
export function usePrepareShipWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof shipABI, TFunctionName>, 'abi' | 'address'> = {} as any,
) {
  return usePrepareContractWrite({ abi: shipABI, address: shipAddress, ...config } as UsePrepareContractWriteConfig<
    typeof shipABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"cancelOrders"`.
 */
export function usePrepareShipCancelOrders(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'cancelOrders'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'cancelOrders',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'cancelOrders'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"fillOrders"`.
 */
export function usePrepareShipFillOrders(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'fillOrders'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'fillOrders',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'fillOrders'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareShipGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'grantRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareShipInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'initialize'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareShipRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'renounceRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareShipRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'revokeRole'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareShipUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'upgradeTo'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link shipABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareShipUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof shipABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: shipABI,
    address: shipAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof shipABI, 'upgradeToAndCall'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__.
 */
export function useShipEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof shipABI, TEventName>, 'abi' | 'address'> = {} as any,
) {
  return useContractEvent({ abi: shipABI, address: shipAddress, ...config } as UseContractEventConfig<
    typeof shipABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"AdminChanged"`.
 */
export function useShipAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'AdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"BeaconUpgraded"`.
 */
export function useShipBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'BeaconUpgraded'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"Initialized"`.
 */
export function useShipInitializedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'Initialized'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'Initialized'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"OrderCancelled"`.
 */
export function useShipOrderCancelledEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'OrderCancelled'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'OrderCancelled',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'OrderCancelled'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"OrderFilled"`.
 */
export function useShipOrderFilledEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'OrderFilled'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'OrderFilled',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'OrderFilled'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useShipRoleAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'RoleAdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'RoleAdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useShipRoleGrantedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'RoleGranted'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'RoleGranted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useShipRoleRevokedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'RoleRevoked'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'RoleRevoked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"RoyaltyPaid"`.
 */
export function useShipRoyaltyPaidEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'RoyaltyPaid'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'RoyaltyPaid',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'RoyaltyPaid'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link shipABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useShipUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof shipABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: shipABI,
    address: shipAddress,
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof shipABI, 'Upgraded'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__.
 */
export function useStakeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any) {
  return useContractRead({ abi: stakeABI, address: stakeAddress, ...config } as UseContractReadConfig<
    typeof stakeABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"amountRyoshiStaked"`.
 */
export function useStakeAmountRyoshiStaked<
  TFunctionName extends 'amountRyoshiStaked',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'amountRyoshiStaked',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"amountStaked"`.
 */
export function useStakeAmountStaked<
  TFunctionName extends 'amountStaked',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'amountStaked',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"completedPool"`.
 */
export function useStakeCompletedPool<
  TFunctionName extends 'completedPool',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'completedPool',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"curPool"`.
 */
export function useStakeCurPool<
  TFunctionName extends 'curPool',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'curPool',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"currentPoolId"`.
 */
export function useStakeCurrentPoolId<
  TFunctionName extends 'currentPoolId',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'currentPoolId',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"currentStaked"`.
 */
export function useStakeCurrentStaked<
  TFunctionName extends 'currentStaked',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'currentStaked',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"epochLength"`.
 */
export function useStakeEpochLength<
  TFunctionName extends 'epochLength',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'epochLength',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"getReleasedReward"`.
 */
export function useStakeGetReleasedReward<
  TFunctionName extends 'getReleasedReward',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'getReleasedReward',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"getReward"`.
 */
export function useStakeGetReward<
  TFunctionName extends 'getReward',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'getReward',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"name"`.
 */
export function useStakeName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"owner"`.
 */
export function useStakeOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"periodEnd"`.
 */
export function useStakePeriodEnd<
  TFunctionName extends 'periodEnd',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'periodEnd',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"poolBalance"`.
 */
export function useStakePoolBalance<
  TFunctionName extends 'poolBalance',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'poolBalance',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"pools"`.
 */
export function useStakePools<
  TFunctionName extends 'pools',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'pools',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"rewardsId"`.
 */
export function useStakeRewardsId<
  TFunctionName extends 'rewardsId',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'rewardsId',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"rewardsPaid"`.
 */
export function useStakeRewardsPaid<
  TFunctionName extends 'rewardsPaid',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'rewardsPaid',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"stakedRyoshi"`.
 */
export function useStakeStakedRyoshi<
  TFunctionName extends 'stakedRyoshi',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'stakedRyoshi',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useStakeSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"totalStaked"`.
 */
export function useStakeTotalStaked<
  TFunctionName extends 'totalStaked',
  TSelectData = ReadContractResult<typeof stakeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'totalStaked',
    ...config,
  } as UseContractReadConfig<typeof stakeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__.
 */
export function useStakeWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof stakeABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, TFunctionName, TMode>({
    abi: stakeABI,
    address: stakeAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"endInitPeriod"`.
 */
export function useStakeEndInitPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'endInitPeriod'>['request']['abi'],
        'endInitPeriod',
        TMode
      > & { functionName?: 'endInitPeriod' }
    : UseContractWriteConfig<typeof stakeABI, 'endInitPeriod', TMode> & {
        abi?: never;
        functionName?: 'endInitPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'endInitPeriod', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'endInitPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"harvest"`.
 */
export function useStakeHarvest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'harvest'>['request']['abi'],
        'harvest',
        TMode
      > & { functionName?: 'harvest' }
    : UseContractWriteConfig<typeof stakeABI, 'harvest', TMode> & {
        abi?: never;
        functionName?: 'harvest';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'harvest', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'harvest',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"initialize"`.
 */
export function useStakeInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof stakeABI, 'initialize', TMode> & {
        abi?: never;
        functionName?: 'initialize';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'initialize', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'initialize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 */
export function useStakeOnErc1155BatchReceived<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'onERC1155BatchReceived'>['request']['abi'],
        'onERC1155BatchReceived',
        TMode
      > & { functionName?: 'onERC1155BatchReceived' }
    : UseContractWriteConfig<typeof stakeABI, 'onERC1155BatchReceived', TMode> & {
        abi?: never;
        functionName?: 'onERC1155BatchReceived';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'onERC1155BatchReceived', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"onERC1155Received"`.
 */
export function useStakeOnErc1155Received<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'onERC1155Received'>['request']['abi'],
        'onERC1155Received',
        TMode
      > & { functionName?: 'onERC1155Received' }
    : UseContractWriteConfig<typeof stakeABI, 'onERC1155Received', TMode> & {
        abi?: never;
        functionName?: 'onERC1155Received';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'onERC1155Received', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'onERC1155Received',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useStakeRenounceOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof stakeABI, 'renounceOwnership', TMode> & {
        abi?: never;
        functionName?: 'renounceOwnership';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'renounceOwnership', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'renounceOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"setEpochLength"`.
 */
export function useStakeSetEpochLength<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'setEpochLength'>['request']['abi'],
        'setEpochLength',
        TMode
      > & { functionName?: 'setEpochLength' }
    : UseContractWriteConfig<typeof stakeABI, 'setEpochLength', TMode> & {
        abi?: never;
        functionName?: 'setEpochLength';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'setEpochLength', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'setEpochLength',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"setRyoshiVIP"`.
 */
export function useStakeSetRyoshiVip<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'setRyoshiVIP'>['request']['abi'],
        'setRyoshiVIP',
        TMode
      > & { functionName?: 'setRyoshiVIP' }
    : UseContractWriteConfig<typeof stakeABI, 'setRyoshiVIP', TMode> & {
        abi?: never;
        functionName?: 'setRyoshiVIP';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'setRyoshiVIP', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'setRyoshiVIP',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"stake"`.
 */
export function useStakeStake<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof stakeABI, 'stake'>['request']['abi'], 'stake', TMode> & {
        functionName?: 'stake';
      }
    : UseContractWriteConfig<typeof stakeABI, 'stake', TMode> & {
        abi?: never;
        functionName?: 'stake';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'stake', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'stake',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"stakeRyoshi"`.
 */
export function useStakeStakeRyoshi<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'stakeRyoshi'>['request']['abi'],
        'stakeRyoshi',
        TMode
      > & { functionName?: 'stakeRyoshi' }
    : UseContractWriteConfig<typeof stakeABI, 'stakeRyoshi', TMode> & {
        abi?: never;
        functionName?: 'stakeRyoshi';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'stakeRyoshi', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'stakeRyoshi',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useStakeTransferOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof stakeABI, 'transferOwnership', TMode> & {
        abi?: never;
        functionName?: 'transferOwnership';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'transferOwnership', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'transferOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"unstake"`.
 */
export function useStakeUnstake<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'unstake'>['request']['abi'],
        'unstake',
        TMode
      > & { functionName?: 'unstake' }
    : UseContractWriteConfig<typeof stakeABI, 'unstake', TMode> & {
        abi?: never;
        functionName?: 'unstake';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'unstake', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'unstake',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"unstakeRyoshi"`.
 */
export function useStakeUnstakeRyoshi<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'unstakeRyoshi'>['request']['abi'],
        'unstakeRyoshi',
        TMode
      > & { functionName?: 'unstakeRyoshi' }
    : UseContractWriteConfig<typeof stakeABI, 'unstakeRyoshi', TMode> & {
        abi?: never;
        functionName?: 'unstakeRyoshi';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'unstakeRyoshi', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'unstakeRyoshi',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"updatePool"`.
 */
export function useStakeUpdatePool<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'updatePool'>['request']['abi'],
        'updatePool',
        TMode
      > & { functionName?: 'updatePool' }
    : UseContractWriteConfig<typeof stakeABI, 'updatePool', TMode> & {
        abi?: never;
        functionName?: 'updatePool';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'updatePool', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'updatePool',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useStakeUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof stakeABI, 'upgradeTo', TMode> & {
        abi?: never;
        functionName?: 'upgradeTo';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'upgradeTo', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'upgradeTo',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useStakeUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof stakeABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof stakeABI, 'upgradeToAndCall', TMode> & {
        abi?: never;
        functionName?: 'upgradeToAndCall';
      } = {} as any,
) {
  return useContractWrite<typeof stakeABI, 'upgradeToAndCall', TMode>({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__.
 */
export function usePrepareStakeWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof stakeABI, TFunctionName>, 'abi' | 'address'> = {} as any,
) {
  return usePrepareContractWrite({ abi: stakeABI, address: stakeAddress, ...config } as UsePrepareContractWriteConfig<
    typeof stakeABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"endInitPeriod"`.
 */
export function usePrepareStakeEndInitPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'endInitPeriod'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'endInitPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'endInitPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"harvest"`.
 */
export function usePrepareStakeHarvest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'harvest'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'harvest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'harvest'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareStakeInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'initialize'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 */
export function usePrepareStakeOnErc1155BatchReceived(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'onERC1155BatchReceived'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'onERC1155BatchReceived'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"onERC1155Received"`.
 */
export function usePrepareStakeOnErc1155Received(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'onERC1155Received'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'onERC1155Received',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'onERC1155Received'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareStakeRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'renounceOwnership'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"setEpochLength"`.
 */
export function usePrepareStakeSetEpochLength(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'setEpochLength'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'setEpochLength',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'setEpochLength'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"setRyoshiVIP"`.
 */
export function usePrepareStakeSetRyoshiVip(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'setRyoshiVIP'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'setRyoshiVIP',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'setRyoshiVIP'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"stake"`.
 */
export function usePrepareStakeStake(
  config: Omit<UsePrepareContractWriteConfig<typeof stakeABI, 'stake'>, 'abi' | 'address' | 'functionName'> = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'stake',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'stake'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"stakeRyoshi"`.
 */
export function usePrepareStakeStakeRyoshi(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'stakeRyoshi'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'stakeRyoshi',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'stakeRyoshi'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareStakeTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'transferOwnership'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"unstake"`.
 */
export function usePrepareStakeUnstake(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'unstake'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'unstake',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'unstake'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"unstakeRyoshi"`.
 */
export function usePrepareStakeUnstakeRyoshi(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'unstakeRyoshi'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'unstakeRyoshi',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'unstakeRyoshi'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"updatePool"`.
 */
export function usePrepareStakeUpdatePool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'updatePool'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'updatePool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'updatePool'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareStakeUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'upgradeTo'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link stakeABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareStakeUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof stakeABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: stakeABI,
    address: stakeAddress,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof stakeABI, 'upgradeToAndCall'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__.
 */
export function useStakeEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof stakeABI, TEventName>, 'abi' | 'address'> = {} as any,
) {
  return useContractEvent({ abi: stakeABI, address: stakeAddress, ...config } as UseContractEventConfig<
    typeof stakeABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"AdminChanged"`.
 */
export function useStakeAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'AdminChanged'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"BeaconUpgraded"`.
 */
export function useStakeBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'BeaconUpgraded'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"Harvest"`.
 */
export function useStakeHarvestEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'Harvest'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'Harvest',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'Harvest'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"MembershipStaked"`.
 */
export function useStakeMembershipStakedEvent(
  config: Omit<
    UseContractEventConfig<typeof stakeABI, 'MembershipStaked'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'MembershipStaked',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'MembershipStaked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"MembershipUnstaked"`.
 */
export function useStakeMembershipUnstakedEvent(
  config: Omit<
    UseContractEventConfig<typeof stakeABI, 'MembershipUnstaked'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'MembershipUnstaked',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'MembershipUnstaked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useStakeOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof stakeABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'OwnershipTransferred'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"RyoshiStaked"`.
 */
export function useStakeRyoshiStakedEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'RyoshiStaked'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'RyoshiStaked',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'RyoshiStaked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"RyoshiUnstaked"`.
 */
export function useStakeRyoshiUnstakedEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'RyoshiUnstaked'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'RyoshiUnstaked',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'RyoshiUnstaked'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link stakeABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useStakeUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof stakeABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> = {} as any,
) {
  return useContractEvent({
    abi: stakeABI,
    address: stakeAddress,
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof stakeABI, 'Upgraded'>);
}

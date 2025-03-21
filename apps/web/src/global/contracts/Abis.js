export const ERC721 = [
  'function balanceOf(address owner) public view returns (uint256)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function approve(address to, uint256 tokenId) public',
  'function getApproved(uint256 tokenId) public view returns (address)',
  'function setApprovalForAll(address operator, bool approved) public',
  'function safeTransferFrom(address from, address to, uint256 tokenId) public',
  'function isApprovedForAll(address account, address operator) public view returns (bool)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
  'function totalSupply() public view returns (uint256)',
  'function tokenByIndex(uint256 index) public view returns (uint256)',
  'function walletOfOwner(address owner) public view returns (uint256[] memory)',
  'function stakedApes(uint256 tokenId) public view returns (bool staked)', // Weird Apes Club v2 ONLY
];

export const ERC1155 = [
  'function uri(uint256) public view returns (string memory)',
  'function balanceOf(address account, uint256 id) public view returns (uint256)',
  'function setApprovalForAll(address operator, bool approved) public',
  'function isApprovedForAll(address account, address operator) public view returns (bool)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data) public',
];

export const ERC20 = [
  'function approve(address, uint256) public',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address owner) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
];
export const ERC2981 = [
  'function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)',
];

export const ERC165 = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const Elon = ['function mint(uint256 count) public payable'];

export const EbisuDropAbi = [
  'function mintCost(address _minter) external view returns (uint256)',
  'function canMint(address _minter) external view returns (uint256)',
  'function mint(uint256 _amount) external payable',
  'function maxSupply() external view returns (uint256)',
  'function getInfo() view returns (tuple(uint256 regularCost,uint256 memberCost,uint256 whitelistCost,uint256 maxSupply,uint256 totalSupply,uint256 maxMintPerAddress,uint256 maxMintPerTx))',
  'function mintWithToken(uint256 _amount) external payable'
];

export const SouthSideAntsReadAbi = [...ERC721, 'function getNftByUser(address) public view returns (uint256[])'];

export const RewardsPoolAbi = [
  'event ERC20PaymentReleased(address indexed token, address to, uint256 amount)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'event PayeeAdded(address account, uint256 shares)',
  'event PaymentReceived(address from, uint256 amount)',
  'event PaymentReleased(address to, uint256 amount)',
  'function addReward() payable',
  'function curState() view returns (uint8)',
  'function endTime() view returns (uint256)',
  'function finalBalance() view returns (uint256)',
  'function forwardUnclaimed(address nextPool)',
  'function isClosed() returns (bool)',
  'function owner() view returns (address)',
  'function payee(uint256 index) view returns (address)',
  'function release(address account)',
  'function released(address account) view returns (uint256)',
  'function renounceOwnership()',
  'function shares(address account) view returns (uint256)',
  'function totalReceived() view returns (uint256)',
  'function totalReleased(address token) view returns (uint256)',
  'function totalReleased() view returns (uint256)',
  'function totalShares() view returns (uint256)',
  'function transferOwnership(address newOwner)',
  'function updateState()',
];

export const MetaPixelsAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'uint16', name: '_xmin', internalType: 'uint16' },
      { type: 'uint16', name: '_xmax', internalType: 'uint16' },
      { type: 'uint16', name: '_ymin', internalType: 'uint16' },
      { type: 'uint16', name: '_ymax', internalType: 'uint16' },
      { type: 'uint256', name: '_landCost', internalType: 'uint256' },
      { type: 'uint256', name: '_requestCost', internalType: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address', indexed: true },
      { type: 'address', name: 'approved', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ApprovalForAll',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address', indexed: true },
      { type: 'address', name: 'operator', internalType: 'address', indexed: true },
      { type: 'bool', name: 'approved', internalType: 'bool', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NewLandRequested',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'id', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'cost', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NewRequestCreated',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'index', internalType: 'uint256', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
      { type: 'address', name: 'newOwner', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoverERC20',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecoverEth',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RequestApproved',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'landId', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'requestIndex', internalType: 'uint256', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RequestRejected',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'landId', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'requestIndex', internalType: 'uint256', indexed: true },
      { type: 'string', name: 'reason', internalType: 'string', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address', indexed: true },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint16', name: '', internalType: 'uint16' }],
    name: 'XMAX',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint16', name: '', internalType: 'uint16' }],
    name: 'XMIN',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint16', name: '', internalType: 'uint16' }],
    name: 'YMAX',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint16', name: '', internalType: 'uint16' }],
    name: 'YMIN',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'approve',
    inputs: [
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'approveRequest',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address' },
      { type: 'uint256', name: 'index', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'balanceOf',
    inputs: [{ type: 'address', name: 'owner', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'blocksCovered',
    inputs: [
      { type: 'uint16', name: '', internalType: 'uint16' },
      { type: 'uint16', name: '', internalType: 'uint16' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'payable',
    outputs: [],
    name: 'buyLand',
    inputs: [
      { type: 'uint16', name: '_xmin', internalType: 'uint16' },
      { type: 'uint16', name: '_xmax', internalType: 'uint16' },
      { type: 'uint16', name: '_ymin', internalType: 'uint16' },
      { type: 'uint16', name: '_ymax', internalType: 'uint16' },
      { type: 'string', name: '_link', internalType: 'string' },
      { type: 'string', name: '_detail', internalType: 'string' },
      { type: 'string', name: '_image', internalType: 'string' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'getApproved',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'getLandBlockCount',
    inputs: [{ type: 'uint256', name: 'landId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'isApprovedForAll',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'address', name: 'operator', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'landCost',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint16', name: 'xmin', internalType: 'uint16' },
      { type: 'uint16', name: 'xmax', internalType: 'uint16' },
      { type: 'uint16', name: 'ymin', internalType: 'uint16' },
      { type: 'uint16', name: 'ymax', internalType: 'uint16' },
      { type: 'uint256', name: 'created', internalType: 'uint256' },
      { type: 'string', name: 'link', internalType: 'string' },
      { type: 'string', name: 'detail', internalType: 'string' },
      { type: 'string', name: 'image', internalType: 'string' },
    ],
    name: 'lands',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'name',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'ownerOf',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'recoverERC20',
    inputs: [
      { type: 'address', name: 'tokenAddress', internalType: 'address' },
      { type: 'uint256', name: 'tokenAmount', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'recoverEth',
    inputs: [{ type: 'uint256', name: 'amount', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'rejectRequest',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address' },
      { type: 'uint256', name: 'index', internalType: 'uint256' },
      { type: 'string', name: 'reason', internalType: 'string' },
    ],
  },
  { type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'renounceOwnership', inputs: [] },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'requestCost',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'created', internalType: 'uint256' },
      { type: 'uint256', name: 'updated', internalType: 'uint256' },
      { type: 'uint8', name: 'status', internalType: 'enum MetaPixelsNFTFactory.RequestStatus' },
      { type: 'uint256', name: 'landId', internalType: 'uint256' },
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'string', name: 'link', internalType: 'string' },
      { type: 'string', name: 'detail', internalType: 'string' },
      { type: 'string', name: 'image', internalType: 'string' },
      { type: 'string', name: 'reason', internalType: 'string' },
      { type: 'bool', name: 'exists', internalType: 'bool' },
    ],
    name: 'requestsByUser',
    inputs: [
      { type: 'address', name: '', internalType: 'address' },
      { type: 'uint256', name: '', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'requestsByUserLength',
    inputs: [{ type: 'address', name: 'user', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
      { type: 'bytes', name: '_data', internalType: 'bytes' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setApprovalForAll',
    inputs: [
      { type: 'address', name: 'operator', internalType: 'address' },
      { type: 'bool', name: 'approved', internalType: 'bool' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setLandCost',
    inputs: [{ type: 'uint256', name: 'newCost', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setRequestCost',
    inputs: [{ type: 'uint256', name: 'newCost', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'payable',
    outputs: [],
    name: 'submitRequest',
    inputs: [
      { type: 'string', name: '_link', internalType: 'string' },
      { type: 'string', name: '_detail', internalType: 'string' },
      { type: 'string', name: '_image', internalType: 'string' },
      { type: 'uint256', name: 'landId', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'supportsInterface',
    inputs: [{ type: 'bytes4', name: 'interfaceId', internalType: 'bytes4' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'symbol',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'tokenByIndex',
    inputs: [{ type: 'uint256', name: 'index', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'uint256', name: 'index', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'tokenURI',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'totalSupply',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }],
  },
];

class WalletNft {
  attributes: any[];
  collectionName: string;
  burnt: boolean;
  description: string;
  edition: number;
  image: string;
  type: '721' | '1155';
  // @deprecated: use type instead
  is1155: boolean;
  lastSale: any;
  market: any;
  name: string;
  nftAddress: string;
  nftId: string;
  offer: any;
  originalImage: string;
  owner: string;
  rank: number;
  tokenUri: string | any;

  // Others that might show up
  nfts?: any[] = [];
  balance?: number = 1;
  animationUrl?: string;
  imageAws?: string;
  properties?: any[];

  isStaked?: boolean = false;
  canTransfer?: boolean = true;
  canSell?: boolean = true;
  listable?: boolean = false;
  listed?: boolean = false;
  listingId?: string;
  chain: string;
  hidden?: boolean = false;

  constructor(props: WalletNft) {
    this.attributes = props.attributes;
    this.collectionName = props.collectionName;
    this.burnt = props.burnt;
    this.description = props.description;
    this.edition = props.edition;
    this.image = props.image;
    this.type = props.type;
    this.is1155 = props.is1155;
    this.lastSale = props.lastSale;
    this.market = props.market;
    this.name = props.name;
    this.nftAddress = props.nftAddress;
    this.nftId = props.nftId;
    this.offer = props.offer;
    this.originalImage = props.originalImage;
    this.owner = props.owner;
    this.rank = props.rank;
    this.tokenUri = props.tokenUri;
    this.chain = props.chain;
  }

  static fromMapi(props: any) {
    const nft = new WalletNft({
      attributes: props.attributes,
      collectionName: props.collectionName,
      burnt: props.burnt,
      description: props.description,
      edition: props.edition,
      image: props.image,
      type: props.is1155 ? '1155' : '721',
      is1155: props.is1155,
      lastSale: props.lastSale,
      market: props.market,
      name: props.name,
      nftAddress: props.nftAddress,
      nftId: props.nftId,
      offer: props.offer,
      originalImage: props.originalImage,
      owner: props.owner,
      rank: props.rank,
      tokenUri: props.token_uri,
      chain: props.chain
    });

    if (!!props.nfts) nft.nfts = props.nfts;
    if (!!props.balance) nft.balance = Number(props.balance);
    if (!!props.animation_url) nft.animationUrl = props.animation_url;
    if (!!props.hidden) nft.hidden = props.hidden;

    return nft;
  }
}

export default WalletNft;
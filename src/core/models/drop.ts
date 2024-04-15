import {isEmptyObj} from "@market/helpers/utils";

export interface Drop {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  author: DropAuthor;
  address: string;
  maxMintPerTx: number;
  maxMintPerAddress: number;
  totalSupply: number;
  cost: number;
  memberCost?: number;
  whitelistCost?: number;
  start: number;
  end?: number;
  published: boolean;
  complete: boolean;
  images: DropImages;
  verification: DropVerification;
  escrow?: DropEscrow;
  abi?: string | string[];
  erc20Token?: string;
  erc20Address?: string;
  erc20Cost?: number;
  erc20MemberCost?: number;
  erc20WhitelistCost?: number;
  priceDescription?: string;
  embed?: string;
  mediaPosition?: string;
  specialWhitelistCost?: SpecialWhitelist;
  video?: string;
  freeMint?: boolean;
  redirect?: string;
  erc20Only: boolean;
  memberMitama: number;
  collection?: string;
  [key: string]: any;
}

export interface DropAuthor {
  name: string;
  website?: string;
  twitter?: string;
  discord?: string;
  medium?: string;
}

export interface DropImages {
  drop: string;
  banner: string;
  avatar: string;
  preview: string;
}

export interface DropVerification {
  doxx: boolean;
  kyc: boolean;
  escrow: boolean;
  verified: boolean;
  creativeCommons?: boolean;
}

export interface DropEscrow {
  description?: string;
  milestones: string[];
}

export interface SpecialWhitelist {
  name: string;
  value: number;
}

export function mapDrop(drop: any): Drop {
  const obj: Drop = {
    id: drop.id,
    slug: drop.slug,
    title: drop.title,
    subtitle: drop.subtitle,
    description: drop.description,
    author: drop.author,
    address: drop.address,
    maxMintPerTx: drop.maxMintPerTx,
    maxMintPerAddress: drop.maxMintPerAddress,
    totalSupply: drop.totalSupply,
    cost: Number(drop.cost),
    start: drop.start,
    end: drop.end,
    published: drop.published,
    complete: drop.complete,
    images: drop.images,
    verification: drop.verification,
    escrow: drop.escrow,
    abi: drop.abi,
    embed: drop.embed,
    mediaPosition: drop.mediaPosition,
    erc20Token: drop.erc20Token,
    erc20Address: drop.erc20Address,
    priceDescription: drop.priceDescription,
    specialWhitelistCost: drop.specialWhitelistCost,
    video: drop.video,
    freeMint: drop.freeMint ?? false,
    featured: drop.featured,
    redirect: drop.redirect,
    erc20Only: drop.erc20Only ?? false,
    memberMitama: drop.memberMitama ?? 0,
    collection: drop.collection,
    supplyOffset: drop.supplyOffset ?? 0
  }

  if (!!drop.memberCost) obj.memberCost = Number(drop.memberCost);
  if (!!drop.whitelistCost) obj.whitelistCost = Number(drop.whitelistCost);
  if (!!drop.erc20Cost) obj.erc20Cost = Number(drop.erc20Cost);
  if (!!drop.erc20MemberCost) obj.erc20MemberCost = Number(drop.erc20MemberCost);
  if (!!drop.erc20WhitelistCost) obj.erc20WhitelistCost = Number(drop.erc20WhitelistCost);
  if (!!drop.rewardCost) obj.rewardCost = Number(drop.rewardCost);

  if (!!drop.salePeriods) {
    obj.salePeriods = {};
    Object.entries(drop.salePeriods).forEach(([key, value]) => {
      obj.salePeriods[key] = value;
    });
  }

  return <Drop>Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
    return v !== undefined && !isEmptyObj(v)
  }));
}
export interface AdPlacement {
  name: string;
  start: number;
  end: number;
  placement: 'rd-board' | 'drops';
  details: RdAdDetails | DropsAdDetails;
}

export interface RdAdDetails {
  weight: number;
  imageLg: string;
  imageSm: string;
  link: AdLink;
}

export interface DropsAdDetails {
  weight: number;
  date: number;
  cost?: number;
  memberCost?: number;
  whitelistCost?: number;
  erc20Token?: string;
  erc20Cost?: number;
  erc20MemberCost?: number;
  erc20WhitelistCost?: number;
  featured: boolean;
  complete: boolean;
  link: AdLink;
  author: string;
  images: {
    drop: string;
    avatar: string;
    preview: string;
  }
  socials: {
    website: string;
    twitter: string;
    discord: string;
  }
  verification: {
    verified: boolean;
    doxx: boolean;
    kyc: boolean;
  }
}

interface AdLink {
  url: string;
  external: boolean;
}
import type { WindowProvider } from 'wagmi/window'

export interface ExtendEthereum extends WindowProvider {
  isSafePal?: true
  isCoin98?: true
  isBlocto?: true
  isMathWallet?: true
  isTrustWallet?: true
  isBlocto?: true
  isBinance?: true
  isCoinbaseWallet?: true
  isTrust?: true
  isTokenPocket?: true
  isMetaMask?: true
  providers?: ExtendEthereum[]
  isOpera?: true
  isBraveWallet?: true
  isRabby?: true
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    logBadgeClick?: any;
    s247r?: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'statusiq-status-widget': {
        src: string;
      };
    }
  }
}

// Exporting something to ensure this file is still treated as a module
export {};

import {ExtendEthereum} from "@root/types/extend-ethereum";



declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    logBadgeClick?: any;
    s247r?: any;
    ethereum?: ExtendEthereum
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
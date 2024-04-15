declare module '@pinata/ipfs-gateway-tools/dist/node'
declare module 'native-forms-react';
declare module '@cronosid/croidjs';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    logBadgeClick?: any;
    s247r?: any
  }
  namespace JSX {
    interface IntrinsicElements {
      'statusiq-status-widget': {
        src: string
      };
    }
  }
}

export {};
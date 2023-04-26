import React from "react";

export {};

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    }
    namespace JSX {
        interface IntrinsicElements {
            'statusiq-status-widget': {
                src: string
            };
        }
    }
}
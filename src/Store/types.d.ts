import React from "react";

export {};

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
import {createIcon} from "@chakra-ui/icons";

const CdcIcon = createIcon({
    displayName: 'CdcIcon',
    viewBox: '0 0 16 16',
    path: [
        <circle cx="8" cy="8" r="8" fill="#002D72"></circle>,
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.805 4.51v6.98L8 15l6.195-3.51V4.51L8 1 1.805 4.51Zm.53 6.72V4.813L8 1.607l5.665 3.207v6.372L8 14.393 2.336 11.23Z" fill="white"></path>,
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.435 4.031H5.567l-.575 2.427h6.019l-.576-2.427ZM6.413 9.803V8.199l-1.416-.91-1.638 1.214 2.213 3.77h.885l1.062-.953v-.477l-1.106-1.04Z" fill="white"></path>,
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.595 6.852H6.453l.531 1.343-.177 1.517h2.39l-.133-1.517.531-1.343Z" fill="white"></path>,
        <path fill-rule="evenodd" clip-rule="evenodd" d="m11.015 7.29-1.416.91v1.603l-1.107 1.04v.477l1.062.954h.885l2.213-3.771-1.637-1.214Z" fill="white"></path>,
    ]
});

export default CdcIcon;

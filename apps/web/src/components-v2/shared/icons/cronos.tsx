import {createIcon, IconProps} from "@chakra-ui/icons";

const CronosIcon = createIcon({
    displayName: 'CronosIconFlat',
    viewBox: '0 0 121 139',
    path: [
        <path fill='currentColor'
              d="M60.093,0,0,34.7123V104.114l60.093,34.689,60.047-34.689V34.7123Zm42.256,93.83L60.093,118.236,17.814,93.83V44.9725L60.093,20.5668l42.256,24.4057Z"/>,
        <path fill='currentColor'
              d="M60.0932,138.803,120.14,104.114V34.7123L60.0932,0V20.59L102.349,44.9958V93.8536L60.0932,118.236Z"/>,
        <path fill='currentColor'
              d="M60.0465,0,0,34.6891V104.091l60.0465,34.712v-20.59L17.7907,93.8071V44.9492L60.0465,20.5668Z"/>,
        <path fill='currentColor'
              d="M88.1163,85.6176,60.07,101.811,32,85.6176V53.2086L60.07,36.9924,88.1163,53.2086l-11.6744,6.747L60.07,50.4865,43.6977,59.9556V78.8473L60.07,88.3165l16.3721-9.4692Z"/>,
    ]
});

const CronosIconFlat = (params: IconProps) => {
    return <CronosIcon {...params} />
}

export default CronosIconFlat;

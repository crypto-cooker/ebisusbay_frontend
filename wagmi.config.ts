import { defineConfig } from '@wagmi/cli'
import {blockExplorer, react} from '@wagmi/cli/plugins'
import * as process from "process";

export default defineConfig({
    out: 'src/global/contracts/types.ts',
    contracts: [],
    plugins: [
        blockExplorer({
            apiKey: process.env.CRONOSCAN_API_KEY,
            baseUrl: 'https://api.cronoscan.com/api',
            contracts: [
                {
                    name: 'ship',
                    address: '0xdd987d82fbbfad9c85ae46268f1a1bb9c2ef7f4a', // proxy
                },
                {
                    name: 'port',
                    address: '0x8b5eb1fee264dc0be38a42d36c5e4d25f4f40e4f', // proxy
                },
                {
                    name: 'stake',
                    address: '0x36b95208bdb6d4048b4e581e174c1726e49ae1f4', // proxy
                },
                {
                    name: 'offer',
                    address: '0x2bbcd54ac79e20974e02b07db0f7e6c0aea49305', // proxy
                },
                {
                    name: 'bundle',
                    address: '0x40874F18922267cc2Ca7933828594aB5078C1065',
                },
            ],
        }),
        react(),
    ]
});

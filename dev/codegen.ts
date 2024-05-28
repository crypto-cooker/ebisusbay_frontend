import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/ryoshi-dynasties',
    'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/ryoshi-presale',
    'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/staked-owners',
    'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/farms-v2',
  ],
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './src/core/services/api-service/graph/types.ts': {
      plugins: ['typescript']
    }
  }
};

export default config;
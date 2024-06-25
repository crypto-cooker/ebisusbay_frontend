import {ChainId} from "@dex/swap/constants/chainId";
import {ERC20Token} from "@pancakeswap/swap-sdk-evm";

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.CRONOS]: new ERC20Token(
    ChainId.CRONOS,
    '0xe44Fd7fCb2b1581822D0c862B68222998a0c299a',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.CRONOS_TESTNET]: new ERC20Token(
    ChainId.CRONOS_TESTNET,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'WETH',
    'Wrapped Ether',
    'https://ethereum.org',
  )
}

export const WCRO = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
    18,
    'WCRO',
    'Wrapped CRO',
    'https://www.crypto.org',
  ),
  [ChainId.CRONOS]: new ERC20Token(
    ChainId.CRONOS,
    '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    18,
    'WCRO',
    'Wrapped CRO',
    'https://www.crypto.org',
  ),
  [ChainId.CRONOS_TESTNET]: new ERC20Token(
    ChainId.CRONOS_TESTNET,
    '0x467604E174c87042fcc4412c5BC70AaBc8733016',
    18,
    'WCRO',
    'Wrapped CRO',
    'https://www.crypto.org',
  )
}

export const WNATIVE = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.CRONOS]: WCRO[ChainId.CRONOS],
  [ChainId.CRONOS_TESTNET]: WCRO[ChainId.CRONOS_TESTNET],
} satisfies Record<ChainId, ERC20Token>
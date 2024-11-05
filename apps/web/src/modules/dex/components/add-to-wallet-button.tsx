import { Address } from 'viem'
import { watchAsset } from '@wagmi/core'
import { useAccount, useWalletClient } from 'wagmi'
import {Button, ButtonProps} from "@chakra-ui/react";
import {wagmiConfig} from "@src/wagmi";
import MetamaskIcon from "@src/components-v2/shared/icons/metamask";
import TrustWalletIcon from "@src/components-v2/shared/icons/trust-wallet";
import BinanceChainIcon from "@src/components-v2/shared/icons/binance-chain";
import CoinbaseWalletIcon from "@src/components-v2/shared/icons/coinbase-wallet";
import OperaIcon from "@src/components-v2/shared/icons/opera";
import TokenPocketIcon from "@src/components-v2/shared/icons/token-pocket";

export enum AddToWalletTextOptions {
  NO_TEXT,
  TEXT,
  TEXT_WITH_ASSET,
}

export interface AddToWalletButtonProps {
  tokenAddress?: string
  tokenSymbol?: string
  tokenDecimals?: number
  tokenLogo?: string
  textOptions?: AddToWalletTextOptions
  marginTextBetweenLogo?: string
}

const Icons = {
  // TODO: Brave
  Binance: BinanceChainIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Opera: OperaIcon,
  TokenPocket: TokenPocketIcon,
  'Trust Wallet': TrustWalletIcon,
  MetaMask: MetamaskIcon,
}
type IconName = keyof typeof Icons;

const getWalletText = (textOptions: AddToWalletTextOptions, tokenSymbol: string | undefined) => {
  return (
    textOptions !== AddToWalletTextOptions.NO_TEXT &&
    (textOptions === AddToWalletTextOptions.TEXT
      ? 'Add to Wallet'
      : `Add ${tokenSymbol} to Wallet`)
  )
}

const getWalletIcon = (marginTextBetweenLogo: string, name?: string) => {
  const iconProps = {
    width: '16px',
    ...(marginTextBetweenLogo && { ml: marginTextBetweenLogo }),
  }
  if (name && (name as IconName) in Icons) {
    const Icon = Icons[name as IconName];
    return <Icon {...iconProps} />
  }
  if (window?.ethereum?.isTrust) {
    return <TrustWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isCoinbaseWallet) {
    return <CoinbaseWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isTokenPocket) {
    return <TokenPocketIcon {...iconProps} />
  }
  if (window?.ethereum?.isMetaMask) {
    return <MetamaskIcon {...iconProps} />
  }
  return <MetamaskIcon {...iconProps} />
}

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  // @ts-ignore
  !window?.ethereum?.isSafePal &&
  (window?.ethereum?.isMetaMask ||
    window?.ethereum?.isTrust ||
    window?.ethereum?.isCoinbaseWallet ||
    window?.ethereum?.isTokenPocket)

const AddToWalletButton: React.FC<AddToWalletButtonProps & ButtonProps> = ({
 tokenAddress,
 tokenSymbol,
 tokenDecimals,
 tokenLogo,
 textOptions = AddToWalletTextOptions.NO_TEXT,
 marginTextBetweenLogo = '0px',
 ...props
}) => {
  const { connector, isConnected } = useAccount()
  // const { data: walletClient } = useWalletClient()
  const isCanRegisterToken = canRegisterToken()
  // if (!walletClient) return null
  if (connector && connector.name === 'Binance') return null
  if (!(connector && isConnected)) return null
  if (!isCanRegisterToken) return null

  return (
    <Button
      {...props}
      onClick={async () => {
        const image = tokenLogo ?? undefined
        if (!tokenAddress || !tokenSymbol || !tokenDecimals) return
        try {
          await watchAsset(wagmiConfig, {
            // TODO: Add more types
            type: 'ERC20',
            options: {
              address: tokenAddress as Address,
              symbol: tokenSymbol,
              image,
              decimals: tokenDecimals,
            },
          })
        } catch (e) {
          // ignore tx rejected exceptions
        }
      }}
    >
      {getWalletText(textOptions, tokenSymbol)}
      {getWalletIcon(marginTextBetweenLogo, connector?.name)}
    </Button>
  )
}

export default AddToWalletButton

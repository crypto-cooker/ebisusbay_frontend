import React, {ReactNode, useMemo} from "react";
import {Tag, Wrap} from "@chakra-ui/react";
import {ethers} from "ethers";
import {round} from "@src/utils";

interface VaultNftProps {
  nft: {attributes?: any[]}
  children: ReactNode;
}

const VaultNft = ({nft, children}: VaultNftProps) => {
  const amount = ethers.utils.formatEther(nft.attributes?.find((a: any) => a.trait_type === 'Amount')?.value ?? 0);
  const depositLength = nft.attributes?.find((a: any) => a.trait_type === 'Deposit Length')?.value ?? 0;

  const timeRemaining = useMemo(() => {
    if (!nft.attributes) return 0;
    const endTime = nft.attributes.find((attribute: any) => attribute.trait_type === 'End Time')?.value ?? 0;

    const timeRemaining = (parseInt(endTime) - (Date.now() / 1000));
    return Math.floor(timeRemaining / 86400);
  }, [nft.attributes]);

  return (
    <>
      {children}
      <Wrap mx={1}>
        <Tag variant='solid' colorScheme='blue' size='sm'>
          {round(amount)} FRTN
        </Tag>
        <Tag variant='solid' colorScheme='blue' size='sm'>
          {depositLength / 86400} day stake
        </Tag>
        <Tag variant='solid' colorScheme='blue' size='sm'>
          {timeRemaining} days left
        </Tag>
      </Wrap>
    </>
  )
}

export default VaultNft;
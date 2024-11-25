import { useEffect, useState } from "react"
import { getMirrorNFT } from "../utils/getMirrorNFT";
import { useActiveChainId } from "./useActiveChainId";

const useMirrorNFT = (currencyId:string | undefined) => {

  const [mirrorNFT, setMirrorNFT] = useState<string | undefined>(undefined);
  const [isExist, setIsExist] = useState<boolean>(false);
  const chainId = useActiveChainId();

  useEffect(() => {
    console.log(currencyId, chainId, "HHHHHHHHHHHHHHHHHHHHHHHH");
    const main = async() => {
      const nft = await getMirrorNFT(currencyId, chainId.chainId);
      setMirrorNFT(nft);
    }
    main();
  },[currencyId, chainId])

  return mirrorNFT;
}

export default useMirrorNFT
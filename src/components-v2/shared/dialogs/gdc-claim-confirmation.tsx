import React, {useState} from 'react';
import {Contract, ContractReceipt, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import {getTheme} from "@src/Theme/theme";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import {appConfig} from "@src/Config";
import Market from "@src/Contracts/Marketplace.json";
import {useAppSelector} from "@src/Store/hooks";
import GdcClaimSuccess from "@src/components-v2/shared/dialogs/gdc-claim-success";
import axios from "axios";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import Cms from "@src/core/services/api-service/cms";
import {parseUnits} from "ethers/lib/utils";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

type GdcClaimConfirmationProps = {
  onClose: () => void;
  isOpen: boolean;
};

export default function GdcClaimConfirmation({ onClose, isOpen}: GdcClaimConfirmationProps) {
  const [executingClaim, setExecutingClaim] = useState(false);

  const user = useAppSelector((state) => state.user);
  const [isLoadingSigner, getSigner] = useCreateSigner();

  const [isComplete, setIsComplete] = useState(false);
  const [tx, setTx] = useState<ContractReceipt>();

  const handleExecuteClaim = async () => {
    try {
      setExecutingClaim(true);
      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        const service = new Cms();
        const serverSig = await service.getGdcClaimSignature((user.profile as any).email, user.address!, signatureInStorage);

        console.log('serfasdf', serverSig)
        const gasPrice = parseUnits('5000', 'gwei');
        const gasEstimate = await user.contractService!.gdc.mint((user.profile as any).email, serverSig.data);
        const gasLimit = gasEstimate.mul(2);
        let extra = {
          gasPrice,
          gasLimit
        };
        const tx = await user.contractService!.gdc.mint((user.profile as any).email, serverSig.data, extra);
        const receipt = await tx.wait();
        setTx(receipt);
      }
      setIsComplete(true);
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingClaim(false);
    }
  };

  return isComplete && !!tx ? (
    <GdcClaimSuccess onClose={onClose} isOpen={isOpen} tx={tx} />
  ) : (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Claim GDC Proof-Of-Attendance NFT
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        <ModalBody>
          Claim it please
        </ModalBody>
        <ModalFooter className="border-0">
          <div className="w-100">
            {executingClaim && (
              <div className="mb-2 text-center fst-italic">
                <small>Please check your wallet for confirmation</small>
              </div>
            )}
            <div className="d-flex">
              <Button type="legacy"
                      onClick={handleExecuteClaim}
                      isLoading={executingClaim}
                      disabled={executingClaim}
                      className="flex-fill">
                Confirm claim
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
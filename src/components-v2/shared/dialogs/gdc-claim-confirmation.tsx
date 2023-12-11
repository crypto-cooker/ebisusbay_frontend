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
import Cms from "@src/core/services/api-service/cms";
import {parseErrorMessage} from "@src/helpers/validator";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useContractService, useUser} from "@src/components-v2/useUser";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

type GdcClaimConfirmationProps = {
  onClose: () => void;
  isOpen: boolean;
};

export default function GdcClaimConfirmation({ onClose, isOpen}: GdcClaimConfirmationProps) {
  const [executingClaim, setExecutingClaim] = useState(false);

  const user = useUser();
  const contractService = useContractService();
  const {requestSignature} = useEnforceSignature();

  const [isComplete, setIsComplete] = useState(false);
  const [tx, setTx] = useState<ContractReceipt>();

  const handleExecuteClaim = async () => {
    try {
      const signature = await requestSignature();
      const service = new Cms();
      const serverSig = await service.getGdcClaimSignature((user.profile as any).email, user.address!, signature);

      const tx = await contractService!.gdc.mint((user.profile as any).email, serverSig.data);
      const receipt = await tx.wait();
      setTx(receipt);
      setIsComplete(true);
    } catch (error: any) {
      toast.error(parseErrorMessage(error));
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
        <ModalBody textAlign='center'>
          Thank you for participating in our GDC demo! Click the button below to claim your free NFT
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
import {Box} from "@chakra-ui/react";
import React, {useState} from "react";
import {Step1ChooseItems} from "@src/components-v2/feature/swap/step-1-choose-items";
import {SwapPreview} from "@src/components-v2/feature/swap/swap-preview";
import {Step2ChooseItems} from "@src/components-v2/feature/swap/step-2-offer-items";
import {useUser} from "@src/components-v2/useUser";
import {ciEquals} from "@src/utils";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {DefaultContainer} from "@src/components-v2/shared/default-container";

const sidebarWidth = '400px';

interface UserSwapViewProps {
  address: string;
}

export const UserSwapView = ({address}: UserSwapViewProps) => {
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(1);

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  }

  return (
    <>
      <DefaultContainer>
        <Box minH='calc(100vh - 289px)'>
          {currentStep === 1 ? (
            <Step1ChooseItems address={address} />
          ) : (
            <>
              {!!user.address ? (
                <>
                  {ciEquals(address, user.address) ? (
                    <Box my={4} textAlign='center'>
                      Cannot swap with yourself. Try selecting another user or connecting a different wallet.
                    </Box>
                  ) : (
                    <Step2ChooseItems address={user.address} />
                  )}
                </>
              ) : (
                <Box my={8} textAlign='center'>
                  <PrimaryButton onClick={() => user.connect()}>
                    Connect wallet
                  </PrimaryButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </DefaultContainer>
      <SwapPreview
        onChangeStep={handleChangeStep}
      />
    </>
  )
}
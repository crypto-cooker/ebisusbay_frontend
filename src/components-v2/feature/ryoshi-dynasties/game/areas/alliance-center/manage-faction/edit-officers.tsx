import {Box, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, VStack} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import React, {useContext, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ciEquals, isAddress} from "@src/utils";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {ApiService} from "@src/core/services/api-service";

interface EditOfficersProps {
  faction: any;
}

const EditOfficers = ({faction}: EditOfficersProps) => {
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [newOfficers, setNewOfficers] = useState<string[]>(faction.officers.map((officer: any) => officer.profile.walletAddress));
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isExecuting, setIsExecuting] = useState(false);

  const maxOfficers = 2;

  function getOrdinal(n: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  const handleSave = async () => {
    try {
      setIsExecuting(true);

      setErrors({});

      // if (newOfficers.length < 1 || newOfficers.every((address: string) => !address)) {
      //   toast.error('At least 1 officer required to save');
      //   return;
      // }

      if (new Set(newOfficers).size !== newOfficers.length) {
        toast.error('All values must be unique');
        return;
      }

      for (const index in newOfficers) {
        const address = newOfficers[index];
        if (!!address && !isAddress(address)) {
          setErrors({...errors, [index]: 'Invalid address'});
        }
        if (ciEquals(address, user.address)) {
          setErrors({...errors, [index]: 'Cannot assign your own address'});
        }
      }

      if (Object.keys(errors).length > 0) {
        return;
      }

      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.updateFaction({
        id: faction.id,
        officers: newOfficers.filter((address: string) => !!address)
      }, user.address!, signature);
      toast.success('Success!')
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <RdModalBox>
      <VStack align='start' w='full' spacing={6}>
        {[...Array(maxOfficers).fill(0)].map((_, index) => (
          <Box w='full'>
            <FormControl isInvalid={!!errors[index]}>
              <FormLabel fontWeight='bold'>
                Officer {index + 1}:
              </FormLabel>
              <Box>
                <Input
                  placeholder='Wallet address'
                  value={newOfficers[index]}
                  onChange={(e) => {
                    const newOfficersCopy = [...newOfficers];
                    newOfficersCopy[index] = e.target.value;
                    setNewOfficers(newOfficersCopy);
                  }}
                />
              </Box>
              <FormHelperText>Wallet address for your {getOrdinal(index + 1)} officer</FormHelperText>
              <FormErrorMessage>{errors[index]}</FormErrorMessage>
            </FormControl>
          </Box>
        ))}
      </VStack>
      <Flex justify='end' mt={4}>
        <RdButton
          size='md'
          onClick={handleSave}
          isLoading={isExecuting}
          isDisabled={isExecuting}
        >
          Save Changes
        </RdButton>
      </Flex>
    </RdModalBox>
  )
}

export default EditOfficers;
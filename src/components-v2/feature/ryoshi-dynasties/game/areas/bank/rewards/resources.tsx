import React, {useState} from "react";
import {Contract} from "ethers";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Box, Flex, HStack, Image, Spacer, Stack, Text, VStack} from "@chakra-ui/react";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {appConfig} from "@src/Config";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import RdButton from "../../../../components/rd-button";
import {ApiService} from "@src/core/services/api-service";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import ImageService from "@src/core/services/image";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import Resources from "@src/Contracts/Resources.json";

const config = appConfig();

const ResourcesTab = () => {
  const user = useUser();
  const {requestSignature, signature} = useEnforceSigner();
  const queryClient = useQueryClient();

  const [isExecuting, setIsExecuting] = useState(false);

  const { data: balances, status, error, refetch } = useQuery({
    queryKey: ['UserResourcesBalances', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getResourcesBalances(user.address!, signature),
    enabled: !!user.address && !!signature,
  });

  const claim = async ({tokenId, amount}: {tokenId: number, amount: number}) => {
    if (!user.address) return;

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      const authorization = await ApiService.withoutKey().ryoshiDynasties.requestResourcesWithdrawalAuthorization(tokenId, amount, user.address, signature);
      const {signature: approvalSignature, approval} = authorization.data;

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(approval, approvalSignature);
      return await tx.wait();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: claim,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['UserResourcesBalances', user.address], (old: any) => {
          return [{
            tokenId: 1,
            amount: 0
          }]
        });
      } catch (e) {
        console.log(e);
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data.transactionHash));
      }
    }
  });


  const handleClaim = async (tokenId: number, amount: number) => {
    mutation.mutate({tokenId, amount});
  }

  return (
    <RdModalBox textAlign='center'>
      <AuthenticationRdButton
        connectText='Connect and sign in to claim your daily reward'
        signinText='Sign in to claim your daily reward'
      >
        <Box textAlign='center'>
          Koban rewards from daily claims will be deposited here. Other resources maybe added here in the future. By claiming these resources, they will be transferred to your wallet.
        </Box>
        {!!balances && balances.length > 0 && (
          <>
            {balances.filter((balance) => balance.tokenId === 1).map((balance: any) => (
              <Flex justify='space-between' mt={2} direction={{base: 'column', md: 'row'}}>
                <VStack align='start' spacing={0}>
                  <Text fontSize='xl' fontWeight='bold'>
                    Koban Balance
                  </Text>
                  <HStack>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                    <Text fontSize='lg' fontWeight='bold'>{balance.amount}</Text>
                  </HStack>

                </VStack>
                <Flex direction='column' mt={{base: 2, md: 0}}>
                  <Spacer />
                  <Stack direction={{base: 'column', sm: 'row'}}>
                    <RdButton
                      size='sm'
                      w='full'
                      onClick={() => handleClaim(balance.tokenId, balance.amount)}
                      isLoading={isExecuting}
                      loadingText='Claiming...'
                    >
                      Claim
                    </RdButton>
                  </Stack>
                  <Spacer />
                </Flex>
              </Flex>
            ))}
          </>
        )}
      </AuthenticationRdButton>
    </RdModalBox>
  )
}

export default ResourcesTab;
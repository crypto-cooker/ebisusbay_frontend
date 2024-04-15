import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {ChangeEvent, useState} from "react";
import {
  Box,
  Container, Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {CreateDeal} from "@src/components-v2/feature/deal/create";
import {useRouter} from "next/router";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {isAddress} from "@market/helpers/utils";
import {toast} from "react-toastify";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getCroidAddressFromName, isCroName} from "@market/helpers/croid";
import {parseErrorMessage} from "@src/helpers/validator";
import {RecentDeals} from "@src/components-v2/feature/deal/landing/recent-deals";
import ImageService from "@src/core/services/image";

const Deal = () => {
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleChangeSearchTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }
  
  const handleSearch = async () => {
    if (!searchTerms) {
      toast.error('Please enter a valid address or username');
      return;
    }

    try {
      setIsSearching(true);

      if (isAddress(searchTerms)) {
        await router.push(`/deal/create/${searchTerms}`, undefined, {shallow: true});
        return;
      }

      const profile = await getProfile(searchTerms);
      if (profile?.data) {
        await router.push(`/deal/create/${profile.data.username}`, undefined, {shallow: true});
        return;
      }

      if (isCroName(searchTerms)) {
        const croidAddress = await getCroidAddressFromName(searchTerms);
        if (croidAddress) {
          await router.push(`/deal/create/${croidAddress}`, undefined, {shallow: true});
          return;
        }
      }

      toast.error('User not found');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsSearching(false);
    }
  }

  const handleKeyDown = async (e: any) => {
    if (e.code === 'Enter') {
      await handleSearch();
    }
  }

  return (
    <>
      <PageHead
        title='Make a Deal'
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
        image={ImageService.translate('/img/background/deals.jpg').convert()}
      />
      <PageHeader title={'Create a Deal'} subtitle='Reveal unique value opportunities by swapping NFTs and tokens directly'/>
      {!!address ? (
        <CreateDeal address={address} />
      ) : (
        <Container mt={4} minH='calc(100vh - 174px)'  maxW='container.lg'>
          <VStack justify='center' mt={8}>
            <Box fontWeight='bold' fontSize={{base: 'md', sm: 'lg'}} textAlign='center'>
              Enter your friend's address, EB username, or Cronos ID to get started
            </Box>
            <FormControl maxW='container.sm'>
              <InputGroup>
                <Input
                  placeholder='Enter 0x, username, or Cronos ID'
                  onChange={handleChangeSearchTerms}
                  autoFocus={true}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement>
                  <IconButton
                    aria-label='search'
                    icon={<Icon as={FontAwesomeIcon} icon={faSearch} />}
                    onClick={handleSearch}
                    isLoading={isSearching}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Box mt={8} w='full'>
              <RecentDeals />
            </Box>
          </VStack>
        </Container>
      )}
    </>
  )
}

export default Deal;
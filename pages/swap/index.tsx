import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {ChangeEvent, useState} from "react";
import {FormControl, Icon, IconButton, Input, InputGroup, InputRightAddon, InputRightElement} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {UserSwapView} from "@src/components-v2/feature/swap/user";
import {useRouter} from "next/router";

const Swap = () => {
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState<string>();
  const [address, setAddress] = useState<string>();

  const handleChangeSearchTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }
  
  const handleSearch = () => {
    setAddress(searchTerms);
    router.push(`/swap/create/${searchTerms}`, undefined, { shallow: true });
  }
  
  return (
    <>
      <PageHeader title={'Create a Swap'} />
      {!!address ? (
        <UserSwapView address={address} />
      ) : (
        <>
          <FormControl>
            <InputGroup>
              <Input
                placeholder='Username or 0x'
                onChange={handleChangeSearchTerms}
              />
              <InputRightElement>
                <IconButton
                  aria-label='search'
                  icon={<Icon as={FontAwesomeIcon} icon={faSearch} />}
                  onClick={handleSearch}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </>
      )}
    </>
  )
}

export default Swap;
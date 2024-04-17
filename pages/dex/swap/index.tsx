import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Container, Flex, HStack, IconButton, Input, Stack, VStack, Wrap} from "@chakra-ui/react";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import {ArrowDownIcon} from "@chakra-ui/icons";
import Select from "react-select";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import PageHead from "@src/components-v2/shared/layout/page-head";
import ImageService from "@src/core/services/image";
import React from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import ReactSelect from "react-select";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import InputBox from "@dex/components/swap/input-box";
import {PrimaryButton} from "@src/components-v2/foundation/button";

export default function Page() {
  const {supportedTokens} = useSupportedTokens();




  return (
    <>
      <PageHead
        title='Ryoshi Swap'
        description='Trade tokens instantly with low fees'
      />
      <PageHeader
        title='Ryoshi Swap'
        subtitle='Trade tokens instantly with low fees'
      />
      <Container mt={4}>
        {/*<Card>*/}
          <Box textAlign='center' mb={4}>
            <Box fontSize='xl' fontWeight='bold'>Ryoshi Swap</Box>
            <Box>Trade tokens instantly with low fees</Box>
          </Box>
          <VStack w='full' align='stretch'>

            <InputBox availableTokens={supportedTokens} />
            <Wrap justify='center'>
              <Button>25%</Button>
              <Button>50%</Button>
              <Button>75%</Button>
              <Button>Max</Button>
            </Wrap>
            <Box textAlign='center'>
              <IconButton aria-label='Swap to' icon={<ArrowDownIcon />} w='40px' />
            </Box>
            <InputBox availableTokens={supportedTokens} />
            <PrimaryButton>
              Enter an amount
            </PrimaryButton>
          </VStack>
        {/*</Card>*/}
      </Container>
    </>
  )
}
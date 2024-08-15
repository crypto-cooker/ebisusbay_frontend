import PageHead from "@src/components-v2/shared/layout/page-head";
import React from "react";
import ImoPage from "@src/components-v2/feature/imo";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import {Box, useColorModeValue} from "@chakra-ui/react";

export default function Page() {
  const background = useColorModeValue('white', 'black');

  return (
    <Box bg={background} pb={6}>
      <PageHead
        title="Initial Meme Offering"
        description="Take part in the latest meme token offerings on Ebisu's Bay"
        url="/imo"
      />
      <PageHeader
        title='Initial Meme Offering'
        subtitle="Take part in the latest meme token offerings on Ebisu's Bay"
      />
      <ImoPage />
    </Box>
  )
}
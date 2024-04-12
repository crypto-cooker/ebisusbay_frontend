import {Box, Flex, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {DefaultContainer} from "@src/components-v2/shared/default-container";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: HeaderProps) => {
  const bgImage = useColorModeValue('/img/background/header-ryoshi.webp', '/img/background/header-ryoshi.webp');

  return (
    <Flex
      minH={{base:'100px', md:'150px'}}
      bg='black'
      position='relative'
      alignItems='center'
      justify='center'
    >
      <Box
        h='full'
        backgroundImage={`linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.75) 90%), url(${bgImage})`}
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        backgroundPosition='center'
        filter='brightness(0.8)'
        w="100%"
        position="absolute"
      />
      <DefaultContainer>
        <Flex
          position='relative'
          py={6}
          direction='column'
          h='full'
        >
          <Heading as='h1' size={{base: 'xl', sm: '2xl'}} color='white' textShadow='2px 2px 4px rgba(0, 0, 0, 0.5)'>{title}</Heading>
          {subtitle && (
            <Text fontWeight='bold' color='white' fontSize={{base: 'sm', sm: 'md'}}>{subtitle}</Text>
          )}
        </Flex>
      </DefaultContainer>
    </Flex>
  )
}

export default PageHeader;
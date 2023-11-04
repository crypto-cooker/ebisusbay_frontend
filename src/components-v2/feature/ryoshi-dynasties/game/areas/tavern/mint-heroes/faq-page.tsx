import React from "react";
import {Box, Heading, Text} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {

    return (
      <Box p={2}>
        <Box>
          <Heading size='md'>Hanzo</Heading>
          <Text>
              A skilled and elusive warrior known for his ability to strike swiftly and silently. Hanzo is a formidable force on the battlefield, capable of subduing his enemies with remarkable agility and precision.
          </Text>
          <Text mt={2}>
              Each “Hanzo” Guard will give 1 Common Hero
          </Text>
        </Box>
        <Box mt={4}>
          <Heading size='md'>Haruki</Heading>
          <Text>
            Haruki Yamamoto, also known as 'The Steam-Powered Sentry,' is a rare and formidable guardian with unmatched strength and mechanical prowess. Equipped with advanced steam-powered technology, Haruki stands as an imposing figure, protecting the realms from all threats.
          </Text>
          <Text mt={2}>
            Each “Haruki” Guard will give 1 Common, 1 Uncommon and 1 Rare Hero
          </Text>
        </Box>
        <Box mt={4}>
          <Heading size='md'>Takeshi</Heading>
          <Text>
            Takeshi Tanaka, also known as 'The Coin Crusher,' is an epic and formidable warrior with unparalleled strength and an unrelenting fighting style. Fueled by sheer determination, Takeshi crushes his opponents with a relentless onslaught of attacks, leaving no room for escape.
          </Text>
          <Text mt={2}>
            Each “Takeshi” will give 1 Common, 1 Uncommon and 1 Epic Hero and 1 Destiny Diamond
          </Text>
        </Box>
        <Box mt={4}>
          <Heading size='md'>Lord Bladestorm</Heading>
          <Text>
            Lord Bladestorm, known as 'The Unyielding,' is a legendary figure of unmatched prowess and power. With his mighty blade and unwavering determination, he leads his forces to victory in every battle. None can stand against his unstoppable might. This NFT represents the legendary hero, Lord Bladestorm the Unyielding.
          </Text>
          <Text mt={2}>
            Each “Bladestorm” will give 1 Mythic Hero and 1 Destiny Diamond
          </Text>
        </Box>
      </Box>
    );
}

export default FaqPage;
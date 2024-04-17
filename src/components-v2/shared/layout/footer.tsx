import React, {memo} from 'react';
import {faDiscord, faInstagram, faLinkedin, faMedium, faTelegram, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faSquare} from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import {Box, Center, Flex, Heading, Image, ListItem, SimpleGrid, UnorderedList} from "@chakra-ui/react";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";

const Footer = () => {
  const {theme: userTheme} = useUser();

  return (
    <Box as='footer'>
      <Box maxW='2560px' className='footer-light'>
        <Box px={4}>
          <Center>
            <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5}} gap={4}>
              <Box className="widget">
                <Image
                  h="40px"
                  src={ImageService.translate(userTheme === 'light' ? '/img/logo-light.svg' : '/img/logo-dark.svg').avatar()}
                  alt="ebisus bay logo"
                />
                <p className="mt-2">Ebisu's Bay is a dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance.</p>
                {/*<Box fontSize='sm' mt={2}>Version: {process.env.BUILD_VERSION}</Box>*/}
              </Box>
              <Box className="widget">
                <Heading as="h5" size="md">Marketplace</Heading>
                <UnorderedList>
                  <ListItem><Link href="/marketplace">Explore</Link></ListItem>
                  <ListItem><Link href="/collections">Collections</Link></ListItem>
                  <ListItem><Link href="/drops">Drops</Link></ListItem>
                  <ListItem><Link href="https://ebisusbay.notion.site/ebisusbay/Ryoshi-Dynasties-8cb0bb21ad194af092cf1e1f8a8846c6">Ryoshi Dynasties</Link></ListItem>
                  <ListItem><Link href="/apply?type=listing">Listing Application</Link></ListItem>
                  <ListItem><Link href="/apply?type=launchpad">Launchpad Application</Link></ListItem>
                </UnorderedList>
              </Box>

              <Box className="widget">
                <Heading as="h5" size="md">Resources</Heading>
                <UnorderedList>
                  <ListItem><a href="https://status.ebisusbay.com/" target="_blank" rel="noreferrer">Platform Status</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/" target="_blank" rel="noreferrer">FAQ</a></ListItem>
                  <ListItem><a href="https://blog.ebisusbay.com/" target="_blank" rel="noreferrer">Blog</a></ListItem>
                  <ListItem><a href="https://almurraydesign.com/cryptocrows.html#!/Ebisus-Bay/c/130146020" target="_blank" rel="noreferrer">Merchandise</a></ListItem>
                  <ListItem><a href={ImageService.staticAsset('terms-of-service.html').convert()} target="_blank" rel="noreferrer">Terms of Service</a></ListItem>
                  <ListItem><a href={ImageService.staticAsset('privacy-policy.html').convert()} target="_blank" rel="noreferrer">Privacy Policy</a></ListItem>
                </UnorderedList>
              </Box>

              <Box className="widget">
                <Heading as="h5" size="md">Community</Heading>
                <UnorderedList>
                  <ListItem><a href="/collection/founding-member">Become a Founding Member</a></ListItem>
                  <ListItem><a href="https://discord.gg/ebisusbay" target="_blank" rel="noreferrer">Discord</a></ListItem>
                  <ListItem><a href="https://twitter.com/EbisusBay" target="_blank" rel="noreferrer">Twitter</a></ListItem>
                  <ListItem><a href="https://instagram.com/ebisusbayofficial" target="_blank" rel="noreferrer">Instagram</a></ListItem>
                  <ListItem><a href="https://t.me/ebisusbay" target="_blank" rel="noreferrer">Telegram</a></ListItem>
                  <ListItem><a href="https://linkedin.com/company/ebisusbay" target="_blank" rel="noreferrer">LinkedIn</a></ListItem>
                </UnorderedList>
              </Box>
              <Box className="widget">
                <Heading as="h5" size="md">Learn</Heading>
                <UnorderedList>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/what-is-an-nft" target="_blank">What is an NFT?</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/what-is-an-nft-marketplace" target="_blank">What is an NFT Marketplace?</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/how-do-i-get-started-with-nfts" target="_blank">Getting started with NFTs</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/what-can-i-do-with-my-new-nft" target="_blank">Benefits of NFT ownership</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/how-to-sell" target="_blank">How to sell an NFT on Ebisu's Bay</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/becoming-a-creator-project-listing" target="_blank">How to become a creator on Ebisu's Bay</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/listing-project-for-secondary-sales-only-minting-has-already-occurred" target="_blank">How to get listed on Ebisu's Bay</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/connect-wallet" target="_blank">How to connect a wallet</a></ListItem>
                  <ListItem><a href="https://docs.ebisusbay.com/docs/ryoshi-vip-stakingharvesting" target="_blank">How to become a VIP</a></ListItem>
                </UnorderedList>
              </Box>
            </SimpleGrid>
          </Center>
        </Box>
        <Box className="subfooter">
          <Flex justify='space-between' px={4} align='center'>
            <Box>
              <span className="copy">&copy; 2021 - {new Date().getFullYear()} Ebisu's Bay Marketplace</span>
            </Box>
            <Box>
              <Box className="social-icons">
                <a href="https://discord.gg/ebisusbay" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faDiscord} bgIcon={faSquare} shrink={8} />
                </a>
                <a href="https://twitter.com/EbisusBay" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faTwitter} bgIcon={faSquare} shrink={7} />
                </a>
                <a href="https://www.instagram.com/ebisusbayofficial" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faInstagram} bgIcon={faSquare} shrink={7} />
                </a>
                <a href="https://t.me/ebisusbay" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faTelegram} bgIcon={faSquare} shrink={7} />
                </a>
                <a href="https://blog.ebisusbay.com" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faMedium} bgIcon={faSquare} shrink={7} />
                </a>
                <a href="https://linkedin.com/company/ebisusbay" target="_blank" rel="noreferrer">
                  <LayeredIcon icon={faLinkedin} bgIcon={faSquare} shrink={7} />
                </a>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Footer);

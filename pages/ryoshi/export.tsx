import {GetServerSidePropsContext} from "next";
import crypto from "crypto";
import {ApiService} from "@src/core/services/api-service";
import {RdUserContextOwnerFactionTroops} from "@src/core/services/api-service/types";
import {Box, Button, Center, Link, Stack} from "@chakra-ui/react";
import {DownloadIcon} from "@chakra-ui/icons";
import React from "react";

const Export = ({valid, delegations}: {valid: boolean, delegations: any[]}) => {
  const csvData = convertToCSV(delegations);
  const csvBlob = new Blob([csvData], { type: 'text/csv' });
  const csvDownloadLink = URL.createObjectURL(csvBlob);

  const jsonData = JSON.stringify(delegations, null, 2);
  const jsonBlob = new Blob([jsonData], { type: 'application/json' });
  const jsonDownloadLink = URL.createObjectURL(jsonBlob);

  return (
    <Box mt={4}>
      <Center>
        {valid ? (
          <Box py={6} px={10} className="card eb-nft__card shadow">
            <Box>Export Data</Box>
            <Box>
              <Stack direction={{base: 'column', sm: 'row'}}>
                <Link
                  href={csvDownloadLink}
                  download='delegations.csv'
                >
                  <Button
                    leftIcon={<DownloadIcon />}
                    fontSize='xs'
                  >
                    Download CSV
                  </Button>
                </Link>
                <Link
                  href={jsonDownloadLink}
                  download='delegations.json'
                >
                  <Button
                    leftIcon={<DownloadIcon />}
                    fontSize='xs'
                  >
                    Download JSON
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Box>
        ) : (
          <Box>Invalid request. Please try generating a new link.</Box>
        )}
      </Center>
    </Box>
  )
}
export default Export;

export const getServerSideProps = async ({query}: GetServerSidePropsContext) => {
  try {

    const requestToken = query.token;
    const ENCRYPTION_KEY = '12345678901234567890123456789012'
    const decryptedToken = decrypt(requestToken as string, ENCRYPTION_KEY);
    const token = JSON.parse(decryptedToken) as TokenProps;

    const currentTime = new Date().getTime();

    if (currentTime > token.expiration) {
      // The token has expired
      return {
        props: {
          valid: false,
          delegations: []
        }
      }
    }

    const data = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .ryoshiDynasties
      .getUserContext(token.address!, token.signature);

    const delegations = (data.season.troops as RdUserContextOwnerFactionTroops).delegate.users.map((user) => ({
      address: user.profileWalletAddress,
      name: user.profileName,
      troops: user.troops
    })).sort((a, b) => b.troops - a.troops);


    return {
      props: {
        valid: true,
        delegations
      }
    }
  } catch (e) {
    return {
      notFound: true
    }
  }
}

interface TokenProps {
  address: string;
  signature: string;
  gameId: number;
  type: string;
  expiration: number;
}

function decrypt(text: any, key: string) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function convertToCSV(objArray: Array<{ [key: string]: any }>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  if (array.length === 0) return '';
  let str = '';

  // headers
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      // Handle values that contain comma or newline
      let value = array[i][index] ?? '';
      line += '"' + value.toString().replace(/"/g, '""') + '"';
    }
    str += line + '\r\n';
  }
  return str;
}
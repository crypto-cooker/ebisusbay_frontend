import {
  Box,
  Container,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Select,
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect} from "react";
import {TitledCard} from "@src/components-v2/foundation/card";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {useUser} from "@src/components-v2/useUser";
import {appConfig} from "@src/Config";
import {ciEquals} from "@src/utils";
import {ethers} from "ethers";
import {Erc20ApprovalButton, NftApprovalButton} from "@src/components-v2/feature/deal/approval-buttons";
import useApprovalStatus from "@src/components-v2/feature/deal/use-approval-status";

const config = appConfig();

interface Step3ReviewDetailsProps {
  address: string;
  onConfirm: () => void;
}

export const Step3ReviewDetails = ({address, onConfirm}: Step3ReviewDetailsProps) => {
  const user = useUser();
  const { setDuration, barterState } = useBarterDeal();
  // const [approvals, setApprovals] = useState<{[key: string]: boolean}>({});
  const {approvals, requiresApprovals, checkApprovalStatusesFromCreate: checkApprovalStatuses, updateApproval} = useApprovalStatus();

  const handleExpirationDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDuration(parseInt(e.target.value));
  }

  // const updateApproval = (address: string, value: boolean | number) => {
  //   if (ciEquals(address, ethers.constants.AddressZero)) {
  //     address = config.tokens.wcro.address;
  //   }
  //
  //   setApprovals({
  //     ...approvals,
  //     [address.toLowerCase()]: true,
  //   });
  // }

  useEffect(() => {
    if (!user.address) return;

    checkApprovalStatuses(barterState, user.address);
  }, [user.address]);

  // const requiresApprovals = Object.values(approvals).filter(approval => !approval).length > 0;
  const requiresCroWrapping = barterState.maker.erc20.some(token => ciEquals(token.address, ethers.constants.AddressZero));

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 3: Review details
        </Heading>
        <Text>
          Set how long this deal should be active, then review selections and click the Confirm button at the bottom to create the deal request.
        </Text>
      </Box>

      <Container>
        <TitledCard title='Additional Details'>
          <VStack align='start'>
            <Box>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <Select
                  defaultValue={604800000}
                  onChange={handleExpirationDateChange}
                  maxW='200px'
                >
                  {expirationDatesValues.map((time) => (
                    <option value={time.value}>{time.label}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </VStack>
        </TitledCard>
        {requiresCroWrapping && (
          <TitledCard title='CRO Transfers' mt={2}>
            <Text>This deal contains CRO and will be automatically wrapped to WCRO</Text>
          </TitledCard>
        )}
        {requiresApprovals && (
          <TitledCard title='Approvals' mt={2}>
            <Text>Some approvals are required so that the contract can successfully transfer assets on your behalf once the deal is accepted. Please review these below</Text>
            <SimpleGrid columns={4} mt={4} gap={2}>
              {barterState.maker.nfts.filter((nft) => !approvals?.[nft.nftAddress.toLowerCase()]).map((nft) => (
                <GridItem key={nft.nftAddress}>
                  <NftApprovalButton
                    nft={{
                      name: nft.name,
                      address: nft.nftAddress,
                    }}
                    onApproved={updateApproval}
                  />
                </GridItem>
              ))}
              {barterState.maker.erc20.filter((token) => !approvals?.[token.address.toLowerCase()]).map((token) => (
                <GridItem key={token.address}>
                  <Erc20ApprovalButton
                    token={{
                      name: token.name,
                      address: token.address,
                      amount: token.amount,
                    }}
                    onApproved={updateApproval}
                  />
                </GridItem>
              ))}
            </SimpleGrid>
          </TitledCard>
        )}
      </Container>
    </>
  )
}

const expirationDatesValues = [
  {
    value: 3600000,
    label: '1 hour'
  },
  {
    value: 10800000,
    label: '3 hours'
  },
  {
    value: 21600000,
    label: '6 hours'
  },
  {
    value: 86400000,
    label: '1 day'
  },
  {
    value: 259200000,
    label: '3 days'
  },
  {
    value: 604800000,
    label: '1 week'
  },
  {
    value: 1296000000,
    label: '2 weeks'
  },
  {
    value: 2592000000,
    label: '1 month'
  },
  {
    value: 7776000000,
    label: '3 month'
  },
  {
    value: 15552000000,
    label: '6 months'
  },
]
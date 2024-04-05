import {useUser} from "@src/components-v2/useUser";
import useApprovalStatus from "@src/components-v2/feature/deal/use-approval-status";
import useCurrencyBroker from "@src/hooks/use-currency-broker";
import {ItemType} from "@src/hooks/use-create-order-signer";
import {OrderState} from "@src/core/services/api-service/types";
import React, {useEffect} from "react";
import {ciEquals} from "@src/utils";
import {TitledCard} from "@src/components-v2/foundation/card";
import {GridItem, SimpleGrid, Text} from "@chakra-ui/react";
import {Erc20ApprovalButton, NftApprovalButton} from "@src/components-v2/feature/deal/approval-buttons";

const maxColumns = {base: 2, sm: 3, md: 5};

const ApprovalsView = ({deal}: {deal: any}) => {
  const user = useUser();
  const {approvals, requiresApprovals, checkApprovalStatusesFromMapi: checkApprovalStatuses, updateApproval} = useApprovalStatus();
  const { getByAddress  } = useCurrencyBroker();

  const isToken = (type: number) => [ItemType.NATIVE, ItemType.ERC20].includes(type);
  const isNft = (type: number) => [ItemType.ERC721, ItemType.ERC1155].includes(type);
  const isDealOpen = deal.state === OrderState.ACTIVE;

  useEffect(() => {
    if (!!user.address && isDealOpen && ciEquals(user.address, deal.taker)) {
      checkApprovalStatuses(deal, 'taker');
    }
  }, [deal.state, user.address, deal.taker]);

  return (
    <>
      {requiresApprovals && (
        <TitledCard title='Approvals' mt={2}>
          <Text>Some approvals are required so that Ebisu's Bay can successfully transfer assets on your behalf once the deal is accepted. Please review these below</Text>
          <SimpleGrid
            columns={{base: 2, sm: 3, md: 5}}
            mt={4}
            gap={2}
          >
            {deal.taker_items.filter((item: any) => isNft(item.item_type) && !approvals?.[item.token.toLowerCase()]).map((nft: any) => (
              <GridItem key={nft.token}>
                <NftApprovalButton
                  nft={{
                    name: nft.token_details.metadata.name,
                    address: nft.token,
                  }}
                  onApproved={updateApproval}
                />
              </GridItem>
            ))}
            {deal.taker_items.filter((item: any) => isToken(item.item_type) && !approvals?.[item.token.toLowerCase()]).map((token: any) => (
              <GridItem key={token.address}>
                <Erc20ApprovalButton
                  token={{
                    name: getByAddress(token.token)?.name ?? 'N/A',
                    address: token.token,
                    amount: token.start_amount,
                  }}
                  onApproved={updateApproval}
                />
              </GridItem>
            ))}
          </SimpleGrid>
        </TitledCard>
      )}
    </>
  )
}

export default ApprovalsView;
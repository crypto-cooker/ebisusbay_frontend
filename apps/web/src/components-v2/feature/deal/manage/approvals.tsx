import {useUser} from "@src/components-v2/useUser";
import useApprovalStatus from "@src/components-v2/feature/deal/use-approval-status";
import {ItemType} from "@market/hooks/use-create-order-signer";
import {OrderState} from "@src/core/services/api-service/types";
import React, {useEffect} from "react";
import {ciEquals, shortAddress} from "@market/helpers/utils";
import {TitledCard} from "@src/components-v2/foundation/card";
import {GridItem, SimpleGrid, Text} from "@chakra-ui/react";
import {Erc20ApprovalButton, NftApprovalButton} from "@src/components-v2/feature/deal/approval-buttons";
import {Deal} from "@src/core/services/api-service/mapi/types";
import { useDealsTokens } from '@src/global/hooks/use-supported-tokens';


const ApprovalsView = ({deal}: {deal: Deal}) => {
  const user = useUser();
  const {approvals, requiresApprovals, checkApprovalStatusesFromMapi: checkApprovalStatuses, updateApproval} = useApprovalStatus();
  const { search: findDealToken } = useDealsTokens(deal.chain);

  const isToken = (type: number) => [ItemType.NATIVE, ItemType.ERC20].includes(type);
  const isNft = (type: number) => [ItemType.ERC721, ItemType.ERC1155].includes(type);
  const isDealOpen = deal.state === OrderState.ACTIVE;
  const targetUser = ciEquals(user.address, deal.taker) ? 'taker' : 'maker';
  const targetItems = deal[targetUser + '_items' as 'maker_items' | 'taker_items'];

  useEffect(() => {
    if (!!user.address && isDealOpen && ciEquals(user.address, deal.taker)) {
      checkApprovalStatuses(deal, 'taker');
    }

    // Allow either side to approve in case maker later revoked any approvals
    if (!!user.address && isDealOpen && ciEquals(user.address, deal.maker)) {
      checkApprovalStatuses(deal, 'maker');
    }
  }, [deal.state, user.address, deal.taker, deal.maker, isDealOpen]);

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
            {targetItems.filter((item: any) => isNft(item.item_type) && !approvals?.[item.token.toLowerCase()]).map((nft: any) => (
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
            {targetItems.filter((item: any) => isToken(item.item_type) && !approvals?.[item.token.toLowerCase()]).map((token: any) => (
              <GridItem key={token.address}>
                <Erc20ApprovalButton
                  token={{
                    name: findDealToken({address: token.token})?.name ?? `Custom Token ${shortAddress(token.token)}`,
                    address: token.token,
                    amountWei: token.start_amount
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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faLock, faUserShield} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import kycPartners from '../../core/data/kyc-partners.json';
import {faCreativeCommons} from "@fortawesome/free-brands-svg-icons";
import {Box, Icon, Tooltip} from "@chakra-ui/react";

export const CollectionVerificationRow = ({doxx, kyc, escrow, creativeCommons, center = false}) => {

  const kycPartner = kyc === 'hidden' ? undefined : kycPartners[kyc]

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  const doxxStatus = () => {
    if (!doxx) return;
    if (doxx === 'public') return 'Team has been publicly doxxed';
    if (doxx === 'private') return 'Team has been privately doxxed';

    return 'Team has an unknown doxx status';
  }

  const kycStatus = () => {
    if (!kyc) return;
    if (kycPartner) return `KYC completed by ${kycPartner?.name}`;

    return 'KYC completed';
  }

  return (
    <div className={`d-flex ${center ? 'justify-content-center' : ''}`}>
      {(doxx === true || doxx === 'public') && (
        <Tooltip hasArrow label={doxxStatus()} bg='gray.300' color='black'>
          <Box w='100px' className="eb-de_countdown text-center">
            <Icon as={FontAwesomeIcon} icon={faAddressCard} /> Doxxed
          </Box>
        </Tooltip>
      )}
      {kyc && (
        <Tooltip hasArrow label={kycStatus()} bg='gray.300' color='black'>
          <Box w='100px' className="eb-de_countdown text-center">
            <Icon as={FontAwesomeIcon} icon={faUserShield} /> KYC
          </Box>
        </Tooltip>
      )}
      {escrow && (
        <Tooltip hasArrow label="Funds are held by Ebisu\'s Bay until roadmap milestones are met" bg='gray.300' color='black'>
          <Box w='100px' className="eb-de_countdown text-center">
            <Icon as={FontAwesomeIcon} icon={faLock} /> Escrow
          </Box>
        </Tooltip>
      )}
      {creativeCommons && (
        <Tooltip hasArrow label='Images for this collection are under the Creative Commons (CC0) license' bg='gray.300' color='black'>
          <Box w='100px' className="eb-de_countdown text-center">
            <Icon as={FontAwesomeIcon} icon={faCreativeCommons} /> CC0
          </Box>
        </Tooltip>
      )}
    </div>
  )
}
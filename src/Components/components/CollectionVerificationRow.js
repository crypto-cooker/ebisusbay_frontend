import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faLock, faUserShield} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import kycPartners from '../../core/data/kyc-partners.json';
import {faCreativeCommons} from "@fortawesome/free-brands-svg-icons";

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
      {doxx && doxx === 'public' && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => renderTooltip(props, doxxStatus())}
        >
          <div className="eb-de_countdown text-center" style={{width: '100px'}}>
            <FontAwesomeIcon icon={faAddressCard} /> Doxxed
          </div>
        </OverlayTrigger>
      )}
      {kyc && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => renderTooltip(props, kycStatus())}
        >
          <div className="eb-de_countdown text-center" style={{width: '100px'}}>
            <FontAwesomeIcon icon={faUserShield} /> KYC
          </div>
        </OverlayTrigger>
      )}
      {escrow && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => renderTooltip(props, 'Funds are held by Ebisu\'s Bay until roadmap milestones are met')}
        >
          <div className="eb-de_countdown text-center" style={{width: '100px'}}>
            <FontAwesomeIcon icon={faLock} /> Escrow
          </div>
        </OverlayTrigger>
      )}
      {creativeCommons && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => renderTooltip(props, 'Images for this collection are under the Creative Commons (CC0) license')}
        >
          <div className="eb-de_countdown text-center" style={{width: '100px'}}>
            <FontAwesomeIcon icon={faCreativeCommons} /> CC0
          </div>
        </OverlayTrigger>
      )}
    </div>
  )
}
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faLock, faUserShield} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import kycPartners from '../../core/data/kyc-partners.json';

export const CollectionVerificationRow = ({doxx, kyc, escrow, center = false}) => {

  const kycPartner = kyc === 'hidden' ? undefined : kycPartners[kyc]

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <div className={`d-flex ${center ? 'justify-content-center' : ''}`}>
      {doxx && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => renderTooltip(props, 'Team has been privately doxxed')}
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
          overlay={(props) => renderTooltip(props, kycPartner ? `KYC completed by ${kycPartner?.name}` : 'KYC completed')}
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
    </div>
  )
}
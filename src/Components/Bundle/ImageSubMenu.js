import { useSelector } from 'react-redux';
import { faFacebook, faSquareTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faSync } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt, faHeart as faHeartSolid, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { Menu } from '../components/chakra-components';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, MenuButton as MenuButtonCK, useClipboard } from "@chakra-ui/react";
import { refreshMetadata, tickFavorite } from '@market/state/redux/slices/nftSlice';
import Button, { LegacyOutlinedButton } from "@src/Components/components/common/Button";
import {useUser} from "@src/components-v2/useUser";

const ImageSubMenu = ({navigator, address, id}) => {
  const user = useUser();
  const { nft, refreshing, favorites } = useSelector((state) => state.nft);
  const { onCopy } = useClipboard(window.location);

  const copyLink = useCallback(() => {
    onCopy();
    toast.info(`Link copied!`);
  }, [navigator, window.location])

  const onRefreshMetadata = useCallback(() => {
    dispatch(refreshMetadata(address, id));
  }, [address, id]);

  const onFavoriteClicked = async () => {
    if (isEmptyObj(user.profile)) {
      toast.info(`Connect wallet and create a profile to start adding favorites`);
      return;
    }
    if (user.profile.error) {
      toast.info(`Error loading profile. Please try reconnecting wallet`);
      return;
    }
    const isCurrentFav = isFavorite();
    await toggleFavorite(user.address, address, id, !isCurrentFav);
    toast.success(`Item ${isCurrentFav ? 'removed from' : 'added to'} favorites`);
    dispatch(tickFavorite(isCurrentFav ? -1 : 1));
    dispatch(retrieveProfile());
  };

  const isFavorite = () => {
    if (!user.profile?.favorites) return false;
    return user.profile.favorites.find((f) => caseInsensitiveCompare(address, f.tokenAddress) && id === f.tokenId);
  }

  const options = [
    {
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      label: 'Share on Facebook',
      icon: faFacebook,
      type: 'url'
    },
    {
      url: 'https://twitter.com/intent/tweet?text=',
      label: 'Share on Twitter',
      icon: faSquareTwitter,
      type: 'url'
    },
    {
      url: 'https://telegram.me/share/?url=',
      label: 'Share on Telegram',
      icon: faTelegram,
      type: 'url'
    },
    {
      label: 'Copy Link',
      icon: faCopy,
      type: 'event',
      handleClick: copyLink
    }
  ];

  const MenuItems = (
    options.map((option, i) => (
      option.type === 'url' ?
        (
          <div key={i}>
            <a href={`${option.url}${window.location}`} target='_blank' >
              <div key={option.label} className='social_media_item'>
                <div className='icon_container'>
                  <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
                </div>
                <div className='label_container'>
                  <span>{option.label}</span>
                </div>
              </div>
            </a>
          </div>

        )
        :
        (
          <div className='social_media_item' onClick={option.handleClick} key={option.label}>
            <div className='icon_container'>
              <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
            </div>
            <div className='label_container'>
              <span>
                {option.label}
              </span>
            </div>
          </div>
        )

    )))

  const MenuButton = () => {

    return (
      <MenuButtonCK as={LegacyOutlinedButton}>
        <FontAwesomeIcon icon={faShareAlt} style={{ cursor: 'pointer' }} />
      </MenuButtonCK>
    )
  }

  return (

    <div className="mt-2" style={{ cursor: 'pointer' }}>
      <ButtonGroup size='sm' isAttached variant='outline'>
        <Button styleType="default-outlined" title="Refresh Metadata" onClick={onRefreshMetadata} disabled={refreshing}>
          <FontAwesomeIcon icon={faSync} spin={refreshing} />
        </Button>
        <Button
          styleType="default-outlined"
          title={isFavorite() ? 'This item is in your favorites list' : 'Click to add to your favorites list'}
          onClick={onFavoriteClicked}
        >
          <div>
            <span className="me-1">{favorites}</span>
            {isFavorite() ? (
              <FontAwesomeIcon icon={faHeartSolid} style={{ color: '#dc143c' }} />
            ) : (
              <FontAwesomeIcon icon={faHeartOutline} />
            )}
          </div>
        </Button>
        {nft && nft.original_image && (
          <Button styleType="default-outlined" title="View Full Image" onClick={() =>
            typeof window !== 'undefined' &&
            window.open(specialImageTransform(address, fullImage()), '_blank')
          }>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Button>
        )}
        <Menu MenuItems={MenuItems} MenuButton={MenuButton()} />

      </ButtonGroup>
    </div>

  )
}

export default ImageSubMenu;
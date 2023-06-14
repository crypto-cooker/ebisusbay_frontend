import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetSettings from '../Account/Settings/hooks/useGetSettings';
import useUpdatePfp from '../Account/Settings/hooks/useUpdatePfp';
import styles from "@src/Components/Account/Settings/Profile/Pfp/pfp.module.scss";
import {
  Stack,
  Image as ChakraImage,
} from "@chakra-ui/react";

const UploadAssetFactionIcon = ({
  id,
  value,
  url,
  accept = 'image/png, image/jpeg, image/jpg',
  onChange,
  onClose,
  faction
}) => {
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);
  const inputFile = useRef(null);
  const { response: settings } = useGetSettings(user?.address);
  const [requestUpdatePfp] = useUpdatePfp();

  const isVideo = value?.file?.type?.includes('video');
  const isImage = value?.file?.type?.includes('image');

  const handleClose = useCallback(() => {
    setFile(null);
    onClose();
  }, [onClose, setFile]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (file.type.includes('image')) {
          const img = new Image();
          img.src = reader.result;

          img.onload = function () {
            onChange({
              file,
              result: reader.result,
              size: { width: this.width, height: this.height },
            });
          };
        } else if (file.type.includes('video')) {
          onChange({
            file,
            result: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [file, isVideo, isImage]);

  const handleChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (settings?.walletAddress) {
        const formData = new FormData();
        formData.append('profilePicture', file);
        await requestUpdatePfp(formData, user.address);
      }
      if (file) setFile(file);
    },
    [setFile]
  );

  const handleClick = useCallback(() => {
    inputFile.current.value = null;
  }, [inputFile]);

  return (
    <Stack direction="row" alignItems="center" spacing={2} className="upload-asset me-0">
      <label
        htmlFor={id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="cursor-pointer"
      >
        <input
          id={id}
          ref={inputFile}
          defaultValue={null}
          accept={accept}
          type="file"
          onChange={handleChange}
          onClick={handleClick}
          style={{ display: 'none' }}
        />
        {value?.result ? (
            isVideo ? (
            <video src={value.result} />
          ) : isImage ? (
            <div className={styles.pfp}>
              <img src={value.result} />
            </div>
          ) : null
        ) : url ? (
          <div className={styles.pfp}>
            <img src={url} />
          </div>
        ) : (
          <div className="cursor-pointer" width="150px" height="150px">
            <ChakraImage src={faction.image} 
            position="absolute"
            rounded='lg'
            width="150px"
            height="150px"

            />
            <Blockies seed={user?.address} size={30} scale={5} />
          </div>
        )}
        {hover && (
          <div className="pfp-setting">
            <FontAwesomeIcon icon={faEdit} />
          </div>
        )}
      </label>
    </Stack>
  );
};

export default UploadAssetFactionIcon;

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import Stack from '@mui/material/Stack';
import useGetSettings from '../Account/Settings/hooks/useGetSettings';
import useUpdateBanner from '../Account/Settings/hooks/useUpdateBanner';

const UploadAsset = ({ id, value, accept = 'image/png, image/jpeg, image/jpg', onChange, onClose }) => {
  const [file, setFile] = useState(null);
  const inputFile = useRef(null);

  const isVideo = value?.file?.type?.includes('video');
  const isImage = value?.file?.type?.includes('image');

  const user = useSelector((state) => state.user);
  const { response: settings } = useGetSettings(user?.address);
  const [requestUpdateBanner] = useUpdateBanner();

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
        formData.append('banner', file);
        await requestUpdateBanner(formData, user.address);
      }
      if (file) setFile(file);
    },
    [setFile]
  );

  const handleClick = useCallback(() => {
    inputFile.current.value = null;
  }, [inputFile]);

  return (
    <Stack direction="row" alignItems="center" spacing={2} className="upload-asset me-0" style={{ width: '100%' }}>
      <label htmlFor={id} style={{ width: '100%' }}>
        <Card style={{ width: '100%', height: value?.result? '100%' : '160px' }}>
          <Card.Body>
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
                <img class='input_image' style={{ width: '100%', objectFit: 'cover' }} src={value.result} />
              ) : null
            ) : (
              <></>
            )}
          </Card.Body>
        </Card>
      </label>
      {/* {onClose && (
        <span className="closable" onClick={handleClose}>
          x
        </span>
      )} */}
    </Stack>
  );
};

export default UploadAsset;

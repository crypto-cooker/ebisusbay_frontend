import React, { useCallback, useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {Card, CardBody, Stack, Text} from "@chakra-ui/react";

const UploadAsset = ({ id, value, accept = 'image/png, image/gif, image/jpeg, image/jpg', onChange, onClose }) => {
  const [file, setFile] = useState(null);
  const inputFile = useRef(null);

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
    (event) => {
      const file = event.target.files[0];
      if (file) setFile(file);
    },
    [setFile]
  );

  const handleClick = useCallback(() => {
    inputFile.current.value = null;
  }, [inputFile]);

  return (
    <Stack direction="row" alignItems="center" spacing={2} className="upload-asset">
      <label htmlFor={id}>
        <Card>
          <CardBody>
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
                <img src={value.result} />
              ) : null
            ) : (
              <>
                <FontAwesomeIcon icon={faImage} className="icon" />
                <Text>+ Asset</Text>
              </>
            )}
          </CardBody>
        </Card>
      </label>
      {onClose && (
        <span className="closable" onClick={handleClose}>
          x
        </span>
      )}
    </Stack>
  );
};

export default UploadAsset;

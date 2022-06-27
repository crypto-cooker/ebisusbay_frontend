import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import Stack from '@mui/material/Stack';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UploadAssetPfp = ({ id, value, accept = 'image/png, image/gif, image/jpeg, image/jpg', onChange, onClose }) => {
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);
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
            <div>
              <img src={value.result} style={{ width: '125px', height: '125px', borderRadius: '100px' }} />
            </div>
          ) : null
        ) : (
          <div className="cursor-pointer">
            <Blockies seed={user?.address} size={25} scale={5} />
          </div>
        )}
        {hover && (
          <div className="pfp-setting">
            <FontAwesomeIcon icon={faEdit} />
          </div>
        )}
      </label>
      {/* {onClose && (
        <span className="closable" onClick={handleClose}>
          x
        </span>
      )} */}
    </Stack>
  );
};

export default UploadAssetPfp;

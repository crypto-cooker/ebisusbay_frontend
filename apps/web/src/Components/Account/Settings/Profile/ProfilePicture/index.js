import React, { useState, useEffect } from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, SimpleGrid, Text, Box } from '@chakra-ui/react';
import { useDisclosure, Image as CImage } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';

import { UploadPfp } from '@src/Components/Form';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { editProfileFormFields } from '@src/Components/Account/Settings/Profile/Form/constants';
import { useGetLayerBooth } from '@src/Components/Account/Settings/hooks/useGetLayerBooth';

import styles from '@src/Components/Account/Settings/Profile/Pfp/pfp.module.scss';

import { getRandomPfp } from './pfs';
import { useUser } from "@src/components-v2/useUser";

export default function ProfilePicture({ values, errors, touched, setFieldValue, setFieldTouched, onClose }) {
  const user = useUser();

  const [{ response: layersResponse }] = useGetLayerBooth(user?.address);
  const [hover, setHover] = useState(false);

  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState([]);
  const [generatedPfp, setGeneratedPfp] = useState([]);

  useEffect(() => {
    if (layersResponse?.data) setLayers(layersResponse.data);
  }, [layersResponse]);

  useEffect(() => {
    setGeneratedPfp(getRandomPfp(layers))
  }, [layers]);

  const { isOpen: isGenerateModalOpen, onOpen: onOpenGenerateModal, onClose: onCloseGenerateModal } = useDisclosure();

  const handleTraitSelect = (traitType, item) => {
    const newPfp = [...generatedPfp];
    const index = layers.findIndex((trait) => trait.name === traitType);
    newPfp[index] = item;
    setGeneratedPfp(newPfp);
  };

  const generateImage = async () => {
    setLoading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 512;
      canvas.height = 512;

      for (const pfp of generatedPfp) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = pfp.image;
        await new Promise((resolve, reject) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
          };
          img.onerror = reject;
        });
      }

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'generated.png', { type: 'image/png' });

      setFieldValue('userInfo.userAvatar.profilePicture', [
        {
          file,
          result: URL.createObjectURL(blob),
          size: { width: 512, height: 512 },
          position: 0,
        },
      ]);

      onClose();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      <Box position="relative">
        <Flex flexDirection="column" width="100%" gap={2}>
          <SimpleGrid width="100%" gap={2} columns={isGenerateModalOpen ? 1 : 2}>
            {!isGenerateModalOpen && (
              <Flex flexDirection="column" gap={1}>
                <Text textAlign="center" fontWeight="bold">
                  Upload
                </Text>
                {editProfileFormFields[1].fields.map((field) => {
                  const { type, ...props } = field;
                  const fieldKey = props.key;
                  const subFormKey = editProfileFormFields[1].key;
                  const name = `userInfo.${subFormKey}.${[fieldKey]}`;
                  props.name = name;
                  props.key = `${type}-${fieldKey}`;
                  props.value = values.userInfo[subFormKey]?.[fieldKey];

                  props.error = touched.userInfo?.[subFormKey]?.[fieldKey]
                    ? errors.userInfo?.[subFormKey]?.[fieldKey]
                    : undefined;

                  if (props.inputType) props.type = props.inputType;

                  return type === 'upload' ? (
                    <UploadPfp
                      {...props}
                      fieldKey={fieldKey}
                      onChange={setFieldValue}
                      onTouched={setFieldTouched}
                      onClosePfpModal={onClose}
                    />
                  ) : null;
                })}
              </Flex>
            )}

            <Flex flexDirection="column" gap={5} alignItems="center">
              {!isGenerateModalOpen && (
                <Text textAlign="center" fontWeight="bold">
                  Generate
                </Text>
              )}
              <Box
                className={styles.pfp}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                position="relative"
                onClick={onOpenGenerateModal}
              >
                {generatedPfp.map((pfp, index) => (
                  <CImage
                    key={index}
                    src={pfp.image}
                    alt={pfp.name}
                    className="cursor-pointer"
                    position="absolute"
                  />
                ))}
                {hover && (
                  <div className="pfp-setting cursor-pointer">
                    <FontAwesomeIcon icon={faEdit} />
                  </div>
                )}
              </Box>
            </Flex>
          </SimpleGrid>

          {isGenerateModalOpen && (
            <Flex width="100%" flexDirection="column" gap={2}>
              <Accordion collapsible allowToggle>
                {layers.map((trait) => (
                  <AccordionItem key={trait.name}>
                    <AccordionButton>{trait.name}</AccordionButton>

                    <AccordionPanel maxHeight="200px" overflowY="scroll">
                      <SimpleGrid columns={4} gap={2}>
                        {trait.items.map((t, index) => {
                          const isSelectedTrait = generatedPfp.some((pfp) => pfp.image === t.image);

                          return (
                            <CImage
                              key={index}
                              src={t.image}
                              alt={t.name}
                              className={isSelectedTrait ? 'cursor-pointer' : 'cursor-not-allowed'}
                              onClick={() => (isSelectedTrait ? null : handleTraitSelect(trait.name, t))}
                              opacity={isSelectedTrait ? 1 : 0.5}
                              border={isSelectedTrait ? '2px solid #1e7ee6' : 'none'}
                            />
                          );
                        })}
                      </SimpleGrid>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>

              <SimpleGrid columns={2} gap={2}>
                <PrimaryButton onClick={onCloseGenerateModal}>Back</PrimaryButton>
                <PrimaryButton onClick={generateImage}>Done</PrimaryButton>
              </SimpleGrid>
            </Flex>
          )}
        </Flex>

        {loading && (
          <Box position="absolute" top={-2} left="0" right="0" bottom="0" bg="rgba(0, 0, 0, 0.5)">
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Text color="white">Loading...</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
}

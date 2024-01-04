import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {ReactElement, useContext, useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from 'react-toastify';
import {useAppSelector} from "@src/Store/hooks";
import axios from "axios";
import {appConfig} from "@src/Config";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface CropperProps {
  isOpen: boolean;
  onClose: () => void;
  src : any;
  setPreview: any;
}

// Modal
const CropperModal = ({isOpen, onClose, src, setPreview}:CropperProps) => {
  const [slideValue, setSlideValue] = useState(10);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const cropRef = useRef<any>(null);
  const user = useUser();
  const {requestSignature} = useEnforceSignature();

  const CallPatchFaction = async (newData:any, faction:any) => {
    try {
      // console.log(faction.id, newData[0].result)
      const signature = await requestSignature();
      await UploadFactionIconPfp(user.address?.toLowerCase(), signature, faction.name, Number(faction.id), newData);
      // console.log(res);
      toast.success("Faction icon updated! Refreshing...");
      // onSuccess();

    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error, 'Icon too large, please use a smaller image'));
    }
  }

  const api = axios.create({
    baseURL: config.urls.cms,
  });

  const UploadFactionIconPfp = async (address:any, signature:any, name:any, id:any, image:any) => {
    try{
      // console.log(address, signature, name, image);
      return await api.patch("ryoshi-dynasties/factions?",
        {name, id, image},
        {params: {address, signature}});
    }
    catch(error){
      throw error;
    }
  }

  //handle save
  const handleSave = async () => {
    if (cropRef) {
      const dataUrl = cropRef.current?.getImageScaledToCanvas().toDataURL();
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      setPreview(URL.createObjectURL(blob));
      // console.log(blob);
      // console.log(dataUrl);
      CallPatchFaction(dataUrl, rdContext.user?.faction);
      
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
        <ModalContent>
      <Box>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: "100%", height: "100%" }}
          border={50}
          borderRadius={150}
          color={[0, 0, 0, 0.72]}
          scale={slideValue / 10}
          rotate={0}
        />

        {/* <Center> */}
        <VStack spacing={4} mt={4}>
        <Box w="100%">
          <Text fontSize={{base: '12', sm: '14'}} p='4' fontWeight="bold">Zoom</Text>
          <Center>
        <Slider 
          aria-label='slider-ex-1' 
          min={10}
          max={50}
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e:any) => setSlideValue(e)}
          w={{base: '80%', sm: '80%'}}
          >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        </Center>

        </Box>
        <Box paddingBottom='4'>
        <Stack direction={{base: 'column', sm: 'row'}} mt={4}>
          <Button 
            onClick={handleSave}
            fontSize={{base: '12', sm: '14'}}
            > Save
          </Button>
          <Button 
            onClick={(e:any) => onClose()}
            fontSize={{base: '12', sm: '14'}}
            > Cancel
          </Button>
        </Stack>
        </Box>
      </VStack>
      </Box>
      </ModalContent>
    </Modal>
  );
};

// Container
const Cropper = ({editsAllowed} : {editsAllowed : boolean}): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  // image src
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [src, setSrc] = useState<string>("");

  // preview
  const [preview, setPreview] = useState(null);

  // modal state
//   const [modalOpen, setModalOpen] = useState(false);

  // ref to control input element
  const inputRef = useRef<any>(null);

  // handle Click
  const handleInputClick = (e:any) => {
    e.preventDefault();
    inputRef.current?.click();
    console.log("clicked");
  };
  // handle Change
  const handleImgChange = (e:any) => {
    setSrc(URL.createObjectURL(e.target.files[0]));
    onOpen();
  };
  return (
    <>
      <CropperModal
        isOpen={isOpen}
        onClose={onClose}
        src={src}
        setPreview={setPreview}
      //   setModalOpen={setModalOpen}
      />
      <VStack align='start'>
          <div className="img-container">
            <Avatar
              size={'2xl'}
              src={preview || rdContext.user?.faction.image}
              // rounded="lg"
              // width="150"
              // height="150"
            />
          </div>
        <Flex maxW={{base: '300', sm: '100%'}} justifyContent='center'>
          {editsAllowed && (
            <Input
              // variant='filled'
              variant='ghost'
              type="file"
              // accept="image/*"
              ref={inputRef}
              onChange={handleImgChange}
              placeholder="Upload Image"
              px={0}
              rounded='none'
            />
          )}
        </Flex>
      </VStack>
    </>
  );
};

export default Cropper;
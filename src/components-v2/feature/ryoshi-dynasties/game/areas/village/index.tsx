import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  HStack,
  Image,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react"

import React, {ReactElement, useEffect, useRef, useState} from 'react';
// import { resizeMap, resizeNewMap } from './mapFunctions.js'
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import styles from '@src/Components/BattleBay/Areas/BattleBay.module.scss';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {Contract, ethers} from "ethers";
import {ApiService} from "@src/core/services/api-service";
import NextApiService from "@src/core/services/api-service/next";
import {getDailyRewards, getGameTokens} from "@src/core/api/RyoshiDynastiesAPICalls";

import {getAuthSignerInStorage} from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

//contracts
import {appConfig} from "@src/Config";
import Resources from "@src/Contracts/Resources.json";
import DailyCheckinModal from "@src/components-v2/feature/ryoshi-dynasties/game/modals/daily-checkin";
import {useAppSelector} from "@src/Store/hooks";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import AnnouncementBoardModal from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal";
import AllianceCenterModal from "@src/Components/BattleBay/Areas/AllianceCenterModal";

interface VillageProps {
  onChange: (value: string) => void;
}
const Village = ({onChange}: VillageProps) => {

  const user = useAppSelector((state) => state.user);
  const config = appConfig();

  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);
  const[resourcesAcquired, setResourcesAcquired] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();

  const [pins, setPins] = useState<ReactElement[]>([]);
  const transformComponentRef = useRef<any>(null)
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const [sizeMultiplier, setSizeMultiplier] = useState(1);
  const [initialPositionX, setInitialPositionX] = useState(-906);
  const [initialPositionY, setInitialPositionY] = useState(-414);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [allianceCenterOpen, setAllianceCenterOpen] = useState(false);

  const buildingButtonRef = useRef<any>(null)
  const announcementBoardRef = useRef<any>(null)
  const { isOpen: isOpenBuildings, onOpen: onOpenBuildings, onClose: onCloseBuildings } = useDisclosure();
  const { isOpen: isOpenAnnouncementBoard, onOpen: onOpenAnnouncementBoard, onClose: onCloseAnnouncementBoard } = useDisclosure();
  const { isOpen: isOpenAllianceCenter, onOpen: onOpenAllianceCenter, onClose: onCloseAllianceCenter } = useDisclosure();
  const { isOpen: isOpenDailyCheckin, onOpen: onOpenDailyCheckin, onClose: onCloseDailyCheckin } = useDisclosure();

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
    }
    console.log("current state " + transformComponentRef?.current?.state) ;
    // transformComponentRef.current.state;
  }, [elementToZoomTo]);

  const changeCanvasState = (ReactZoomPanPinchRef: any, event: any) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
    console.log(ReactZoomPanPinchRef.state.positionX, ReactZoomPanPinchRef.state.positionY, ReactZoomPanPinchRef.state.scale)
  };

  const GetGameTokens = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getGameTokens(user?.address?.toLowerCase(), signatureInStorage);

        if(data.data.data.length > 0) {

        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  const ClaimDailyRewards = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getDailyRewards(user!.address!.toLowerCase(), signatureInStorage);

        const sig = data.data.data.signature;
        const profileId = data.data.data.profileId;
        const quantity = data.data.data.quantity;
        const timestamp = data.data.data.timestamp;

        var claimRewardsTuple = {
          address: user!.address!.toLowerCase(),
          profileId: [profileId],
          quantity: [quantity],
          timestamp: timestamp,
        };

        const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
        const tx = await resourcesContract.mintWithSig(claimRewardsTuple, sig);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

      } catch (error) {
        console.log(error)
      }
    }
  }

  function nFormatter(num: any, digits: number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  const buildings ={ "allianceCenter" : {height:438, width:554, top:'7%', left:'55%'},
    "townhall" : {height:607, width:707, top:'13%', left:'36%'},
    "academy" : {height: 792, width: 744, top: '4%', left: '74%'},
    "tavern" : {height: 573, width: 725, top: '3%', left: '14%'},
    "tavernSpin" : {height: 573, width: 725, top: '3%', left: '14%'},

    "water" : {height: 703, width: 2880, top: '32%', left: '0%'},
    "boat" : {height: 613, width: 718, top: '33%', left: '2%'},
    "ebisustatue" : {height: 542, width: 279, top: '35%', left: '40%'},
    "fishmarket" : {height: 545, width: 793, top: '36.5%', left: '55%'},
    "barracks" : {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
    "swordsmen" : {height: 270, width: 383, top: '22%', left: '14%'},

    "flowers1" : {height: 251, width: 229, top: '3%', left: '14%'},
    "flowers2" : {height: 251, width: 229, top: '3%', left: '14%'},
    "flowers3" : {height: 251, width: 229, top: '3%', left: '14%'},

    "bank" : {height: 456, width: 579, top: '%', left: '33%', x: 444, y: 444, scale: 4},
    "announcement" : {height: 243, width: 206, top: '28%', left: '60%'},

    "moongate" : {height: 482, width: 443, top: '23%', left: '67%'},
    "torii" : {height: 201, width: 236, top: '6%', left: '0%'},
    "pond" : {height: 311, width: 783, top: '0%', left: '65%'},

    'alliancecenter_label' : {height: 438, width: 554, top: '0%', left: '0%'},
    'announcementboard_label' : {height: 243, width: 279, top: '28%', left: '60%'},
    'moongate_label' : {height: 482, width: 443, top: '23%', left: '67%'},
    'academy_label' : {height: 792, width: 744, top: '4%', left: '74%'},
    'tavern_label' : {height: 573, width: 725, top: '3%', left: '14%'},

    'townhall_label' : {height: 607, width: 707, top: '13%', left: '36%'},
    'barracks_label' : {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
    'fishmarket_label' : {height: 545, width: 793, top: '36.5%', left: '55%'},
    'bank_label' : {height: 456, width: 579, top: '7%', left: '33%'},
  }
  const buttonsNames = ["bank", "alliancecenter", "torii", "moongate", "barracks", "announcement", "fishmarket","boat", "academy", "tavern", "townhall"];

  const OpenAllianceCenter = () => {
    setElementToZoomTo('alliancecenter');
    setAllianceCenterOpen(true);
  }
  const CloseAllianceCenter = () => {
    // setZoomState(false);
    setAllianceCenterOpen(false);
    setElementToZoomTo('fancyMenu');
    // resetTransform();
  }

//#region all resizing stuff

  const [allianceCenterWidth, setAllianceCenterWidth] = useState(buildings.allianceCenter.width);
  const [allianceCenterHeight, setAllianceCenterHeight] = useState(buildings.allianceCenter.height);
  const [allianceCenterTop, setAllianceCenterTop] = useState(buildings.allianceCenter.top);
  const [allianceCenterLeft, setAllianceCenterLeft] = useState(buildings.allianceCenter.left);

  const [townhallWidth, setTownhallWidth] = useState(buildings.townhall.width);
  const [townhallHeight, setTownhallHeight] = useState(buildings.townhall.height);
  const [townhallTop, setTownhallTop] = useState(buildings.townhall.top);
  const [townhallLeft, setTownhallLeft] = useState(buildings.townhall.left);

  const [tavernWidth, setTavernWidth] = useState(buildings.tavern.width);
  const [tavernHeight, setTavernHeight] = useState(buildings.tavern.height);
  const [tavernTop, setTavernTop] = useState(buildings.tavern.top);
  const [tavernLeft, setTavernLeft] = useState(buildings.tavern.left);

  const [academyWidth, setAcademyWidth] = useState(buildings.academy.width);
  const [academyHeight, setAcademyHeight] = useState(buildings.academy.height);
  const [academyTop, setAcademyTop] = useState(buildings.academy.top);
  const [academyLeft, setAcademyLeft] = useState(buildings.academy.left);

  const [tavernSpinWidth, setTavernSpinWidth] = useState(buildings.tavernSpin.width);
  const [tavernSpinHeight, setTavernSpinHeight] = useState(buildings.tavernSpin.height);
  const [tavernSpinTop, setTavernSpinTop] = useState(buildings.tavernSpin.top);
  const [tavernSpinLeft, setTavernSpinLeft] = useState(buildings.tavernSpin.left);

  const [flowers1Width, setFlowers1Width] = useState(buildings.flowers1.width);
  const [flowers1Height, setFlowers1Height] = useState(buildings.flowers1.height);
  const [flowers1Top, setFlowers1Top] = useState(buildings.flowers1.top);
  const [flowers1Left, setFlowers1Left] = useState(buildings.flowers1.left);

  const [flowers2Width, setFlowers2Width] = useState(buildings.flowers2.width);
  const [flowers2Height, setFlowers2Height] = useState(buildings.flowers2.height);
  const [flowers2Top, setFlowers2Top] = useState(buildings.flowers2.top);
  const [flowers2Left, setFlowers2Left] = useState(buildings.flowers2.left);

  const [flowers3Width, setFlowers3Width] = useState(buildings.flowers3.width);
  const [flowers3Height, setFlowers3Height] = useState(buildings.flowers3.height);
  const [flowers3Top, setFlowers3Top] = useState(buildings.flowers3.top);
  const [flowers3Left, setFlowers3Left] = useState(buildings.flowers3.left);

  const [bankWidth, setBankWidth] = useState(buildings.bank.width);
  const [bankHeight, setBankHeight] = useState(buildings.bank.height);
  const [bankTop, setBankTop] = useState(buildings.bank.top);
  const [bankLeft, setBankLeft] = useState(buildings.bank.left);

  const [announcementWidth, setAnnouncementWidth] = useState(buildings.announcement.width);
  const [announcementHeight, setAnnouncementHeight] = useState(buildings.announcement.height);
  const [announcementTop, setAnnouncementTop] = useState(buildings.announcement.top);
  const [announcementLeft, setAnnouncementLeft] = useState(buildings.announcement.left);

  const [waterWidth, setWaterWidth] = useState(buildings.water.width);
  const [waterHeight, setWaterHeight] = useState(buildings.water.height);
  const [waterTop, setWaterTop] = useState(buildings.water.top);
  const [waterLeft, setWaterLeft] = useState(buildings.water.left);

  const [barracksWidth, setBarracksWidth] = useState(buildings.barracks.width);
  const [barracksHeight, setBarracksHeight] = useState(buildings.barracks.height);
  const [barracksTop, setBarracksTop] = useState(buildings.barracks.top);
  const [barracksLeft, setBarracksLeft] = useState(buildings.barracks.left);

  const [fishmarketWidth, setFishmarketWidth] = useState(buildings.fishmarket.width);
  const [fishmarketHeight, setFishmarketHeight] = useState(buildings.fishmarket.height);
  const [fishmarketTop, setFishmarketTop] = useState(buildings.fishmarket.top);
  const [fishmarketLeft, setFishmarketLeft] = useState(buildings.fishmarket.left);

  const [boatWidth, setBoatWidth] = useState(buildings.boat.width);
  const [boatHeight, setBoatHeight] = useState(buildings.boat.height);
  const [boatTop, setBoatTop] = useState(buildings.boat.top);
  const [boatLeft, setBoatLeft] = useState(buildings.boat.left);

  const [ebisustatueWidth, setEbisustatueWidth] = useState(buildings.ebisustatue.width);
  const [ebisustatueHeight, setEbisustatueHeight] = useState(buildings.ebisustatue.height);
  const [ebisustatueTop, setEbisustatueTop] = useState(buildings.ebisustatue.top);
  const [ebisustatueLeft, setEbisustatueLeft] = useState(buildings.ebisustatue.left);

  const [swordsmenWidth, setSwordsmenWidth] = useState(buildings.swordsmen.width);
  const [swordsmenHeight, setSwordsmenHeight] = useState(buildings.swordsmen.height);
  const [swordsmenTop, setSwordsmenTop] = useState(buildings.swordsmen.top);
  const [swordsmenLeft, setSwordsmenLeft] = useState(buildings.swordsmen.left);

  const [moongateWidth, setMoongateWidth] = useState(buildings.moongate.width);
  const [moongateHeight, setMoongateHeight] = useState(buildings.moongate.height);
  const [moongateTop, setMoongateTop] = useState(buildings.moongate.top);
  const [moongateLeft, setMoongateLeft] = useState(buildings.moongate.left);

  const [toriiWidth, setToriiWidth] = useState(buildings.torii.width);
  const [toriiHeight, setToriiHeight] = useState(buildings.torii.height);
  const [toriiTop, setToriiTop] = useState(buildings.torii.top);
  const [toriiLeft, setToriiLeft] = useState(buildings.torii.left);

  const [pondWidth, setPondWidth] = useState(buildings.pond.width);
  const [pondHeight, setPondHeight] = useState(buildings.pond.height);
  const [pondTop, setPondTop] = useState(buildings.pond.top);
  const [pondLeft, setPondLeft] = useState(buildings.pond.left);

  const [alliancecenter_labelWidth, setalliancecenter_labelWidth] = useState<number | string>(buildings.alliancecenter_label.left);
  const [alliancecenter_labelHeight, setalliancecenter_labelHeight] = useState<number | string>(buildings.alliancecenter_label.top);
  const [alliancecenter_labelTop, setalliancecenter_labelTop] = useState<number | string>(buildings.alliancecenter_label.width);
  const [alliancecenter_labelLeft, setalliancecenter_labelLeft] = useState<number | string>(buildings.alliancecenter_label.height);

  const [townhall_labelWidth, settownhall_labelWidth] = useState<number | string>(buildings.townhall_label.left);
  const [townhall_labelHeight, settownhall_labelHeight] = useState<number | string>(buildings.townhall_label.top);
  const [townhall_labelTop, settownhall_labelTop] = useState<number | string>(buildings.townhall_label.width);
  const [townhall_labelLeft, settownhall_labelLeft] = useState<number | string>(buildings.townhall_label.height);

  const [tavern_labelWidth, settavern_labelWidth] = useState<number | string>(buildings.tavern_label.left);
  const [tavern_labelHeight, settavern_labelHeight] = useState<number | string>(buildings.tavern_label.top);
  const [tavern_labelTop, settavern_labelTop] = useState<number | string>(buildings.tavern_label.width);
  const [tavern_labelLeft, settavern_labelLeft] = useState<number | string>(buildings.tavern_label.height);

  const [academy_labelWidth, setacademy_labelWidth] = useState<number | string>(buildings.academy_label.left);
  const [academy_labelHeight, setacademy_labelHeight] = useState<number | string>(buildings.academy_label.top);
  const [academy_labelTop, setacademy_labelTop] = useState<number | string>(buildings.academy_label.width);
  const [academy_labelLeft, setacademy_labelLeft] = useState<number | string>(buildings.academy_label.height);

  const [announcementboard_labelWidth, setannouncementboard_labelWidth] = useState<number | string>(buildings.announcementboard_label.left);
  const [announcementboard_labelHeight, setannouncementboard_labelHeight] = useState<number | string>(buildings.announcementboard_label.top);
  const [announcementboard_labelTop, setannouncementboard_labelTop] = useState<number | string>(buildings.announcementboard_label.width);
  const [announcementboard_labelLeft, setannouncementboard_labelLeft] = useState<number | string>(buildings.announcementboard_label.height);

  const [fishmarket_labelWidth, setfishmarket_labelWidth] = useState<number | string>(buildings.fishmarket_label.left);
  const [fishmarket_labelHeight, setfishmarket_labelHeight] = useState<number | string>(buildings.fishmarket_label.top);
  const [fishmarket_labelTop, setfishmarket_labelTop] = useState<number | string>(buildings.fishmarket_label.width);
  const [fishmarket_labelLeft, setfishmarket_labelLeft] = useState<number | string>(buildings.fishmarket_label.height);

  const [moongate_labelWidth, setmoongate_labelWidth] = useState<number | string>(buildings.moongate_label.left);
  const [moongate_labelHeight, setmoongate_labelHeight] = useState<number | string>(buildings.moongate_label.top);
  const [moongate_labelTop, setmoongate_labelTop] = useState<number | string>(buildings.moongate_label.width);
  const [moongate_labelLeft, setmoongate_labelLeft] = useState<number | string>(buildings.moongate_label.height);

  const [bank_labelWidth, setbank_labelWidth] = useState<number | string>(buildings.bank_label.left);
  const [bank_labelHeight, setbank_labelHeight] = useState<number | string>(buildings.bank_label.top);
  const [bank_labelTop, setbank_labelTop] = useState<number | string>(buildings.bank_label.width);
  const [bank_labelLeft, setbank_labelLeft] = useState<number | string>(buildings.bank_label.height);

  const [barracks_labelWidth, setbarracks_labelWidth] = useState<number | string>(buildings.barracks_label.left);
  const [barracks_labelHeight, setbarracks_labelHeight] = useState<number | string>(buildings.barracks_label.top);
  const [barracks_labelTop, setbarracks_labelTop] = useState<number | string>(buildings.barracks_label.width);
  const [barracks_labelLeft, setbarracks_labelLeft] = useState<number | string>(buildings.barracks_label.height);

//#endregion

  useEffect(() => {
    if(sizeMultiplier == 1) return;

    // resizeMap();
    setAllianceCenterWidth( buildings.allianceCenter.width * sizeMultiplier);
    setAllianceCenterHeight( buildings.allianceCenter.height * sizeMultiplier);

    setTownhallWidth( buildings.townhall.width * sizeMultiplier);
    setTownhallHeight( buildings.townhall.height * sizeMultiplier);

    setTavernWidth( buildings.tavern.width * sizeMultiplier);
    setTavernHeight( buildings.tavern.height * sizeMultiplier);

    setAcademyWidth( buildings.academy.width * sizeMultiplier);
    setAcademyHeight( buildings.academy.height * sizeMultiplier);

    setTavernSpinWidth( buildings.tavernSpin.width * sizeMultiplier);
    setTavernSpinHeight( buildings.tavernSpin.height * sizeMultiplier);

    setFlowers1Width( buildings.flowers1.width * sizeMultiplier);
    setFlowers1Height( buildings.flowers1.height * sizeMultiplier);

    setFlowers2Width( buildings.flowers2.width * sizeMultiplier);
    setFlowers2Height( buildings.flowers2.height * sizeMultiplier);

    setFlowers3Width( buildings.flowers3.width * sizeMultiplier);
    setFlowers3Height( buildings.flowers3.height * sizeMultiplier);

    setBankWidth( buildings.bank.width * sizeMultiplier);
    setBankHeight( buildings.bank.height * sizeMultiplier);

    setAnnouncementWidth( buildings.announcement.width * sizeMultiplier);
    setAnnouncementHeight( buildings.announcement.height * sizeMultiplier);

    setWaterWidth( buildings.water.width * sizeMultiplier);
    setWaterHeight( buildings.water.height * sizeMultiplier);

    setBarracksWidth( buildings.barracks.width * sizeMultiplier);
    setBarracksHeight( buildings.barracks.height * sizeMultiplier);

    setFishmarketWidth( buildings.fishmarket.width * sizeMultiplier);
    setFishmarketHeight( buildings.fishmarket.height * sizeMultiplier);

    setBoatWidth( buildings.boat.width * sizeMultiplier);
    setBoatHeight( buildings.boat.height * sizeMultiplier);

    setEbisustatueWidth( buildings.ebisustatue.width * sizeMultiplier);
    setEbisustatueHeight( buildings.ebisustatue.height * sizeMultiplier);

    setSwordsmenWidth( buildings.swordsmen.width * sizeMultiplier);
    setSwordsmenHeight( buildings.swordsmen.height * sizeMultiplier);

    setMoongateWidth( buildings.moongate.width * sizeMultiplier);
    setMoongateHeight( buildings.moongate.height * sizeMultiplier);

    setToriiWidth( buildings.torii.width * sizeMultiplier);
    setToriiHeight( buildings.torii.height * sizeMultiplier);

    setPondWidth( buildings.pond.width * sizeMultiplier);
    setPondHeight( buildings.pond.height * sizeMultiplier);

    setalliancecenter_labelWidth( buildings.alliancecenter_label.width * sizeMultiplier);
    setalliancecenter_labelHeight( buildings.alliancecenter_label.height * sizeMultiplier);

    settownhall_labelWidth( buildings.townhall_label.width * sizeMultiplier);
    settownhall_labelHeight( buildings.townhall_label.height * sizeMultiplier);

    settavern_labelWidth( buildings.tavern_label.width * sizeMultiplier);
    settavern_labelHeight( buildings.tavern_label.height * sizeMultiplier);

    setacademy_labelWidth( buildings.academy_label.width * sizeMultiplier);
    setacademy_labelHeight( buildings.academy_label.height * sizeMultiplier);

    setbank_labelWidth( buildings.bank_label.width * sizeMultiplier);
    setbank_labelHeight( buildings.bank_label.height * sizeMultiplier);

    setbarracks_labelWidth( buildings.barracks_label.width * sizeMultiplier);
    setbarracks_labelHeight( buildings.barracks_label.height * sizeMultiplier);

    setmoongate_labelWidth( buildings.moongate_label.width * sizeMultiplier);
    setmoongate_labelHeight( buildings.moongate_label.height * sizeMultiplier);

    setfishmarket_labelWidth( buildings.fishmarket_label.width * sizeMultiplier);
    setfishmarket_labelHeight( buildings.fishmarket_label.height * sizeMultiplier);

    setannouncementboard_labelWidth( buildings.announcementboard_label.width * sizeMultiplier);
    setannouncementboard_labelHeight( buildings.announcementboard_label.height * sizeMultiplier);
  }, [sizeMultiplier]);

  useEffect(() => {
    function handleResize(){
      // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
      if (window.innerWidth < 2880) {
        setSizeMultiplier(window.innerWidth / 2880);
        // setInitialPositionX(window.innerWidth / 2);
        // setInitialPositionY(window.innerHeight / 2);
        // setZoomState({
        //   offsetX: window.innerWidth / 2,
        //   offsetY: window.innerHeight / 2,
        //   // scale: ReactZoomPanPinchRef.state.scale,
        // });
      }
    }
    window.addEventListener('resize', handleResize)
  })

  useEffect(() => {
    // resizeMap();
    SetUpButtons();
    setSizeMultiplier(window.innerWidth / 2880);
  }, [])

  useEffect(() => {
    // onOpenAnnouncementBoard();
    GetGameTokens();
  }, [])

  const GetResources = async () => {
    try {
      setResourcesAcquired(false);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: ['0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5'],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      if (nfts.data.length > 0) {
        setKoban(nFormatter(nfts.data[0].balance, 1));
      }
      if (!!fortuneAndMitama) {
        setFortune(nFormatter(Number(ethers.utils.formatEther(fortuneAndMitama.fortuneBalance)), 1));
        setMitama(nFormatter(Number(fortuneAndMitama.mitamaBalance), 1));
      }

      setResourcesAcquired(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      GetResources();
    }
  }, [user.address])

  const SetUpButtons = async () => {
    setPins(buttonsNames.map((button, i) =>
      (<Button style={{ marginTop: '4px', marginLeft: '4px' }}
               onClick={() => setElementToZoomTo(button)} variant='outline'size='sm'>
          {button}</Button>
      )))
  }

  const [mapInitialized, setMapInitialized] = useState(false);
  const mapScale = useBreakpointValue(
    {base: 0.5, sm: 0.6, md: 0.7, lg: 0.8, xl: 0.9, '2xl': 1},
    {fallback: 'lg'}
  )
  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.5,
        initialPosition: { x: -450, y: -120 }
      },
      sm: {
        scale: 0.6,
        initialPosition: { x: -450, y: -120 }
      },
      md: {
        scale: 0.7,
        initialPosition: { x: -450, y: -120 }
      },
      lg: {
        scale: 0.8,
        initialPosition: { x: -450, y: -120 }
      },
      xl: {
        scale: 0.9,
        initialPosition: { x: -450, y: -120 }
      },
      '2xl': {
        scale: 1,
        initialPosition: { x: -450, y: -120 }
      }
    }
  );

  useEffect(() => {
    setMapInitialized(true);
  }, []);

  return (
    <section>
      <Box position='relative' h='calc(100vh - 74px)'>
        {mapInitialized && (
          <TransformWrapper
            // limitToBounds={true}
            ref={transformComponentRef}
            onZoom={changeCanvasState}
            onPinching={changeCanvasState}
            onPinchingStop={changeCanvasState}
            onPanningStop={changeCanvasState}

            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            disablePadding={true}
            initialScale={mapProps?.scale}
          >
            {(utils) => (
              <React.Fragment>
                {/* <button onClick={zoomToImage}>Zoom to 1</button> */}
                {/* <Controls {...utils} /> */}
                <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
                  <Box as='img'
                       src='/img/battle-bay/mapImages/background.png'
                       maxW='none'
                       useMap="#image-map" className={`${styles.mapImageArea}`} id="fancyMenu"/>
                  <map name="image-map">
                  </map>

                  <Box id="alliancecenter" className={styles.enlarge} style={{position:"absolute", marginTop: allianceCenterTop, marginLeft: allianceCenterLeft, zIndex:"9"}}
                    // onClick={() => onChange('allianceCenter')}
                       onClick={() => OpenAllianceCenter()}
                  >
                    <img src='/img/battle-bay/mapImages/alliancecenter_day.png' />
                    <Box className={styles.enlarge} style={{position:"absolute", marginTop: alliancecenter_labelTop, marginLeft: alliancecenter_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/alliancecenter_label.png' />
                    </Box>
                  </Box>

                  <Box id="townhall" className={styles.enlarge} style={{position:"absolute", marginTop: townhallTop, marginLeft: townhallLeft, zIndex:"9"}}
                    // onClick={() => onChange('townHall')}
                  >
                    <img src='/img/battle-bay/mapImages/townhall.png' />
                  </Box>

                  <Box id="tavern" className={styles.enlarge} style={{position:"absolute", marginTop: tavernTop, marginLeft: tavernLeft, zIndex:"9"}}
                    // onClick={() => onChange('tavern')}
                  >
                    <img src='/img/battle-bay/mapImages/tavern.png' />
                  </Box>

                  <Box id="academy" className={styles.enlarge} style={{position:"absolute", marginTop: academyTop, marginLeft: academyLeft, zIndex:"9"}}
                    // onClick={() => onChange('academy')}
                  >
                    <img src='/img/battle-bay/mapImages/academy.png' />
                  </Box>

                  <Box className={styles.enlarge} style={{position:"absolute", marginTop: tavernSpinTop, marginLeft: tavernSpinLeft, zIndex:"9", pointerEvents:"none"}}>
                    <img src='/img/battle-bay/mapImages/tavern_turbine.png' />
                  </Box>

                  <Box id="boat" className={styles.enlarge} style={{position:"absolute", marginTop: boatTop, marginLeft: boatLeft, zIndex:"9"}}
                       onClick={() => onChange('battleMap')}
                  >
                    <img src='/img/battle-bay/mapImages/boat_day.png' />
                  </Box>

                  <Box id="ebisustatue" className={styles.enlarge} style={{position:"absolute", marginTop: ebisustatueTop, marginLeft: ebisustatueLeft, zIndex:"9"}} >
                    <img src='/img/battle-bay/mapImages/ebisustatue.png' />
                  </Box>

                  <Box id="fishmarket" className={styles.enlarge} style={{position:"absolute", marginTop: fishmarketTop, marginLeft: fishmarketLeft, zIndex:"9"}} >
                    <img src='/img/battle-bay/mapImages/fishmarket_day.png' />
                  </Box>

                  <Box style={{position:"absolute", marginTop: waterTop, marginLeft: waterLeft, zIndex:"8"}} >
                    <img src='/img/battle-bay/mapImages/water.png' />
                  </Box>

                  <Box id="bank" className={styles.enlarge} style={{position:"absolute", marginTop: bankTop, marginLeft: bankLeft, zIndex:"8"}}
                       onClick={() => onChange('bank')}
                  >
                    <img src='/img/battle-bay/mapImages/bank_day.png' />
                    {/* <div className={[styles.bank_label]} > */}
                    {/* <img className={[styles.bank_label]}  src='/img/battle-bay/building_labels/bank_label.png'
                    // width={bank_labelWidth} height={bank_labelHeight}
                    /> */}
                    {/* </div> */}
                  </Box>

                  <Box id="announcement" className={styles.enlarge} style={{position:"absolute", marginTop: announcementTop, marginLeft: announcementLeft, zIndex:"9"}}
                       onClick={onOpenAnnouncementBoard}
                  >
                    <img src='/img/battle-bay/mapImages/announcement.png' />
                  </Box>

                  <Box id="barracks" className={styles.enlarge} style={{position:"absolute", marginTop: barracksTop, marginLeft: barracksLeft, zIndex:"9"}}
                       onClick={() => onChange('barracks')}
                  >
                    <img src='/img/battle-bay/mapImages/barracks.png' />
                  </Box>

                  <Box className={styles.enlarge} style={{position:"absolute", marginTop: swordsmenTop, marginLeft: swordsmenLeft, zIndex:"9", pointerEvents:"none"}} >
                    <img src='/img/battle-bay/mapImages/swordsmen.png' />
                  </Box>

                  <Box id="moongate" className={styles.enlarge} style={{position:"absolute", marginTop: moongateTop, marginLeft: moongateLeft, zIndex:"9"}}>
                    <img src='/img/battle-bay/mapImages/moongate_day.png' />
                    {/* <div className={[styles.enlarge]} style={{position:"absolute",  zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/moongate_label.png' /> </div> */}
                  </Box>

                  <Box id="torii" className={styles.enlarge} style={{position:"absolute", marginTop: toriiTop, marginLeft: toriiLeft, zIndex:"9"}} >
                    <img src='/img/battle-bay/mapImages/torii.png' />
                  </Box>

                  <Box className={styles.enlarge} style={{position:"absolute", marginTop: pondTop, marginLeft: pondLeft, zIndex:"8"}}>
                    <img src='/img/battle-bay/mapImages/pond1.png' />
                  </Box>


                  {/* <div className={[styles.enlarge]} style={{position:"absolute", marginTop: townhall_labelTop, marginLeft: townhall_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/townhall_label.png' width={townhall_labelWidth} height={townhall_labelHeight} /> </div>

                  <div className={[styles.enlarge]} style={{position:"absolute", marginTop: tavern_labelTop, marginLeft: tavern_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/tavern_label.png' width={tavern_labelWidth} height={tavern_labelHeight} /> </div>

                  <div className={[styles.enlarge]} style={{position:"absolute", marginTop: academy_labelTop, marginLeft: academy_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/academy_label.png' width={academy_labelWidth} height={academy_labelHeight} /> </div>



                  <div className={[styles.enlarge]} style={{position:"absolute", marginTop: barracks_labelTop, marginLeft: barracks_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/barracks_label.png' width={barracks_labelWidth} height={barracks_labelHeight} /> </div>


                  <div className={[styles.enlarge]} style={{position:"absolute", marginTop: fishmarket_labelTop, marginLeft: fishmarket_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/fishmarket_label.png' width={fishmarket_labelWidth} height={fishmarket_labelHeight} /> </div>

                  <div className={[styles.enlarge]} style={{position:"absolute", marginTop: announcementboard_labelTop, marginLeft: announcementboard_labelLeft, zIndex:"20"}}>
                    <img src='/img/battle-bay/building_labels/announcementboard_label.png' width={announcementboard_labelWidth} height={announcementboard_labelHeight} /> </div> */}


                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        )}

        {allianceCenterOpen ? <></> : <>
          <Box  position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
            <Flex direction='row' justify='space-between' >
              <Box mb={4} bg='#272523' p={2} rounded='md' marginTop='150%' >
                <Flex alignItems='left'  >
                  <VStack alignItems='left'  >
                    <HStack>
                      <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
                      <Text >Fortune : {!resourcesAcquired ? <Spinner size='sm'/> :fortune}</Text>
                    </HStack>
                    <HStack>
                      <Image src='/img/battle-bay/announcementBoard/mitama.png' alt="walletIcon" boxSize={6}/>
                      <Text align='left'>Mitama : {!resourcesAcquired ? <Spinner size='sm'/> :mitama}</Text>
                    </HStack>
                    <HStack>
                      <Image src='/img/battle-bay/announcementBoard/koban.png' alt="walletIcon" boxSize={6}/>
                      <Text align='left'>Koban : {!resourcesAcquired ? <Spinner size='sm'/> : koban}</Text>
                    </HStack>
                  </VStack>
                </Flex>

                <Spacer h='4'/>
                <RdButton
                  w='150px'
                  pointerEvents='auto'
                  fontSize={{base: 'm', sm: 'm'}}
                  hideIcon={true}
                  onClick={onOpenBuildings}
                >
                  View Building
                </RdButton>
                <Spacer h='4'/>
                <RdButton
                  w='150px'
                  pointerEvents='auto'
                  fontSize={{base: 'm', sm: 'm'}}
                  hideIcon={true}
                  onClick={onOpenDailyCheckin}
                >
                  Claim Daily Reward
                </RdButton>
                <AnnouncementBoardModal isOpen={isOpenAnnouncementBoard} onClose={onCloseAnnouncementBoard}/>
                <DailyCheckinModal isOpen={isOpenDailyCheckin} onClose={onCloseDailyCheckin}/>
              </Box>
            </Flex>
          </Box>
        </>}

        <Box  position='absolute' top={0} left={0} p={4} >
          <Flex direction='row' justify='space-between' >
            {allianceCenterOpen ? <AllianceCenterModal closeAllianceCenter={() => CloseAllianceCenter()}/> : <></>}
          </Flex>
        </Box>

      </Box>
      <Drawer
        isOpen={isOpenBuildings}
        placement='bottom'
        onClose={onCloseBuildings}
        finalFocusRef={buildingButtonRef}
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Zoom to Building</DrawerHeader>
          <DrawerBody>
            {pins}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </section>
  )
};


export default Village;

interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
}
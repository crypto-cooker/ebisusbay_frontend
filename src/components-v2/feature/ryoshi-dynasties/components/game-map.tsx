import React, {useEffect, useRef, useState} from "react";
import {Box} from "@chakra-ui/react";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import {useAppSelector} from "@src/Store/hooks";

const GameMapWrapper = () => {
  const user = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState<string>('village');
  const [previousPage, setPreviousPage] = useState<string>();
  const [firstRun, setFirstRun] = useState<boolean>(false);
  const [currentModalRef, setCurrentModalRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
  const ref = useRef(null);

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const returnToPreviousPage = () => {
    setCurrentPage(previousPage ?? 'village')
  };

  useEffect(() => {
    setCurrentModalRef(ref);
  }, [ref]);

  return (
    <Box ref={currentModalRef} position='relative'>
        <BattleMap onChange={returnToPreviousPage}/>
    </Box>
  )
}


export default GameMapWrapper;
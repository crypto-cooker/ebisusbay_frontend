import React, {useEffect, useRef, useState} from "react";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {Box, Image, Progress, SimpleGrid} from "@chakra-ui/react";

interface RdProgressBarProps {
  current: number;
  max: number;
  potential?: number;
  asPercentage?: boolean;
}
const RdProgressBar = ({current, max, potential, asPercentage}: RdProgressBarProps) => {
  const [progressValue, setProgressValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const [barSpot, setBarSpot] = useState(0);
  const windowSize = useWindowSize();

  const getProgress = async () => {
    const value = (current / max) * 100;
    setProgressValue(value);
    const offsetWidth = progressRef.current?.offsetWidth ?? 0;
    setBarSpot((((value > 0 ? value : 1) / 100) * offsetWidth) - 5);
  }

  useEffect(() => {
    async function func() {
      await getProgress();
    }
    func();
  }, [current, windowSize.width]);

  return (
    <>
      <Box
        // bg='linear-gradient(to left, #FDAB1A, #FD8800)'
        // p={1}
        h='30px'
        position='relative'
      >
        <Progress
          ref={progressRef}
          value={progressValue}
          bg='#272523'
          h='30px'
          sx={{
            '& > div': {
              background: 'linear-gradient(to left, #2ec2e5, #0087d3)',
              boxShadow: '12px 0 15px -4px rgba(31, 73, 125, 0.8), -12px 0 8px -4px rgba(31, 73, 125, 0.8)'
            },
          }}
        />
        <Image position='absolute' src='/img/battle-bay/bankinterior/progress_bar_spark.png'
               top={0}
               h='30px'
               left={barSpot}
               zIndex={0}
        />

        <SimpleGrid
          columns={8}
          position='absolute'
          top={0}
          left={0}
          h='full'
          w='full'
        >
          <Box
            borderColor='#FDAB1A'
            borderStyle='solid'
            borderTopWidth='4px'
            borderEndWidth='1px'
            borderBottomWidth='4px'
            borderStartWidth='4px'
          />
          {[...Array(6).fill(0)].map((_, i) => (
            <Box
              key={i}
              borderColor='#FDAB1A'
              borderStyle='solid'
              borderTopWidth='4px'
              borderEndWidth='1px'
              borderBottomWidth='4px'
              borderStartWidth='1px'
            />
          ))}
          <Box
            borderColor='#FDAB1A'
            borderStyle='solid'
            borderTopWidth='4px'
            borderEndWidth='4px'
            borderBottomWidth='4px'
            borderStartWidth='1px'
          />
        </SimpleGrid>
      </Box>
    </>
  )
}

export default RdProgressBar;
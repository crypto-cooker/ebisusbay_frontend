import {useRouter} from "next/navigation";
import {useState} from "react";
import {Box, Tab, TabList, Tabs} from "@chakra-ui/react";
import {StandardContainer} from "@src/components-v2/shared/containers";

enum TabIndex {
  Swap,
  Liquidity,
}

interface SubnavigationProps {
  primaryTabKey: keyof typeof TabIndex;
}

export default function Subnavigation({ primaryTabKey }: SubnavigationProps) {
  const primaryTabIndex = TabIndex[primaryTabKey];
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(primaryTabIndex);

  const handleTabsChange = (index: number) => {
    if (index === primaryTabIndex) return;

    if (index === TabIndex.Swap) {
      router.push('/dex/swap');
    } else if (index === TabIndex.Liquidity) {
      router.push('/dex/liquidity');
    }
    setTabIndex(index);
  };

  return (
    <Box bgColor='#0d6efd29'>
      <StandardContainer>
        <Tabs index={tabIndex} onChange={handleTabsChange} align='center'>
          <TabList borderBottom='none' fontWeight='semibold'>
            {Object.keys(TabIndex).filter(key => isNaN(Number(key))).map((key) => (
              <Tab key={key} fontWeight='semibold'>{key}</Tab>
            ))}
          </TabList>
        </Tabs>
      </StandardContainer>
    </Box>
  );
}
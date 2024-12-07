import React from 'react';
import { AccordionItem, Box, keyframes } from '@chakra-ui/react';

const pulseAnimation = keyframes`
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
`;

function StyledAccordionItem({ children, shouldUseAnimated }: { children: React.ReactNode; shouldUseAnimated: boolean }) {
  if (shouldUseAnimated) {
    return (
      <AccordionItem
        position="relative"
        p="1px" // Padding to create space for the "border" effect
        bg="transparent"
        rounded="md"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          // A static gradient with contrasting colors to ensure visibility.
          // Example: a warm orange and gold gradient that pulses in brightness.
          background: 'linear-gradient(90deg, #FF6900, #FFD700, #FF6900)',
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
          zIndex: -1,
        }}
      >
        <Box bgColor="#292626" borderRadius='inherit'>
          {children}
        </Box>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem bgColor='#292626' rounded='md'>
      {children}
    </AccordionItem>
  );
}

export default StyledAccordionItem;
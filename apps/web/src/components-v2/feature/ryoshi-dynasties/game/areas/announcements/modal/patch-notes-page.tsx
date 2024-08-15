import {Stack, Text,} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })

export interface PatchNotesProps {
  changeDate : string;
  patchNumber : string;
  notes : string[];
}

const PatchNotes = ({changeDate, patchNumber, notes} : PatchNotesProps) => {

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}  mt={10} >
      <Text p={4} fontSize='2xl' fontWeight='bold'>
        {changeDate}  {patchNumber}
      </Text>
      {notes.map((note, index) => (
        <Text key={index} p={2} pt='0'>
          {note}
        </Text>
      ))}
      <Text mt={2} p={4}>
      
      </Text>
    </Stack>
  );
}

export default PatchNotes;
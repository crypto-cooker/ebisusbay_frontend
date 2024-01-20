import { Metadata } from 'next'
import {Box} from "@chakra-ui/react";

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return (
    <Box>
      <h1>My Pagse</h1>
    </Box>
  )
}
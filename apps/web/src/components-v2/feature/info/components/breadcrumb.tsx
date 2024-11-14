import { Box, BreadcrumbSeparator, Stack } from '@chakra-ui/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbProps } from '@chakra-ui/react';
import { useChainPathByQuery } from '../hooks/chain';
import Link from 'next/link';

interface BreadCrumbProps {
  infoType: string;
  infoContent: string;
}

const BreadCrumb = ({ infoType, infoContent }: BreadCrumbProps) => {
  const chainPath = useChainPathByQuery();
  return (
    <Stack>
      <Breadcrumb variant="plain">
        <Link href={`/info${chainPath}`}>Info</Link>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
        <Link href={`/info${chainPath}/${infoType}`}>{infoType}</Link>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
        <Box>{infoContent}</Box>
      </Breadcrumb>
    </Stack>
  );
};

export default BreadCrumb;

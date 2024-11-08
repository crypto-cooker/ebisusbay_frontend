import { Box, BreadcrumbSeparator, Stack } from '@chakra-ui/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbProps } from '@chakra-ui/react';
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button';
import { useChainPathByQuery } from '../hooks/chain';

interface BreadCrumbProps {
  infoType: string;
  infoContent: string;
}

const BreadCrumb = ({ infoType, infoContent }: BreadCrumbProps) => {
  const chainPath = useChainPathByQuery();
  return (
    <Stack>
      <Breadcrumb variant="plain">
        <NextLinkFromReactRouter to={`/info${chainPath}`}>Info</NextLinkFromReactRouter>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
        <NextLinkFromReactRouter to={`/info${chainPath}/${infoType}`}>{infoType}</NextLinkFromReactRouter>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
        <Box>{infoContent}</Box>
      </Breadcrumb>
    </Stack>
  );
};

export default BreadCrumb;

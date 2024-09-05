import {GetServerSidePropsContext} from "next";
import {ciEquals} from "@market/helpers/utils";
import {appConfig} from "@src/config";
import Error from "next/error";
import {ChainId} from "@pancakeswap/chains";

/* This page only exists to redirect legacy collection routes.
 * NextJS config needs regex but does not reliably redirect these.
 * Embedded app browsers also do not chain redirects (e.g. legacy -> address -> slug)
 * so we will do this ourselves programmatically and remove unnecessary redirects
 */
const Page = () => <Error statusCode={404} />

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const legacyCollectionId = params?.chain as string;

  if (!legacyCollectionId || Array.isArray(legacyCollectionId)) {
    return {
      notFound: true
    }
  }

  const [isLegacy, legacyCollection] = isLegacyCollectionRoute(legacyCollectionId);
  if (isLegacy) {
    return {
      redirect: {
        permanent: false,
        destination: `/collection/cronos/${legacyCollection.slug}`
      }
    }
  }

  return {
    notFound: true
  }
}

// Legacy route is /collection/[slug|address]
// To be redirected to /collection/cronos/[slug|address] as they are all cronos
function isLegacyCollectionRoute(chainOrCollection: string) {
  const legacyCollections = appConfig('collections');
  const legacyCollection = legacyCollections.find((collection: any) => {
    const matchesSlug = ciEquals(chainOrCollection, collection.slug);
    const matchesAddress = ciEquals(chainOrCollection, collection.address);
    const isLegacy = [collection.chain, collection.chainId].some(val => !val || val === ChainId.CRONOS);
    return (matchesSlug || matchesAddress) && isLegacy;
  });

  return [!!legacyCollection, legacyCollection];
}

export default Page;
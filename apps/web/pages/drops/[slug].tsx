import React, {useState} from 'react';
import {useRouter} from 'next/router';

import MultiDrop from '@src/components-v2/feature/drop/multi-drop';
import SingleDrop from '@src/components-v2/feature/drop/single-drop';
import {appConfig} from "@src/config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {hostedImage} from "@src/helpers/image";
import RyoshiDrop from "@src/components-v2/feature/drop/ryoshi-drop";
import localDataService from "@src/core/services/local-data-service";
import {Drop} from "@src/core/models/drop";
import LandDrop from "@src/components-v2/feature/drop/land-drop";
import DutchAuction from "@src/components-v2/feature/drop/types/dutch";
import Vip2Drop from "@src/components-v2/feature/drop/vip2-drop";
import {ApiService} from "@src/core/services/api-service";

export const drops = appConfig('drops');

interface DropProps {
  ssrDrop: Drop;
  ssrCollection: any;
}

const Page = ({ssrDrop, ssrCollection}: DropProps) => {
  const router = useRouter();
  const { slug } = router.query;

  const [isMultiDrop, setIsMultiDrop] = useState(false);

  return (
    <>
      <PageHead
        title={`${ssrDrop.title} - Drop`}
        description={ssrDrop.subtitle}
        url={`/drops/${ssrDrop.slug}`}
        image={hostedImage(ssrDrop.images.preview ?? ssrDrop.images.drop ?? ssrCollection?.metadata.card)}
      />
      {ssrDrop && (
        <>
          {isMultiDrop ? (
            <MultiDrop />
          ) : ssrDrop.slug === 'ryoshi-tales-vip' ? (
            <RyoshiDrop drop={ssrDrop} />
          ) : ssrDrop.slug === 'izanamis-cradle-land-deeds' ? (
            <LandDrop drop={ssrDrop} />
          ) : ssrDrop.slug === 'ryoshi-heroes' ? (
            <DutchAuction drop={ssrDrop} />
          ) : ssrDrop.slug === 'ryoshi-tales-vip-2' ? (
            <Vip2Drop drop={ssrDrop} />
          ) : (
            <SingleDrop drop={ssrDrop} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }: {params: any}) => {
  const slug = params?.slug;
  const drop = localDataService.getDrop(slug);

  if (!drop) {
    return {
      notFound: true
    }
  }

  const collectionSlug = slug === 'ryoshi-clubs' ? 'ryoshi-playing-cards' : (drop.collection ?? slug);
  let collection = await ApiService.withKey(process.env.EB_API_KEY as string).getCollections({slug: collectionSlug});

  // try {
  //   const res = await fetch(`${config.urls.api}collectioninfo?slug=${collectionSlug}`)
  //   const json = await res.json();
  //   if (json.collections.length > 0) {
  //     collection = json.collections[0];
  //   }
  // } catch (e) {
  //   return {
  //     notFound: true
  //   }
  // }


  return {
    props: {
      slug: drop.slug,
      ssrDrop: drop,
      ssrCollection: collection.data[0] ?? null
    },
  };
};

export default Page;

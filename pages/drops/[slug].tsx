import React, { useState } from 'react';
import { useRouter } from 'next/router';

import MultiDrop from '@src/components-v2/feature/drop/multi-drop';
import SingleDrop from '@src/components-v2/feature/drop/single-drop';
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {hostedImage} from "@src/helpers/image";
import RyoshiDrop from "@src/components-v2/feature/drop/ryoshi-drop";
import localDataService from "@src/core/services/local-data-service";
import {Drop} from "@src/core/models/drop";
import LandDrop from "@src/components-v2/feature/drop/land-drop";

export const drops = appConfig('drops');
const config = appConfig();

interface DropProps {
  ssrDrop: Drop;
  ssrCollection: any;
}

const Drop = ({ssrDrop, ssrCollection}: DropProps) => {
  const router = useRouter();
  const { slug } = router.query;

  const [isMultiDrop, setIsMultiDrop] = useState(false);

  return (
    <>
      <PageHead
        title={`${ssrDrop.title} - Drop`}
        description={ssrDrop.subtitle}
        url={`/drops/${ssrDrop.slug}`}
        image={hostedImage(ssrCollection?.metadata.card ?? ssrDrop.images.drop)}
      />
      {ssrDrop && (
        <>
          {isMultiDrop ? (
            <MultiDrop />
          ) : ssrDrop.slug === 'ryoshi-tales-vip' ? (
            <RyoshiDrop drop={ssrDrop} />
          ) : ssrDrop.slug === 'izanamis-cradle-land-deeds' ? (
            <SingleDrop drop={ssrDrop} />
          )  : (
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
  const res = await fetch(`${config.urls.api}collectioninfo?slug=${slug}`)
  const json = await res.json();
  const collection = json.collections[0] ?? null;

  if (!drop) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      slug: drop.slug,
      ssrDrop: drop,
      ssrCollection: collection
    },
  };
};

export default Drop;

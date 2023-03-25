import React, { useState } from 'react';
import { useRouter } from 'next/router';

import MultiDrop from '@src/components-v2/feature/drop/multi-drop';
import SingleDrop from '@src/components-v2/feature/drop/single-drop';
import {caseInsensitiveCompare} from "@src/utils";
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {hostedImage} from "@src/helpers/image";
import RyoshiDrop from "@src/components-v2/feature/drop/ryoshi-drop";

export const drops = appConfig('drops');
const config = appConfig();

interface DropProps {
  ssrDrop: any;
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
  const drop = drops.find((c: any) => caseInsensitiveCompare(c.slug, slug));
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
      slug: drop?.slug,
      ssrDrop: drop,
      ssrCollection: collection
    },
  };
};

export default Drop;

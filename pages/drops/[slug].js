import React, { useState } from 'react';
import { useRouter } from 'next/router';

import MultiDrop from '../../src/Components/Drop/multiDrop';
import SingleDrop from '../../src/Components/Drop/singleDrop';
import CronosverseDrop from '../../src/Components/Drop/CronosverseDrop';
import {caseInsensitiveCompare} from "@src/utils";
import {appConfig} from "@src/Config";
import PageHead from "../../src/Components/Head/PageHead";

export const drops = appConfig('drops');
const config = appConfig();

const Drop = ({ssrDrop, ssrCollection}) => {
  const router = useRouter();
  const { slug } = router.query;

  const [isMultiDrop, setIsMultiDrop] = useState(false);
  const [isMultiPrice, setIsMultiPrice] = useState(false);
  // const [drop, setDrop] = useState(null);
  //
  // useEffect(() => {
  //   let drop = drops.find((c) => c.slug === slug);
  //   if (drop) {
  //     setDrop(drop);
  //     setIsMultiDrop(drop.multiMint);
  //     setIsMultiPrice(drop.multiPrice);
  //   }
  // }, [slug]);

  return (
    <>
      <PageHead
        title={ssrDrop.title}
        description={ssrDrop.subtitle}
        url={`/drops/${ssrDrop.slug}`}
        image={ssrCollection?.metadata.card ?? ssrDrop.image.drop}
      />
      {ssrDrop && (
        <>
          {isMultiDrop ? (
            <MultiDrop drop={ssrDrop} />
          ) : isMultiPrice ? (
            <CronosverseDrop drop={ssrDrop} />
          ) : (
            <SingleDrop drop={ssrDrop} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  const drop = drops.find((c) => caseInsensitiveCompare(c.slug, slug));
  const res = await fetch(`${config.urls.api}collectioninfo?slug=${slug}`)
  const json = await res.json();
  const collection = json.collections[0]

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

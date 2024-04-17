import {Metadata} from "next";
import brands from "@src/core/data/brands.json";
import PageContent from "./content";

export const metadata: Metadata = {
  title: 'NFT Brands',
  description: 'Showcasing the most prominent brands on the Cronos chain',
}


export default async function Page() {
  const ssrBrands = await getBrands()

  return (
    <>
      <PageContent ssrBrands={ssrBrands} />
    </>
  )
}

async function getBrands(): Promise<any[]> {
  return brands.sort((a, b) => (b.featured === a.featured) ? 0 : (a.featured ? -1 : 1))
}

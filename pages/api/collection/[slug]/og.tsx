import {ImageResponse, NextRequest} from "next/server";
import {caseInsensitiveCompare, isAddress, siPrefixedNumber} from "@src/utils";
import {appConfig} from "@src/Config";


export const config = {
  runtime: 'edge',
}

const regularFont = fetch(
  new URL('/public/fonts/dm-sans/DMSans-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
  new URL('/public/fonts/dm-sans/DMSans-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const cronosIcon = fetch(
  new URL('/public/img/logos/cronos_white.png', import.meta.url))
.then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/')[3];
  const [regularFontData, boldFontData] = await Promise.all([
    regularFont,
    boldFont
  ]);
  const cronosIconData = await cronosIcon;

  let collection;
  if (isAddress(slug)) {
    collection = appConfig('collections').find((c: any) => caseInsensitiveCompare(c.address, slug));
  } else {
    collection = appConfig('collections').find((c: any) => caseInsensitiveCompare(c.slug, slug));
  }

  if (!collection) {
    return {
      notFound: true
    }
  }

  const data = await fetch(`${appConfig('urls').api}collectioninfo?address=${collection.address}`);
  const collectionData = (await data.json()).collections[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.85)), url(https://cdn.ebisusbay.com${collection.metadata.card})`,
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            position: 'absolute',
            bottom: 0,
          }}
        >
          <img
            src={`https://cdn.ebisusbay.com${collection.metadata.avatar}`}
            width='50px'
            height='50px'
            style={{
              backgroundRepeat: 'no-repeat',
              objectFit: 'contain',
              borderRadius: 5,
            }}
          />
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
            }}
          >
            {collection.name}
          </div>
          <div style={{display: 'flex'}}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{fontWeight:'bold', fontSize: 20}}>{!!collectionData.totalSupply ? siPrefixedNumber(collectionData.totalSupply) : '-'}</div>
              <div style={{fontWeight:'bold', fontSize: 16, color:'#DDDDDDCC'}}>Items</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 12
              }}
            >
              <div style={{fontWeight:'bold', fontSize: 20}}>{collectionData.holders ?? '-'}</div>
              <div style={{fontWeight:'bold', fontSize: 16, color:'#DDDDDDCC'}}>Owners</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 12
              }}
            >
              <div style={{fontWeight:'bold', fontSize: 20, display: 'flex'}}>
                <span>{!!Number(collectionData.stats.total.volume) ? `${siPrefixedNumber(collectionData.stats.total.volume)} CRO` : '-'}</span>
                {/*<img src={cronosIconData} width='17' height='20' style={{marginTop: '3px', marginLeft: '2px'}}/>*/}
              </div>
              <div style={{fontWeight:'bold', fontSize: 16, color:'#DDDDDDCC'}}>Volume</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 12
              }}
            >
              <div style={{fontWeight:'bold', fontSize: 20, display: 'flex'}}>
                <span>{!!Number(collectionData.stats.total.floorPrice) ? `${siPrefixedNumber(collectionData.stats.total.floorPrice)} CRO` : '-'}</span>
                {/*<img src={cronosIconData} width='17' height='20' style={{marginTop: '3px', marginLeft: '2px'}}/>*/}
              </div>
              <div style={{fontWeight:'bold', fontSize: 16, color:'#DDDDDDCC'}}>Floor</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 338,
      fonts: [
        {
          name: 'DM Sans',
          data: regularFontData,
          weight: 400
        },
        {
          name: 'DM Sans',
          data: boldFontData,
          weight: 700
        }
      ]
    }
  )
}
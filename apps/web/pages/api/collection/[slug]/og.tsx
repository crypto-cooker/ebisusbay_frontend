import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {ciEquals, isAddress, round, siPrefixedNumber, urlify} from "@edge/utils";
import {appConfig} from "@src/config";
import imageSize from "image-size";


export const config = {
  runtime: 'edge',
}

const regularFont = fetch(
  new URL('/public/fonts/dm-sans/DMSans-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
  new URL('/public/fonts/dm-sans/DMSans-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

// const cronosIcon = fetch(
//   new URL('/public/img/logos/cronos_white.png', import.meta.url))
// .then((res) => res.arrayBuffer());

const defaultBanner = `${appConfig('urls').app}img/background/banner-default.webp`;

const collections = appConfig('legacyCollections');

const getBanner = (collection: any) => {
  let banner = defaultBanner;
  if (!!collection.metadata.card) {
    banner = collection.metadata.card.startsWith('http') ? collection.metadata.card : urlify(appConfig('urls.app'), collection.metadata.card);
  } else if (!!collection.metadata.banner) {
    banner = collection.metadata.banner.startsWith('http') ? collection.metadata.banner : urlify(appConfig('urls.app'), collection.metadata.banner);
  }

  return banner;
}

/**
 * Convert an image to base64 PNG because OG doesn't support webp
 * 
 * @param url
 */
const base64Image = async (url: string) => {
  const test1 = await fetch(`${appConfig('urls.app')}api/og/convert?url=${url}`);
  const contentType = test1.headers.get('content-type') || 'application/octet-stream';
  const imageBuffer = await test1.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  return `data:${contentType};base64,${base64Image}`;
}

export default async function handler(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/')[3];
  const [regularFontData, boldFontData] = await Promise.all([
    regularFont,
    boldFont
  ]);
  // const cronosIconData = await cronosIcon;

  let collection;
  if (isAddress(slug)) {
    collection = collections.find((c: any) => ciEquals(c.address, slug));
  } else {
    collection = collections.find((c: any) => ciEquals(c.slug, slug));
  }

  if (!collection) {
    return {
      notFound: true
    }
  }

  const banner = await base64Image(getBanner(collection));
  let avatarSource = collection.metadata?.avatar;
  if (!avatarSource && avatarSource.startsWith('http')) {
    avatarSource = urlify(appConfig('urls.app'), collection.metadata.avatar)
  }

  const avatar = avatarSource ? await base64Image(avatarSource) : null;

  try {
    const data = await fetch(
      `${appConfig('urls').api}collectioninfo?address=${collection.address}`,
      { next: { revalidate: 10 }}
    );
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
              backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.85) 90%), url(${banner})`,
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
            {!!avatar && (
              <img
                alt={collection.name}
                src={avatar}
                width='50px'
                height='50px'
                style={{
                  backgroundRepeat: 'no-repeat',
                  objectFit: 'contain',
                  borderRadius: 5,
                }}
              />
            )}
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
                <div style={{fontWeight:'bold', fontSize: 20}}>{!!collectionData.holders && collection.slug !== 'ryoshi-tales-vip' ? siPrefixedNumber(collectionData.holders) : '-'}</div>
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
                  <span>{!!Number(collectionData.stats.total.volume) ? `${siPrefixedNumber(round(collectionData.stats.total.volume))} CRO` : '-'}</span>
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
                  <span>{!!Number(collectionData.stats.total.floorPrice) ? `${siPrefixedNumber(round(collectionData.stats.total.floorPrice))} CRO` : '-'}</span>
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
        ],
        headers: {
          'cache-control': 'public, max-age=180, stale-while-revalidate=300, no-transform'
        }
      }
    )
  } catch (e: any) {
    const dimensions = await fetchImageDimensions(banner);

    return new ImageResponse(
      (
        <img
          alt={collection.name}
          src={banner}
          width='100%'
          height='100%'
        />
      ),
      {
        width: dimensions.width,
        height: dimensions.height,
        headers: {
          'cache-control': 'public, max-age=180, stale-while-revalidate=300, no-transform'
        }
      }
    )
  }
}

async function fetchImageDimensions(url: string): Promise<{ width: number; height: number }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const dimensions = imageSize(Buffer.from(buffer));
  return { width: dimensions.width!, height: dimensions.height! };
}
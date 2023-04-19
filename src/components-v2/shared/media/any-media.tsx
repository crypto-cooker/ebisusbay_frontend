import React, {memo, ReactNode, useEffect, useState} from 'react';
import ReactPlayer from 'react-player/lazy';
import Link from 'next/link';
import {CdnImage} from './cdn-image';
import {fallbackImageUrl} from "@src/core/constants";
import ImageService from '@src/core/services/image';

// AnyMediaProps

export interface AnyMediaProps {
  image: string;
  video?: string;
  title: string;
  url?: string;
  newTab?: boolean;
  usePlaceholder?: boolean;
  videoProps?: any;
  className?: string;
  layout?: 'responsive' | 'fill' | 'fixed' | 'intrinsic';
  width?: number;
  height?: number;
  sizes?: string;
  thumbnail?: string;
}

export const AnyMedia = ({
  image,
  video,
  title,
  url = '',
  newTab = false,
  usePlaceholder = false,
  videoProps = {},
  className = '',
  layout = 'responsive',
  width = 1,
  height = 1,
  sizes,
  thumbnail,
}: AnyMediaProps) => {
  const [dynamicType, setDynamicType] = useState<number>();
  const [transformedImage, setTransformedImage] = useState(image);
  const [videoThumbnail, setVideoThumbNail] = useState<string | null>(thumbnail ?? image);

  const blurImageUrl = (img: string) => {
    return ImageService.instance.provider.blurred(img);
  };

  const makeThumb = (vid: string) => {
    return ImageService.instance.provider.thumbnail(vid);
  };

  useEffect(() => {
    determineMediaType();
  }, []);

  const hasFileExtension = (filename: string) => {
    const filenameParts = filename.split('?')[0].split('/');
    const filenamePart = filenameParts[filenameParts.length - 1];
    const fileExt = filenamePart.slice(filenamePart.lastIndexOf('.') + 1);
    return fileExt !== filenamePart && fileExt !== '';
  };

  const determineMediaType = () => {
    if (!image || image.startsWith('data')) {
      setDynamicType(MediaType.image);
      return;
    }

    const knownImageTypes = ['.png', '.jpg', '.jpeg', 'webp'];

    try {
      const imageURL = new URL(image);
      //prefer mp4 over gif
      if (imageURL.pathname && imageURL.pathname.endsWith('.gif')) {
        setTransformedImage(ImageService.proxy.gifToMp4(imageURL.toString()));
        setVideoThumbNail(thumbnail ?? null);
        setDynamicType(MediaType.video);
      } else if (imageURL.pathname && imageURL.pathname.endsWith('.html')) {
        setDynamicType(MediaType.iFrame);
      } else if (imageURL.pathname && knownImageTypes.some((o) => imageURL.pathname.endsWith(o))) {
        setDynamicType(MediaType.image);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', transformedImage, true);

        xhr.onload = function () {
          const contentType = xhr.getResponseHeader('Content-Type');
          if (!contentType) {
            setDynamicType(MediaType.image);
            return;
          }

          const [mediaType, format] = contentType.split('/');
          let type = MediaType[mediaType as keyof typeof MediaType] ?? MediaType.image;
          if (type === MediaType.video) {
            if (!!thumbnail) {
              setVideoThumbNail(thumbnail);
            } else {
              setVideoThumbNail(makeThumb(transformedImage));
            }
          }
          if (format === 'gif') {
            setTransformedImage(ImageService.proxy.gifToMp4(imageURL.toString()));
            setVideoThumbNail(thumbnail ?? null);
            setDynamicType(MediaType.video);
          } else {
            setDynamicType(type);
          }
        };

        xhr.send();
      }
    } catch (e) {
      console.log('Unable to determine media type', e, image);
      setDynamicType(MediaType.image);
    }
  };

  return (
    <>
      {dynamicType && (
        <>
          {video || dynamicType === MediaType.video ? (
            <Video
              video={video ?? transformedImage}
              image={videoThumbnail ?? undefined}
              title={title}
              usePlaceholder={usePlaceholder}
              height={videoProps?.height}
              autoPlay={videoProps?.autoPlay}
              controls={videoProps?.controls}
              className={className}
              fallbackComponent={
                <AnyMedia
                  image={transformedImage}
                  title={title}
                  url={url}
                  newTab={newTab}
                  usePlaceholder={true}
                  videoProps={videoProps}
                  className={className}
                  layout={layout}
                  width={width}
                  height={height}
                  sizes={sizes}
                />
              }
            />
          ) : dynamicType === MediaType.iFrame ? (
            <IFrame url={image} />
          ) : url ? (
            <Link href={url} target={newTab ? '_blank' : '_self'}>
              <Image
                image={transformedImage}
                title={title}
                className={className}
                blur={blurImageUrl(transformedImage)}
                sizes={sizes}
                layout={layout}
                width={width}
                height={height}
              />
            </Link>
          ) : (
            <Image
              image={transformedImage}
              title={title}
              className={className}
              blur={blurImageUrl(transformedImage)}
              sizes={sizes}
              layout={layout}
              width={width}
              height={height}
            />
          )}
        </>
      )}
    </>
  );
};

export default memo(AnyMedia);

export interface ImageProps {
  image: string;
  title: string;
  className?: string;
  blur?: string;
  sizes?: string;
  layout?: 'responsive' | 'fill' | 'fixed' | 'intrinsic';
  width?: number;
  height?: number;
}

const Image = memo(({ image, title, className, blur, sizes, layout, width, height }: ImageProps) => {
  return (
    <CdnImage
      src={image ?? fallbackImageUrl()}
      alt={title}
      onError={({ currentTarget }: {currentTarget: any}) => {
        currentTarget.onerror = null;
        currentTarget.src = fallbackImageUrl();
      }}
      className={className}
      placeholder={blur ? 'blur' : 'empty'}
      blurDataURL={blur}
      layout={layout}
      sizes={sizes}
      width={width}
      height={height}
      unoptimized="true"
      objectFit="contain"
    />
  );
});

// VideoProps
export interface VideoProps {
  video: string;
  image?: string;
  title: string;
  usePlaceholder: boolean;
  height?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  fallbackComponent?: ReactNode;
}

const Video = memo(
  ({
    video,
    image,
    title,
    usePlaceholder,
    height = '100%',
    autoPlay = false,
    controls = true,
    className,
    fallbackComponent,
  }: VideoProps) => {
    const [failed, setFailed] = useState(false);

    return !failed ? (
      <ReactPlayer
        controls={controls}
        url={video}
        config={{
          file: {
            attributes: {
              onContextMenu: (e: any) => e.preventDefault(),
              controlsList: 'nodownload',
            },
          },
        }}
        muted={true}
        playing={usePlaceholder && image ? true : autoPlay}
        loop={true}
        light={usePlaceholder ? image : undefined}
        width="100%"
        height={height}
        className={className}
        playsinline={true}
        onError={(e) => {
          setFailed(true);
        }}
      />
    ) : (
      <>{fallbackComponent}</>
    );
  }
);

enum MediaType {
  image = 1,
  video,
  audio,
  iFrame,
}

const IFrame = memo(({ url }: {url: string}) => {
  return <iframe src={url} width="100%" height="100%" />;
});


interface MultimediaImageProps {
  source: string;
  fallbackSource?: string;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}
export const MultimediaImage = ({ source, fallbackSource, title, width = 1, height = 1, className }: MultimediaImageProps) => {
  const [image, setImage] = useState<string>(source);

  const determineMediaType = () => {
    if (!source || source.startsWith('data')) {
      setImage(source);
      return;
    }

    const knownImageTypes = ['.png', '.jpg', '.jpeg', 'webp'];

    try {
      const imageURL = new URL(source);
      //prefer mp4 over gif
      if (imageURL.pathname && imageURL.pathname.endsWith('.gif')) {
        setImage(source);
      } else if (imageURL.pathname && imageURL.pathname.endsWith('.html')) {
        //
      } else if (imageURL.pathname && knownImageTypes.some((o) => imageURL.pathname.endsWith(o))) {
        setImage(source);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', source, true);

        xhr.onload = function () {
          const contentType = xhr.getResponseHeader('Content-Type');
          if (!contentType) {
            setImage(source);
            return;
          }

          const [mediaType, format] = contentType.split('/');
          let type = MediaType[mediaType as keyof typeof MediaType] ?? MediaType.image;
          if (type === MediaType.video && !!fallbackSource) {
            setImage(fallbackSource);
          } else setImage(source);
        };

        xhr.send();
      }
    } catch (e) {
      console.log('Unable to determine media type', e, source);
      setImage(source);
    }
  };

  useEffect(() => {
    determineMediaType();
  }, [source, fallbackSource]);

  return image ? (
    <Image
      image={image}
      title={title}
      className={className}
      // blur={blurImageUrl(transformedImage)}
      // sizes={sizes}
      layout='responsive'
      width={width}
      height={height}
    />
  ) : (
    <></>
  )
};
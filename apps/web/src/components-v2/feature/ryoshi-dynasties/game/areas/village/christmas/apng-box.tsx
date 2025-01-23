import { Box, Image, Spinner } from "@chakra-ui/react";
import StaticAPNG from "@src/components-v2/shared/media/static-apng";
import { useEffect, useState } from "react";

interface APNGBoxProps {
  imageSrc: string;
  animate: boolean;
  loadingImage?: string;
  onLoad?: () => void;
}

const APNGBox: React.FC<APNGBoxProps> = ({ imageSrc, animate, loadingImage, onLoad }) => {
  const [srcWithCacheBuster, setSrcWithCacheBuster] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (animate) {
      const url = new URL(imageSrc, window.location.origin);
      url.searchParams.set("t", `${new Date().getTime()}`);
      setSrcWithCacheBuster(url.toString());
    } else {
      setSrcWithCacheBuster(null); // Reset when animation is not active
    }
  }, [imageSrc, animate]);

  const handleImageLoad = () => {
    if(onLoad) onLoad();
    setIsLoading(false);
  }
  const handleImageError = () => setIsLoading(false);

  return (
    <Box>
      {/* Show the loading image or spinner while the main image is loading */}
      {isLoading && (<>
        {loadingImage ? (
          <Image src={loadingImage} alt="Loading..." />
        ) : (
          <Spinner size="lg" color="gray.500" />
        )}
      </>
      )}

      {animate && srcWithCacheBuster ? (
        <Image
          key={srcWithCacheBuster}
          src={srcWithCacheBuster}
          alt="Animated APNG"
          onLoad={handleImageLoad}
          onError={handleImageError}
          display={isLoading ? "none" : "block"}
        />
      ) : (
        <StaticAPNG src={imageSrc} alt="Static APNG" />
      )}
    </Box>
  );
};




export default APNGBox;
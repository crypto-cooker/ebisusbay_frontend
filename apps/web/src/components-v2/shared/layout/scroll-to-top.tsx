import {useEffect, useState} from "react";
import {IconButton} from "@chakra-ui/react";
import {ArrowUpIcon} from "@chakra-ui/icons";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled upto given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <IconButton
      icon={<ArrowUpIcon />}
      isRound
      position="fixed"
      bottom={{base: "4rem", md: "2rem"}}
      right="2rem"
      onClick={scrollToTop}
      display={isVisible ? "flex" : "none"}
      aria-label="Scroll to top"
    />
  );
};

export default ScrollToTop;
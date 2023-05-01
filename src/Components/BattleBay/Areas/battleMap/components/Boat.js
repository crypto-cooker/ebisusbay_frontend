import { useState, useRef, useEffect } from "react";
import "../Boat.module.scss";

const Boat = () => {
  var img1 = '/img/battle-bay/ocean-1.jpg';
  var img2 = '/img/battle-bay/ocean-2.png';
  const images = [img1, img2];
  const [currentSlide, setCurrentSlide] = useState(0);

  let sliderInterval = useRef();
  let switchImages = () => {
    if (currentSlide < images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };
  useEffect(() => {
    console.log("useEffect boat component");
    sliderInterval = setInterval(() => {
      switchImages();
    }, 5000);
    return () => {
      clearInterval(sliderInterval);
    };
  });
  return (
    <div className="imgWrapper">
      {images.map((img, index) => {
        return (
          <img
            src={img}
            className={
              index === currentSlide ? "imageActive homeImage" : "image"
            }
          />
        );
      })}
    </div>
  );
};

export default Boat;
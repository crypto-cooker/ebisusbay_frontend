function setUpMapZooming(){
  element = document.getElementById('panzoom')
  panzoom = Panzoom(element, {
      contain: 'outside',
      startScale: 0.5,
      origin: '50% 50%', 
      pinchAndPan: true,
      maxScale: 3
  });

  parent = element.parentElement
  parent.addEventListener('wheel', panzoom.zoomWithWheel);
  parent.addEventListener('gesturestart', function(e) {
      console.log("gesture start");
      if(e.scale <1)
      {
          panzoom.zoom(0.9, { animate: false })
          console.log("zoom out");
      }
      else
      {
          panzoom.zoom(1.1, { animate: false })
          console.log("zoom in");
      }
  }, false);
  parent.addEventListener('gesturechange', function(e) {console.log("gesture change");}, false);

}

class ImageResize {
    /**
     * constructor - make image maps responsive
     * @param {Object} config - setting for responsive image map
     */
    constructor(config) {
      const { width, height, element } = config;
  
      this.imageW = width;
      this.imageH = height;
      this.imageMap = document.querySelector(element);
      const mapId = this.imageMap.getAttribute('usemap');
      const mapElem = `map[name="${mapId.substring(1, mapId.length)}"]`;
      const area = document.querySelector(mapElem).children;
      this.areaArray = Array.from(area);
  
      window.addEventListener('resize', this.resizeEvent);
      setTimeout(this.imgMap, 500);
    }
    /**
     * getCoords - get image map coordinates
     * @param  {Node} elem - area tag
     * @return {String} - area map coordinates
     */
    getCoordinates = (elem) => {
      let areaCords = elem.dataset.coords;
  
      if (!areaCords) {
        areaCords = elem.getAttribute('coords');
  
        elem.dataset.coords = areaCords;
      }
  
      return areaCords;
    };
    imgMap = () => {
      this.wPercent = this.imageMap.offsetWidth / 100;
      this.hPercent = this.imageMap.offsetHeight / 100;
  
      this.areaArray.forEach(this.areaLoop);
    };
    /**
     * areaLoop - Loop through area tags for image map
     * @param  {Node} area - Area tag
     */
    areaLoop = (area) => {
      const coordinates = this.getCoordinates(area).split(',');
      const coordsPercent = coordinates.map(this.mapCoords).join();
  
      area.setAttribute('coords', coordsPercent);
    };
    /**
     * mapCoords - Set new image map coordinates based on new image width and height
     * @param  {String} coordinate - coordinates from image map array
     * @param  {Num} index - Loop index
     * @return {Num} - New image map coordinates
     */
    mapCoords = (coordinate, index) => {
      const parseCord = parseInt(coordinate, 10);
  
      return index % 2 === 0
        ? this.coordinatesMath(parseCord, this.imageW, this.wPercent)
        : this.coordinatesMath(parseCord, this.imageH, this.hPercent);
    };
    /**
     * coordinatesMath Set new coordinates from original image map coordinates
     * @param  {number} coordinates - original image map coordinate
     * @param  {number} imgVal - Image width or height value
     * @param  {number} percentVal - New image width or height divided by 100
     * @return {number} - New image map coordinates
     */
    coordinatesMath = (coordinates, imgVal, percentVal) =>
      (coordinates / imgVal) * 100 * percentVal;
  
    /**
     * resizeEvent - Resize Event
     */
    resizeEvent = () => {
      this.imgMap();
    };
  }



  
// $('.maparea').maphilight({ 
//     fill: true,
//     fillColor: 'FFFFFF',
//     fillOpacity: 0.2,
  
//     stroke: true,
//     strokeColor: 'ff0000',
//     strokeOpacity: 1,
//     strokeWidth: 3,
  
//     // fade in the shapes on mouseover
//     fade: true,
//     // always show the hilighted areas
//     alwaysOn: false,
//     // never show the hilighted areas
//     neverOn: false,
  
//     groupBy: false,
//     wrapClass: false,
//     // apply a shadow to the shape
//     shadow: false,
//     shadowX: 0,
//     shadowY: 0,
//     shadowRadius: 6,
//     shadowColor: '000000',
//     shadowOpacity: 0.8,
//     // Can be 'outside', 'inside', or 'both'.
//     shadowPosition: 'outside',
//     // Can be 'stroke' or 'fill'
//     shadowFrom: false,
//   });


//   $('#image-map').mapster({
//     fillOpacity: 0.5,
//     render_highlight: {
//         fillColor: '2aff00',
//         stroke: true
//         // altImage: 'examples/images/usa_map_720_alt_4.jpg'
//     },
//     render_select: {
//         fillColor: 'ff000c',
//         stroke: false
//         // altImage: 'examples/images/usa_map_720_alt_5.jpg'
//     }//,
//     //fadeInterval: 50,
//     //mapKey: 'data-state',
// });
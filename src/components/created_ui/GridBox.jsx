import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const GridBox = ({ images }) => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="p-4">
      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={img}
              className="w-full h-40 object-cover hover:scale-105 transition"
            />
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({ src: img }))}
        plugins={[Zoom,
          //  Thumbnails
        ]}
        //         thumbnails={{
        //   position: "bottom",
        //   width: 90,
        //   height: 70,
        //   border: 2,
        //   imageFit: "cover",
        // }}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
      />
    </div>
  );
};

export default GridBox;
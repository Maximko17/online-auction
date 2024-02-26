"use client";

import { Lot } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Thumb } from "@/components/ui/carousel/EmblaCarouselThumbsButton";
import "@/components/ui/carousel/css/embla.css";

interface ILotImages {
  images: Lot["images"];
}
const imageByIndex = (
  index: number,
  images: Lot["images"],
): Lot["images"][number]["image"] => images[index % images.length].image;

export default function LotImages({ images }: ILotImages) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({});
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {images.map((_, i) => (
            <div className="embla__slide" key={i}>
              <Image
                width={740}
                height={500}
                className="embla__slide__img"
                src={`${process.env.NEXT_PUBLIC_S3_URL}/${imageByIndex(
                  i,
                  images,
                )}`}
                alt={images[0].image}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {images.map((image, i) => (
              <Thumb
                key={i}
                onClick={() => onThumbClick(i)}
                selected={i === selectedIndex}
                index={i}
                imgSrc={`${process.env.NEXT_PUBLIC_S3_URL}/${image.image}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

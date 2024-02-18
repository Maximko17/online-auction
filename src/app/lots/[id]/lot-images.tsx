"use client";

import EmblaCarousel from "@/components/ui/carousel/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = {};
const SLIDE_COUNT = 10;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function LotImages() {
  return <EmblaCarousel slides={SLIDES} options={OPTIONS} />;
}

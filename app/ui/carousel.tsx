/* eslint-disable @next/next/no-img-element */
'use client';
import { Carousel } from 'react-responsive-carousel';
import { CarouselProps } from '../lib/definitions';
import styles from './carousel.module.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import Image from 'next/image';

export default function CarouselUI({ photos }: CarouselProps) {
  if (!photos) {
    return null;
  }

  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      className={styles.Carousel}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <button
            onClick={onClickHandler}
            title={label}
            type="button"
            className={styles.PrevArrow}
          >
            <Image
              width={25}
              height={25}
              src="/carousel-left-arrow.svg"
              alt="Prev"
            />
          </button>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <button
            onClick={onClickHandler}
            title={label}
            type="button"
            className={styles.NextArrow}
          >
            <Image
              width={25}
              height={25}
              src="/carousel-right-arrow.svg"
              alt="Next"
            />
          </button>
        )
      }
    >
      {photos?.map((image, index) => (
        <div key={index}>
          <Image
            width={500}
            height={500}
            className={`h-full max-h-[250px] min-h-[200px] w-full max-w-[600px] object-cover sm:max-h-[350px] sm:max-w-[640px]`}
            src={image}
            alt="photo of the place that is being described"
          />
        </div>
      ))}
    </Carousel>
  );
}

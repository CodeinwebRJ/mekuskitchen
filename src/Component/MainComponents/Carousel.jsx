import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../../styles/Carousel.module.css";

const Carousel = () => {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
      >
        <SwiperSlide className={styles.slide}>
          <img
            src="https://cdn.pixabay.com/photo/2025/03/20/18/28/sunset-9483600_1280.jpg"
            alt="Slide 1"
          />
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <img
            src="https://cdn.pixabay.com/photo/2023/01/22/05/51/nature-7735653_1280.jpg"
            alt="Slide 2"
          />
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <img
            src="https://cdn.pixabay.com/photo/2024/12/28/13/28/tram-9296118_1280.jpg"
            alt="Slide 3"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;

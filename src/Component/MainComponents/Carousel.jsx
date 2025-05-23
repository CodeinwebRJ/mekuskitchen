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
          <img src="/banner1.jpg" alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <img src="/banner2.jpg" alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <img src="/banner3.jpg" alt="Slide 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import style from "../../styles/NewArrival.module.css";
import ReviewCard from "../Cards/Review";

const ReviewComponent = ({ data }) => {
  const products = Array.isArray(data?.TopReviews) ? data.TopReviews : [];
  const enableLoop = products.length >= 4;
  const enableAutoplay = products.length >= 4;
  return (
    <div className={style.wrapper}>
      <h2 className={style.newArrival}>
        <span>What our </span>
        <span className={style.blueText}>Customer </span>
        <span>says </span>
      </h2>

      {products.length === 0 ? (
        <p className={style.noProducts}>No new products available.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          loop={enableLoop}
          autoplay={
            enableAutoplay
              ? { delay: 2500, disableOnInteraction: false }
              : false
          }
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className={style.swiperContainer}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <ReviewCard index={index} product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
export default ReviewComponent;

import React from "react";
import style from "../../styles/RelatedProduct.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/bundle";
import RelatedProductCard from "../../UI/RelatedProductCard";
import { RelatedProductData } from "../../StaticData";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const RelatedProduct = () => {
  return (
    <div className={style.relatedProductContainer}>
      {/* Header */}
      <div className={style.relatedProductHeader}>
        <div className={style.relatedProductHeaderText}>
          <p>RELATED PRODUCTS</p>
        </div>
      </div>

      {/* Slider */}
      <div className={style.sliderWrapper}>
        <div className={`${style.customArrow} ${style.prevArrow}`}>
          <MdKeyboardDoubleArrowLeft className={style.prevArrowIcon} />
        </div>
        <Swiper
          navigation={{
            prevEl: `.${style.prevArrow}`,
            nextEl: `.${style.nextArrow}`,
          }}
          loop={true}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          pagination={false}
          freeMode={true}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            800: { slidesPerView: 3 },
            1110: { slidesPerView: 4 },
          }}
        >
          {RelatedProductData.map((card, index) => (
            <SwiperSlide key={index}>
              <div className={style.relatedProductCard}>
                <RelatedProductCard item={card} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={`${style.customArrow} ${style.nextArrow}`}>
          <MdKeyboardDoubleArrowLeft className={style.nextArrowIcon} />
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;

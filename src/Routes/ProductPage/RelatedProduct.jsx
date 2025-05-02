import React, { useEffect, useState } from "react";
import style from "../../styles/RelatedProduct.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/bundle";
import RelatedProductCard from "../../Component/Cards/RelatedProductCard";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { getRelatedProduct } from "../../axiosConfig/AxiosConfig";
import Heading from "../../Component/UI-Components/Heading";

const RelatedProduct = () => {
  const { pathname } = useLocation();
  const category = pathname.split("/").filter((segment) => segment);

  const [relatedProduct, setRelatedProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const data = {
        category: category[1],
      };
      const res = await getRelatedProduct(data);
      setRelatedProduct(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className={style.relatedProductContainer}>
      <Heading title="RELATED PRODUCTS" size="xs" />
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
          {relatedProduct?.map((card, index) => (
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

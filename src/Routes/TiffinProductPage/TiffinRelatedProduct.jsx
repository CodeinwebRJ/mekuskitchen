import { useEffect, useState } from "react";
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

const TiffinRelatedProduct = () => {
  const { pathname } = useLocation();
  const category = pathname.split("/").filter((segment) => segment);
  const [relatedProduct, setRelatedProduct] = useState([]);

  const fetchProduct = async () => {
    try {
      const data = {
        category: category[1],
      };
      const res = await getRelatedProduct(data);
      setRelatedProduct(res.data.data || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [category[1]]);

  const productCount = relatedProduct.length;
  const showSlider = productCount > 4;
  const showArrows = productCount > 4;
  const enableLoop = productCount > 4;
  const enableAutoplay = productCount > 4;
  const getSlidesPerView = () => Math.min(productCount, 4);

  return (
    <div className={style.relatedProductContainer}>
      <Heading title="RELATED PRODUCTS" size="xs" />

      {productCount === 0 ? (
        <p>No related products available.</p>
      ) : showSlider ? (
        <div className={style.sliderWrapper}>
          {showArrows && (
            <div
              className={`${style.customArrow} ${style.prevArrow}`}
              aria-label="Previous slide"
            >
              <MdKeyboardDoubleArrowLeft className={style.prevArrowIcon} />
            </div>
          )}

          <Swiper
            navigation={
              showArrows && {
                prevEl: `.${style.prevArrow}`,
                nextEl: `.${style.nextArrow}`,
              }
            }
            loop={enableLoop}
            autoplay={
              enableAutoplay
                ? {
                    delay: 1500,
                    disableOnInteraction: false,
                  }
                : false
            }
            pagination={false}
            freeMode={true}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={getSlidesPerView()}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: Math.min(2, productCount) },
              768: { slidesPerView: Math.min(3, productCount) },
              1110: { slidesPerView: Math.min(4, productCount) },
            }}
          >
            {relatedProduct.map((card, index) => (
              <SwiperSlide key={index}>
                <div className={style.relatedProductCard}>
                  <RelatedProductCard item={card} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {showArrows && (
            <div
              className={`${style.customArrow} ${style.nextArrow}`}
              aria-label="Next slide"
            >
              <MdKeyboardDoubleArrowLeft className={style.nextArrowIcon} />
            </div>
          )}
        </div>
      ) : (
        <div className={style.gridWrapper}>
          {relatedProduct.map((card, index) => (
            <div key={index} className={style.relatedProductCard}>
              <RelatedProductCard item={card} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TiffinRelatedProduct;

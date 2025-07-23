import { useEffect, useRef, useState } from "react";
import style from "../../styles/RelatedProduct.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import RelatedProductCard from "../../Component/Cards/RelatedProductCard";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { getRelatedProduct } from "../../axiosConfig/AxiosConfig";
import Heading from "../../Component/UI-Components/Heading";

const RelatedProduct = () => {
  const { pathname } = useLocation();
  const category = pathname.split("/").filter((segment) => segment);
  const [relatedProduct, setRelatedProduct] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const fetchProduct = async () => {
    try {
      const data = { category: category[1] };
      const res = await getRelatedProduct(data);
      setRelatedProduct(res.data.data || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [category[1]]);

  // 🔁 Setup navigation after refs are mounted
  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      prevRef.current &&
      nextRef.current
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.destroy(); // cleanup previous
      swiperRef.current.navigation.init(); // re-init
      swiperRef.current.navigation.update(); // ensure buttons work
    }
  }, [relatedProduct]);

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
          {/* Prev Arrow */}
          <div
            className={`${style.customArrow} ${style.prevArrow}`}
            aria-label="Previous slide"
            ref={prevRef}
          >
            <MdKeyboardDoubleArrowLeft className={style.arrowIcon} />
          </div>

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper; // ✅ save instance
            }}
            loop={enableLoop}
            autoplay={
              enableAutoplay
                ? {
                    delay: 2000,
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
              1160: { slidesPerView: Math.min(4, productCount) },
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

          {/* Next Arrow */}
          <div
            className={`${style.customArrow} ${style.nextArrow}`}
            aria-label="Next slide"
            ref={nextRef}
          >
            <MdKeyboardDoubleArrowLeft
              className={style.arrowIcon}
              style={{ transform: "rotate(180deg)" }}
            />
          </div>
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

export default RelatedProduct;

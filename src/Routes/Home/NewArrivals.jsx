import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { HomeProductCard } from "../../Component/Cards/HomeProductCard";
import style from "../../styles/NewArrival.module.css";

const NewArrivals = () => {
  const PRODUCTS = [
    {
      id: "product-1",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-2",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-3",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-4",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-4",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-4",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
    {
      id: "product-4",
      image:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      title: "Cheese Vada Pav Special",
      subtitle: "Meku’s",
      price: "15.00",
      alt: "Cheese Vada Pav Special from Meku’s",
    },
  ];

  return (
    <div className={style.container}>
      <h2 className={style.newArrival}>
        <span className={style.blueText}>New </span>
        <span>Arrival</span>
      </h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={PRODUCTS.length > 1}
        freeMode={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: Math.min(1, PRODUCTS.length) },
          768: { slidesPerView: Math.min(2, PRODUCTS.length) },
          800: { slidesPerView: Math.min(3, PRODUCTS.length) },
          1110: { slidesPerView: Math.min(4, PRODUCTS.length) },
        }}
      >
        {PRODUCTS.map((product) => (
          <SwiperSlide className={style.container} key={product.id}>
            <HomeProductCard
              image={product.image}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              alt={product.alt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewArrivals;

import AddToCartButton from "../../Component/Buttons/AddToCartButton";
import Carousel from "../../Component/MainComponents/Carousel";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/HomePage.module.css";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
  },
  {
    id: 2,
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
  },
  {
    id: 3,
    name: "Home & Decor",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
  },
];

const products = [
  {
    id: 1,
    name: "Smartphone X",
    price: 599,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 199,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },
  {
    id: 3,
    name: "Designer Jacket",
    price: 129,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 249,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: 5,
    name: "Laptop Pro",
    price: 999,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <Carousel />

      {/* Categories Section */}
      <div className={style.section}>
        <div className={style.container}>
          <h2 className={style.sectionTitle}>Explore Categories</h2>
          <div className={style.categoryGrid}>
            {categories.map((category) => (
              <div key={category.id} className={style.categoryItem}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={style.categoryItemImg}
                />
                <div>
                  <h5 className={style.productTitle}>{category.name}</h5>
                  <p>
                    Browse our curated {category.name.toLowerCase()} collection
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className={style.sectionAlt}>
        <div className={style.container}>
          <h2 className={style.sectionTitle}>New Arrivals</h2>
          <div className={style.productGrid}>
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className={style.productItem}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={style.productItemImg}
                />
                <h5 className={style.productTitle}>{product.name}</h5>
                <p className="price">${product.price}</p>
                <AddToCartButton onClick={() => addToCart(product)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Products Section */}
      <div className={style.section}>
        <div className={style.container}>
          <h2 className={style.sectionTitle}>Our Products</h2>
          <div className={style.productGrid}>
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className={style.productItem}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={style.productItemImg}
                />
                <h5 className={style.productTitle}>{product.name}</h5>
                <p className="price">${product.price}</p>
                <AddToCartButton onClick={() => addToCart(product)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={style.sectionAlt}>
        <div className={style.container}>
          <h2 className={style.sectionTitle}>Best Sellers</h2>
          <div className={style.sectionTitleAfter}></div>
          <div className={style.productGrid}>
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className={style.productItem}
                onMouseOver={(e) =>
                  Object.assign(e.currentTarget.style, style.productItemHover)
                }
                onMouseOut={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "scale(1)",
                    opacity: "1",
                  })
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={style.productItemImg}
                />
                <h5 className={style.productTitle}>{product.name}</h5>
                <p className="price">${product.price}</p>
                <AddToCartButton onClick={() => addToCart(product)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import style from "../../styles/ContactPage.module.css";
import Footer from "../../Component/Footer";
import Banner from "../../Component/Banner";
import InputField from "../../UI/InputField";
import SelectField from "../../UI/SelectField";
import Button from "../../UI/Button";
import Header from "../../component/Header";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    menu: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Simple validation
    if (name === "name" && !formData.name) {
      setErrors({
        ...errors,
        name: "Name is required",
      });
    } else if (name === "email" && !formData.email) {
      setErrors({
        ...errors,
        email: "Email is required",
      });
    } else if (
      name === "email" &&
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      setErrors({
        ...errors,
        email: "Email is invalid",
      });
    } else if (name === "phone" && !formData.phone) {
      setErrors({
        ...errors,
        phone: "Phone number is required",
      });
    } else if (
      name === "phone" &&
      formData.phone &&
      !/^\d{10}$/.test(formData.phone)
    ) {
      setErrors({
        ...errors,
        phone: "Phone number must be 10 digits",
      });
    } else if (name === "menu" && !formData.menu) {
      setErrors({
        ...errors,
        menu: "Menu is required",
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.menu) newErrors.menu = "Menu is required";
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      menu: true,
      message: true,
    });

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        menu: "",
        message: "",
      });
    }
  };

  // Sample options for the phone country code select field
  const countryCodeOptions = [
    { value: "Vada Pav", label: "Vada Pav" },
    { value: "Pav Bhaji", label: "Pav Bhaji" },
    { value: "Pizza", label: "Pizza" },
    { value: "Burger", label: "Burger" },
    { value: "Sandwich", label: "Sandwich" },
    { value: "Desserts", label: "Desserts" },
  ];

  return (
    <div>
      <Header />

      {/* banner */}
      <Banner name={"Contact us"} />

      {/* contact container */}
      <div className={style.ContactContainer}>
        <div className={style.ContactContainer2}>
          {/* left container */}
          <div className={style.leftContainer}>
            <div className={style.leftContainerTitlecontainer}>
              <h1 className={style.leftContainerTitle}>
                Get in{" "}
                <span className={style.leftContainerTitleSpan}>Touch</span>
              </h1>
            </div>

            <p className={style.leftContainerDescription}>
              Have questions or special requests? We're here to assist you.
              Contact us for reservations, event inquiries, or any other
              information you may need. We look forward to hearing from you!
            </p>

            <div className={style.leftContainerContact}>
              <button className={style.leftContainerTelephonetButton}>
                <img src="/telephone.png" alt="phone icon" />
              </button>
              <span className={style.leftContainerContactNumber}>
                +91-6723774949
              </span>
            </div>

            <div className={style.leftContainerMail}>
              <button className={style.leftContainerMailButton}>
                <img src="/email.png" alt="email icon" />
              </button>

              <span className={style.leftContainerMailNumber}>
                et.world@gmail.com
              </span>
            </div>

            <div className={style.leftContainerSocialMedia}>
              <button className={style.leftContainerSocialMediaButton}>
                <img src="/facebook.png" alt="facebook icon" />
              </button>

              <button className={style.leftContainerSocialMediaButton}>
                <img src="/instagram.png" alt="instagram icon" />
              </button>
            </div>
          </div>

          {/* right container */}
          <div className={style.rightContainer}>
            <div className={style.rightContainerTitlecontainer}>
              <h1 className={style.rightContainerTitle}>
                Contact Us For Any{" "}
                <span className={style.rightContainerTitleSpan}>Questions</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className={style.rightContainerForm}>
              <div className={style.nameEmailContainer}>
                <InputField
                  label={true}
                  labelName="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  touched={touched.name}
                />
                <InputField
                  label={true}
                  labelName="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                />
              </div>

              <div className={style.phoneMenusContainer}>
                <InputField
                  label={true}
                  labelName="Phone Number"
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  touched={touched.phone}
                />
                <SelectField
                  label={true}
                  labelName="Menus"
                  name="menu"
                  value={formData.menu || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.menu}
                  touched={touched.menu}
                  options={countryCodeOptions}
                  placeholder="Select a Menu"
                />
              </div>

              <div className={style.messageContainer}>
                <label className={style.label} htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={style.textarea}
                  rows="5"
                ></textarea>
                {errors.message && touched.message && (
                  <div className={style.errorMessage}>{errors.message}</div>
                )}
              </div>

              <div className={style.submitButtonContainer}>
                <Button type="submit" onClick={handleSubmit}>
                  Ask A Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

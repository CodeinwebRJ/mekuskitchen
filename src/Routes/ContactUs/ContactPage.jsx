import React, { useState } from "react";
import style from "../../styles/ContactPage.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import InputField from "../../Component/UI-Components/InputField";
import Button from "../../Component/Buttons/Button";
import Header from "../../Component/MainComponents/Header";
import { SendQuestions } from "../../axiosConfig/AxiosConfig";
import { useSelector } from "react-redux";
import Heading from "../../Component/UI-Components/Heading";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const User = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    const data = {
      userId: User.userid,
      ...formData,
    };
    const res = await SendQuestions(data);

    if (Object.keys(newErrors).length === 0) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        menu: "",
        message: "",
      });
    }
  };

  return (
    <div>
      <Header />
      <Banner name={"Contact us"} />
      <div className={style.ContactContainer}>
        <div className={style.ContactContainer2}>
          <div className={style.leftContainer}>
            <Heading title=" Get in" titleColor="Touch" />

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

          <div className={style.rightContainer}>
            <Heading title="Contact Us For Any" titleColor="Questions" />

            <form onSubmit={handleSubmit} className={style.rightContainerForm}>
              <div className={style.formFieldsColumn2}>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Your Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formData.name === "" && errors.name && (
                    <div className="errorMessage">{errors.name}</div>
                  )}
                </div>

                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Your Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formData.email === "" && errors.email && (
                    <div className="errorMessage">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className={style.formFieldsColumn1}>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Phone Number"
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {formData.phone === "" && errors.phone && (
                    <div className="errorMessage">{errors.phone}</div>
                  )}
                </div>
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
                  className={style.textarea}
                  rows="5"
                ></textarea>
                {formData.message === "" && errors.message && (
                  <div className="errorMessage">{errors.message}</div>
                )}
              </div>

              <div className={style.submitButtonContainer}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  variant="primary"
                  size="md"
                >
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

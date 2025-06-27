import { useEffect, useRef } from "react";

const CanadaPostAddressInput = ({ onAddressSelect }) => {
  const inputRef = useRef();

  const canada_key = import.meta.env.VITE_CANADA_POST_KEY;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://api.addresscomplete.com/js/addresscomplete-2.30.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pca) {
        new window.pca.AddressComplete(inputRef.current, {
          key: canada_key,
          culture: "en",
          countries: "CA",
        }).on("populate", (address) => {
          onAddressSelect?.({
            street: address.Line1,
            city: address.City,
            province: address.ProvinceCode,
            postalCode: address.PostalCode,
            fullAddress: address.Label,
          });
        });
      }
    };
    document.body.appendChild(script);
  }, [canada_key]);

  return (
    <input ref={inputRef} placeholder="Address" className="form-control" />
  );
};

export default CanadaPostAddressInput;

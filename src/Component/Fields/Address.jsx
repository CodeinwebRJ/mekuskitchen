import { useEffect, useRef } from "react";

const AddressAutocomplete = ({ onPlaceSelect }) => {
  const inputRef = useRef();

  const google_key = import.meta.env.VITE_GOOGLE_KEY;

  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode", "establishment"], // all address + buildings
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${google_key}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Address"
      className="form-control"
    />
  );
};

export default AddressAutocomplete;

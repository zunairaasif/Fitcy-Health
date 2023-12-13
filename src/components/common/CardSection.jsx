import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
// import "./Styles.css";

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "rgba(158, 158, 158, 1)",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
function CardSection() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />;
}
export default CardSection;

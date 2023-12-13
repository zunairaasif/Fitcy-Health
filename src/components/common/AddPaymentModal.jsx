import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Box, Layer } from "grommet";
import { delay } from "lodash";
// import { delay } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
// import { useEffect } from "react";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearSetupIntent } from "../../redux/patient/patientSlice";
import {
  getCardDetails,
  getRandomSetupIntent,
} from "../../redux/patient/patientThunks";
import CardSection from "./CardSection";
import Loader from "./Loader";
// import { getMe } from "../../redux/app/appThunks";

const PaymentStep = ({ setDisplayOut }) => {
  const [loading, setLoading] = useState();
  const stripe = useStripe();
  const user = useSelector((state) => state.app.user);

  const setupIntent = useSelector((state) => state.patient.setup_intent);

  const elements = useElements();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!setupIntent) dispatch(getRandomSetupIntent());
  }, []);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const result = await stripe.confirmCardSetup(
      setupIntent.setup_intent.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
        expand: ["payment_method"],
      }
    );

    if (result.error) {
      toast.error(result.error.message);
    } else {
      delay(() => {
        dispatch(getCardDetails({ user_id: user.id }));
        setDisplayOut(false);
        dispatch(clearSetupIntent());
        toast.success("Payment method added");
      }, 4000);
    }
  };

  if (!setupIntent)
    return (
      <Box align="center">
        <Loader />
      </Box>
    );

  return (
    <Box pad="small" gap="small">
      <CardSection />
      <button
        fill={false}
        alignSelf="end"
        style={
          {
            // width: "30%",
            // padding: "5px 5px",
            // backgroundColor: "#395E9D",
            // color: "white",
            // borderRadius: "8px",
          }
        }
        plain
        disabled={!stripe || loading}
        onClick={() => handleSubmit()}
        size="small"
        className="primary-btn"
      >
        {loading ? (
          <Box width="100%" alignSelf="center" align="center">
            <TailSpin height={20} color="white" />
          </Box>
        ) : (
          "Proceed"
        )}
      </button>
    </Box>
  );
};

const AddPaymentModal = ({ setDisplayOut }) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  if (!stripePromise)
    return (
      <Layer
        onClickOutside={() => setDisplayOut(false)}
        plain
        onEsc={() => setDisplayOut(false)}
        style={{ minWidth: "40%", maxWidth: "80%", maxHeight: "80%" }}
      >
        <Box
          background="white"
          pad="medium"
          margin="xsmall"
          style={{
            boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            fontSize: "small",
          }}
          round="8px"
          gap="small"
          justify="center"
        >
          {" "}
          <ThreeDots color="black" />{" "}
        </Box>
      </Layer>
    );

  return (
    <>
      <Layer
        onClickOutside={() => setDisplayOut(false)}
        plain
        onEsc={() => setDisplayOut(false)}
        style={{ minWidth: "40%", maxWidth: "80%", maxHeight: "80%" }}
      >
        <Box
          background="white"
          pad="medium"
          margin="xsmall"
          style={{
            boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            fontSize: "small",
          }}
          round="8px"
          gap="small"
          justify="between"
        >
          <Elements stripe={stripePromise}>
            <PaymentStep setDisplayOut={setDisplayOut} />
          </Elements>
        </Box>
      </Layer>
    </>
  );
};

export default AddPaymentModal;

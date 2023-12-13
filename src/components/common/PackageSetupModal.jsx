import React from "react";
import { Box, Layer, Text } from "grommet";
import { useState } from "react";
import { Checkmark, FormDown, Info } from "grommet-icons";
import {
  applyCoupon,
  createPayment,
} from "../../redux/onboarding/onboardingThunks";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import { loadStripe } from "@stripe/stripe-js";
import CardSection from "./CardSection";
import noAvatar from "../../assets/noAvatar.jpeg";
import { getMe } from "../../redux/app/appThunks";
import { getCardDetails } from "../../redux/patient/patientThunks";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { delay } from "lodash";

const PaymentStep = ({ setDisplayOut }) => {
  const user = useSelector((state) => state.app.user);

  const [loading, setLoading] = useState();

  const [coupon, setCoupon] = useState("");
  const dispatch = useDispatch();
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [showAppointment, setShowAppointment] = useState(true);

  const stripe = useStripe();

  const paymentPackage = useSelector((state) => state.onboarding.payment);
  const selectedTherapist = user.current_therapist;
  const elements = useElements();

  const handleSubmit = async () => {
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardSetup(
      paymentPackage.setup_intent.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
        expand: ["payment_method"],
      }
    );

    if (result.error) {
      toast(result.error.message);
    } else {
      delay(() => {
        dispatch(getCardDetails({ user_id: user.id }));

        dispatch(getMe());
        setDisplayOut(false);
        toast("Saved successfully");
        setLoading(false);
      }, 4000);
    }
  };

  const handleCoupon = () => {
    dispatch(
      applyCoupon({ payment_id: paymentPackage.payment.id, code: coupon })
    );
    setCoupon("");
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  if (!paymentPackage || !selectedTherapist)
    return <ThreeDots color="black" height={80} width={80} />;

  return (
    <Box pad="small">
      <div className="box-row-column-on-mobile">
        <div className="box-column checkout-expand">
          <Box
            width={isTabletOrMobile ? "100%" : null}
            className="checkout-box"
          >
            <Box
              direction="row"
              align="center"
              justify="between"
              className="noOutline"
            >
              <Text size="small" weight="bold" className="ptFont">
                Payment Method
              </Text>
              {isTabletOrMobile ? (
                <FormDown
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                />
              ) : null}
            </Box>
            {showPaymentForm ? (
              <>
                <button className="selection-radio">Credit/Debit Card</button>
                <CardSection />
                <div className="infoDisclaimer">
                  {" "}
                  <Info />
                  <div>
                    In case of monthly package, payment will be deducted each
                    month on the booking date
                  </div>
                </div>
              </>
            ) : null}
          </Box>
        </div>
        <Box
          style={{ width: !isTabletOrMobile ? "40%" : null }}
          className="box-column"
        >
          <div className="checkout-box">
            <Box
              direction="row"
              align="center"
              justify="between"
              className="noOutline"
            >
              <Text size="small" weight="bold" className="ptFont">
                Appointment Details
              </Text>

              {isTabletOrMobile ? (
                <FormDown
                  onClick={() => setShowAppointment(!showAppointment)}
                />
              ) : null}
            </Box>
            {showAppointment ? (
              <>
                <label className="defaultLabel">
                  Selected plan and therapist
                </label>
                <div className="appointment-box">
                  <div
                    style={{
                      backgroundColor: "rgba(225, 245, 254, 1)",
                      padding: "10px 10px",
                      borderRadius: "8px 8px 0px 0px",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(63, 81, 181, 1)",
                        fontWeight: "bold",
                        margin: "0",
                        textTransform: "capitalize",
                      }}
                    >
                      {String(paymentPackage.package.type).toLowerCase()}{" "}
                      Package (Includes{" "}
                      {paymentPackage.package.type === "MONTHLY" ? 4 : 1}{" "}
                      Sessions)
                    </p>
                  </div>
                  <div
                    className="box-row"
                    style={{ padding: "10px 10px", alignItems: "center" }}
                  >
                    <div>
                      <img
                        style={{ borderRadius: "8px" }}
                        src={
                          selectedTherapist.dp ? selectedTherapist.dp : noAvatar
                        }
                        alt="noImagePlaceholder"
                        // width={55}
                        height={50}
                      />
                    </div>
                    <div className="box-column-nogap">
                      <p
                        style={{
                          margin: "0",
                          fontSize: "small",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTherapist.first_name}{" "}
                        {selectedTherapist.last_name}
                      </p>
                      <p style={{ margin: "0", fontSize: "small" }}>
                        {selectedTherapist.designation}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="box-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="labelInputSet">
                    <label className="defaultLabel">Apply Coupon</label>

                    <div className="box-row">
                      <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        className="defaultInput"
                        value={coupon}
                        onChange={(value) => setCoupon(value.target.value)}
                      />

                      <button
                        onClick={() => handleCoupon()}
                        size="small"
                        className="secondary-btn"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="box-column-nogap">
                  {paymentPackage.payment.coupon ? (
                    <div
                      className="box-row"
                      style={{ justifyContent: "space-between", margin: "0" }}
                    >
                      <p>
                        Discount Amount ({paymentPackage.payment.coupon.code})
                      </p>

                      <p
                        style={{
                          color: "rgba(39, 75, 40, 1)",
                          fontWeight: "bolder",
                          fontSize: "normal",
                        }}
                      >
                        {(
                          paymentPackage.payment.package.price -
                          paymentPackage.payment.discounted_price
                        ).toFixed(2)}
                      </p>
                    </div>
                  ) : null}
                  {paymentPackage.payment.s_coupon ? (
                    <div
                      className="box-row"
                      style={{ justifyContent: "space-between", margin: "0" }}
                    >
                      <p>
                        Discount Amount ({paymentPackage.payment.s_coupon.id})
                      </p>

                      <p
                        style={{
                          color: "rgba(39, 75, 40, 1)",
                          fontWeight: "bolder",
                          fontSize: "normal",
                        }}
                      >
                        {(
                          paymentPackage.payment.package.price -
                          paymentPackage.payment.discounted_price
                        ).toFixed(2)}
                      </p>
                    </div>
                  ) : null}
                  <div
                    className="box-row"
                    style={{ justifyContent: "space-between", margin: "0" }}
                  >
                    <p>Total Amount</p>

                    <p
                      style={{
                        color: "rgba(39, 75, 40, 1)",
                        fontWeight: "bolder",
                        fontSize: "large",
                      }}
                    >
                      USD {paymentPackage.payment.discounted_price}
                    </p>
                  </div>
                </div>
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
              </>
            ) : null}
          </div>
        </Box>
      </div>
    </Box>
  );
};

const PackageSetupModal = ({ user, options, setDisplayOut }) => {
  const [packageSelected, setPackage] = useState("MONTHLY");
  const [showMB, setShowMB] = useState(false);
  const [showCS, setShowCS] = useState(false);
  const [internalStep, setInternalStep] = useState(1);
  const dispatch = useDispatch();

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  const getCurrentPackage = () => {
    const currentPackage = options.find((x) => x.type === packageSelected);

    return currentPackage;
  };

  const goToNextStep = () => {
    window.localStorage.setItem(
      "fitcy_onboarding_package_id",
      getCurrentPackage().id
    );
    window.localStorage.setItem(
      "fitcy_onboarding_therapist_id",
      user.current_therapist.id
    );
    dispatch(
      createPayment({
        package_id: getCurrentPackage().id,
      })
    );

    setInternalStep(2);
  };
  return (
    <>
      {showMB && (
        <Layer
          onClickOutside={() => setShowMB(false)}
          onEsc={() => setShowMB(false)}
        >
          <Box pad="small">
            If you are not satisfied with your package, we will refund the full
            amount within 30 days from the date of purchase.
          </Box>
        </Layer>
      )}
      {showCS && (
        <Layer
          onClickOutside={() => setShowCS(false)}
          onEsc={() => setShowCS(false)}
        >
          <Box pad="small">
            We&apos;ll work with you as your trusted friend & confidante to help
            you with any difficulties that may arise. We promise to try our best
            to go over & above what you would expect from us.
          </Box>
        </Layer>
      )}
      <Layer
        onClickOutside={() => setDisplayOut(false)}
        plain
        style={{ minWidth: "60%", maxWidth: "100%", maxHeight: "95%" }}
      >
        <Box
          background="white"
          pad="medium"
          margin="xsmall"
          style={{
            boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            fontSize: "small",
            overflowY: "auto",
          }}
          round="8px"
          gap="small"
          justify="between"
        >
          {internalStep === 1 ? (
            <>
              <div className="box-column">
                <p
                  style={{
                    color: "rgba(117, 117, 117, 1)",
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                  Select desired package option
                </p>
                <p style={{ color: "#000", margin: 0 }}>
                  We recommend choosing the Monthly Subscription because your
                  mental health requires consistency. Our industry-leading{" "}
                  <span
                    onClick={() => setShowMB(true)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontStyle: "italic",
                      color: "#5f84a2",
                      textDecoration: "underline",
                    }}
                  >
                    money-back guarantee
                  </span>{" "}
                  & intense dedication to{" "}
                  <span
                    onClick={() => setShowCS(true)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontStyle: "italic",
                      color: "#5f84a2",
                      textDecoration: "underline",
                    }}
                  >
                    customer service
                  </span>{" "}
                  means you can stay assured with your purchase.
                </p>
                <div className="box-row">
                  <div
                    className={
                      packageSelected === "MONTHLY"
                        ? "selected-package"
                        : "unselected-package"
                    }
                    onClick={() =>
                      internalStep === 2 ? null : setPackage("MONTHLY")
                    }
                  >
                    <div
                      className={
                        packageSelected === "MONTHLY"
                          ? "selected-package-ring"
                          : "unselected-package-ring"
                      }
                    ></div>
                    Monthly Subscription
                  </div>
                  <div
                    className={
                      packageSelected === "ONETIME"
                        ? "selected-package"
                        : "unselected-package"
                    }
                    onClick={() =>
                      internalStep === 2 ? null : setPackage("ONETIME")
                    }
                  >
                    <div
                      className={
                        packageSelected === "ONETIME"
                          ? "selected-package-ring"
                          : "unselected-package-ring"
                      }
                    ></div>
                    Single Session
                  </div>
                </div>
                <p style={{ color: "#000", margin: 0, fontWeight: "bold" }}>
                  USD {getCurrentPackage().price}
                </p>
                {packageSelected === "MONTHLY" ? (
                  <p style={{ color: "#000", margin: 0 }}>
                    Includes <b>4</b> sessions (
                    <b>USD {getCurrentPackage().price / 4}</b>/ Per Session){" "}
                  </p>
                ) : null}
                {packageSelected === "ONETIME" ? (
                  <p style={{ color: "#000", margin: 0 }}>
                    Includes <b>1</b> session{" "}
                  </p>
                ) : null}
              </div>
              <button
                style={{ marginBottom: "10px" }}
                onClick={() => goToNextStep()}
                className={
                  internalStep === 1 ? "primary-btn w-100" : "white-btn w-100"
                }
                disabled={internalStep === 2}
              >
                {internalStep === 2 ? (
                  <span className="box-row center-align">
                    {" "}
                    <Checkmark color="white" size="small" />{" "}
                    <div>Confirmed</div>
                  </span>
                ) : (
                  "Proceed to payment"
                )}
              </button>
            </>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentStep setDisplayOut={setDisplayOut} />
            </Elements>
          )}
        </Box>
      </Layer>
    </>
  );
};

export default PackageSetupModal;

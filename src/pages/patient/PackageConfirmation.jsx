import React from "react";
import { useState } from "react";
import Header from "../../components/common/Header";
// import WelcomeImage from "../../assets/onboarding/welcome.svg";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import {
  applyCoupon,
  createPayment,
  getPaymentStatus,
  getQuestionnaire,
} from "../../redux/onboarding/onboardingThunks";
import Loader from "../../components/common/Loader";
import { TailSpin } from "react-loader-spinner";
import CardSection from "../../components/common/CardSection";
import { toast } from "react-toastify";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { setTherapist } from "../../redux/onboarding/onboardingSlice";
import noAvatar from "../../assets/noAvatar.jpeg";
import tickMark from "../../assets/tickMark.png";
import crossMark from "../../assets/cross.png";
import { Box, Grommet, Spinner, Text } from "grommet";

import iIcon from "../../assets/information-outline.png";
import { FormDown } from "grommet-icons";
import { delay } from "lodash";
import {
  getMeEasy,
  scheduleNewAppointmentAdmin,
} from "../../redux/app/appThunks";
import { autoChangeSub } from "../../redux/patient/patientThunks";
import Switch from "@mui/material/Switch";

const PaymentStep = ({ setStep, checked, setChecked }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [loading, setLoading] = useState();
  const [isloading, setIsloading] = useState();

  const [coupon, setCoupon] = useState("");
  const dispatch = useDispatch();
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [showAppointment, setShowAppointment] = useState(
    isTabletOrMobile ? false : true
  );

  const stripe = useStripe();

  const paymentPackage = useSelector((state) => state.onboarding.payment);
  const selectedTherapist = useSelector(
    (state) => state.onboarding.selected_therapist
  );

  useEffect(() => {
    localStorage.setItem("Checked", checked);
  }, []);

  const handleChange = (event) => {
    if (checked === false) {
      setChecked(event.target.checked);
      localStorage.setItem("Checked", event.target.checked);
      dispatch(
        autoChangeSub({
          auto_charge: true,
        })
      );
      console.log("Value is", event.target.checked);
    } else {
      setChecked(event.target.checked);
      localStorage.setItem("Checked", event.target.checked);
      dispatch(
        autoChangeSub({
          auto_charge: false,
        })
      );
      console.log("Value is", event.target.checked);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("from-guided-journey")) {
      dispatch(
        createPayment({
          package_id: window.localStorage.getItem(
            "fitcy_onboarding_package_id"
          ),
          therapist_id: window.localStorage.getItem(
            "fitcy_onboarding_therapist_id"
          ),
        })
      );
      dispatch(
        setTherapist(
          JSON.parse(window.localStorage.getItem("guided-selected-therapist"))
        )
      );
    }
    dispatch(autoChangeSub({ auto_charge: checked }));
    console.log("auto-charge", checked);
  }, []);

  useEffect(() => {
    delay(() => {
      dispatch(autoChangeSub({ auto_charge: checked }));
      console.log("auto-charge", checked);
    }, 2000);
  }, []);

  const elements = useElements();

  const handleSubmit = async () => {
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);

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
      setLoading(false);
    } else {
      delay(() => {
        setStep(5);
        setLoading(false);
      }, 1000);
    }
  };

  const handleCoupon = () => {
    setIsloading(true);
    dispatch(
      applyCoupon({ payment_id: paymentPackage.payment.id, code: coupon })
    );
    setCoupon("");

    delay(() => {
      setIsloading(false);
    }, 2000);
  };

  if (!paymentPackage || !selectedTherapist) return <Loader />;

  return (
    <Grommet>
      <Box pad="small" width="100vw">
        <div
          className="box-row-column-on-mobile"
          style={{ marginTop: "30px", marginBottom: "20px" }}
        >
          <div className="box-column checkout-expand">
            <h1 className="ptFont" style={{ margin: "0px" }}>
              Checkout
            </h1>

            <Box
              width={isTabletOrMobile ? "100%" : "100%"}
              className="checkout-box"
            >
              <Box
                direction="row"
                align="center"
                justify="between"
                className="noOutline"
              >
                <h3 className="ptFont">Payment Method</h3>
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
                    <img src={iIcon} />{" "}
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
            style={{ width: !isTabletOrMobile ? "50%" : null }}
            className="box-column"
          >
            {isTabletOrMobile ? null : <h1 style={{ margin: "0" }}>&nbsp;</h1>}
            <div className="checkout-box">
              <Box
                direction="row"
                align="center"
                justify="between"
                className="noOutline"
              >
                <h3 className="ptFont">Appointment Details</h3>
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
                            selectedTherapist.dp
                              ? selectedTherapist.dp
                              : noAvatar
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

                  {paymentPackage.package.type === "MONTHLY" ? (
                    <Box direction="row" align="center">
                      <Text>Auto-charge Subscription</Text>
                      <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Box>
                  ) : (
                    ""
                  )}

                  {checked === true ? (
                    <Text>
                      Upcoming invoice charge will be: USD {""}
                      {paymentPackage.payment.package.price}
                    </Text>
                  ) : (
                    ""
                  )}

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
                          onClick={() => (isloading ? null : handleCoupon())}
                          size="small"
                          className="secondary-btn"
                        >
                          {isloading ? <Spinner color="black" /> : "Apply"}
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
                </>
              ) : null}
            </div>
            <Box
              style={{
                background: isTabletOrMobile ? "white" : null,
                position: isTabletOrMobile ? "fixed" : null,
                bottom: isTabletOrMobile ? "0px" : null,
                width: isTabletOrMobile ? "100vw" : null,
                left: isTabletOrMobile ? 0 : null,
              }}
              width="100%"
              pad={isTabletOrMobile ? "medium" : null}
            >
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
                  <Box align="center">
                    <TailSpin color="white" height={20} />
                  </Box>
                ) : (
                  "Proceed"
                )}
              </button>
            </Box>
          </Box>
        </div>
      </Box>
    </Grommet>
  );
};

const CheckandApprovePayment = ({ checked }) => {
  const dispatch = useDispatch();
  const paymentPackage = useSelector((state) => state.onboarding.payment);
  const paymentStatus = useSelector((state) => state.onboarding.payment_status);
  const user = useSelector((state) => state.app.user);

  const [reloader, setReloader] = useState(0);
  const [redirected, setRedirected] = useState(0);

  //   if (user.onboarding) window.replace("/dashboard/patient-complete");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(async () => {
    await delay(2000);

    if (!paymentStatus)
      dispatch(getPaymentStatus({ payment_id: paymentPackage.payment.id }));

    if (paymentStatus && paymentStatus.status === "PENDING") {
      dispatch(getPaymentStatus({ payment_id: paymentPackage.payment.id }));
      setReloader(reloader + 1);
    }

    if (reloader === 0 || !paymentStatus) {
      setReloader(reloader + 1);
    }
  }, [reloader]);

  useEffect(() => {
    dispatch(autoChangeSub({ auto_charge: checked }));
    console.log("auto-charge", checked);
  }, []);

  const createRedirectToast = () => {
    setRedirected(1);
    if (window.localStorage.getItem("from-guided-journey")) {
      dispatch(
        scheduleNewAppointmentAdmin({
          ...JSON.parse(window.localStorage.getItem("guided-selected-slot")),
          patient: user.id,
        })
      );
    }

    window.localStorage.removeItem("guided-selected-therapist");
    window.localStorage.removeItem("guided-selected-slot");
    window.localStorage.removeItem("from-guided-journey");
    window.localStorage.removeItem("fitcy_onboarding_package_id");
    window.localStorage.removeItem("fitcy_onboarding_payment_id");
    window.localStorage.removeItem("fitcy_onboarding_client_secret");
    window.localStorage.removeItem("fitcy_onboarding_therapist_id");

    dispatch(getMeEasy());

    window.location.href = "/dashboard/patient-complete";

    // dispatch(patchOnboardingStatus({ id: user.id, onboarding: true }));
  };

  if (!paymentStatus || paymentStatus.status === "PENDING") return <Loader />;

  if (paymentStatus.status === "SUCCESS")
    return (
      <div className="approve-box center-align">
        <img src={tickMark} width={100} alt="success" />
        <h1 className="ptFont">Payment Succeeded</h1>
        {/* <p className="ptFont">Redirecting to dashboard</p> */}
        {redirected === 0 ? createRedirectToast() : null}
      </div>
    );

  if (paymentStatus.status === "FAILURE")
    return (
      <div className="approve-box center-align">
        <img src={crossMark} width={100} alt="success" />
        <h1 className="ptFont">{paymentStatus.reason}</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="primary-btn"
          style={{ width: "30%", marginBottom: "8px" }}
        >
          Go back
        </button>
        {/* <p className="ptFont">Redirecting to dashboard</p> */}
        {/* {redirected === 0 ? createRedirectToast() : null} */}
      </div>
    );
};

export default function PackageConfirmation() {
  const [step, setStep] = useState();

  const [checked, setChecked] = useState(true);

  const user = useSelector((state) => state.app.user);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestionnaire());

    if (window.localStorage.getItem("from-guided-journey")) setStep(4);

    if (!window.localStorage.getItem("from-guided-journey") && !user.onboarding)
      setStep(1);
  }, []);

  // eslint-disable-next-line no-undef
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  const getStepAction = () => {
    if (step === 4)
      return (
        <Elements stripe={stripePromise}>
          <PaymentStep
            setStep={(value) => setStep(value)}
            checked={checked}
            setChecked={setChecked}
          />
        </Elements>
      );

    if (step === 5) return <CheckandApprovePayment checked={checked} />;
    else return <Loader />;
  };

  return (
    <>
      <Header />

      <div className="box container onboarding-main">{getStepAction()}</div>
    </>
  );
}

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
  getRecommendations,
  // patchOnboardingStatus,
  submitAnswer,
} from "../../redux/onboarding/onboardingThunks";
import Loader from "../../components/common/Loader";
import { TailSpin } from "react-loader-spinner";
import emptyTherapist from "../../assets/onboarding/selectTherapist.svg";
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
import { Box, Grommet, Layer, Meter, Stack, Text, Spinner } from "grommet";
import sessionTick from "../../assets/check-circle-outline.svg";

import iIcon from "../../assets/information-outline.png";
import { FormDown, FormPrevious, FormPreviousLink } from "grommet-icons";
import RecommendedTherapist from "../../components/RecommendedTherapist";
import { useLocation } from "react-router-dom";
import { delay } from "lodash";
import {
  getMeEasy,
  scheduleNewAppointmentAdmin,
} from "../../redux/app/appThunks";
import Switch from "@mui/material/Switch";
import { autoChangeSub } from "../../redux/patient/patientThunks";

const Welcome = ({ setStep }) => {
  const user = useSelector((state) => state.app.user);
  localStorage.removeItem("hasUpdatedFitcyTimeZone");
  return (
    <Box
      align="center"
      justify="center"
      width="100%"
      // alignSelf="center"
      pad="medium"
    >
      <Box className="box-column w-50 centerText welcome-box">
        <Box style={{ width: "100%", textAlign: "left" }} gap="medium">
          <Text size="large" weight="bold" className="ptFont">
            Welcome {user.first_name} {user.last_name}
          </Text>
          <Text size="medium" className="ptFont">
            Here is how our onboarding works:
          </Text>
        </Box>
        <div className="stepWrapper">
          <div className="stepContainer">
            <div className="stepNumber">
              <div
                style={{ width: "20px", height: "20px", fontWeight: "bold" }}
              >
                1
              </div>
            </div>
            <div className="stepText">
              <div style={{ fontWeight: "bold" }}>
                Fill out our questionnare
              </div>
              <div>
                Your answers will help us find the best therapist for you. So it
                is important that you fill out the questionnare with full
                attention
              </div>
            </div>
          </div>
          <div className="stepContainer">
            <div className="stepNumber">
              <div
                style={{ width: "20px", height: "20px", fontWeight: "bold" }}
              >
                2
              </div>
            </div>
            <div className="stepText">
              <div style={{ fontWeight: "bold" }}>
                Confirm Package and Select therapist
              </div>
              <div>
                Based on your answers, we will recommend you a package and
                therapists. You have the option to choose from multiple
                recommended therapists.
              </div>
            </div>
          </div>
          <div className="stepContainer">
            <div className="stepNumber">
              <div
                style={{ width: "20px", height: "20px", fontWeight: "bold" }}
              >
                3
              </div>
            </div>
            <div className="stepText">
              <div style={{ fontWeight: "bold" }}>Confirm Booking </div>
              <div>
                The last step is to checkout by entering your payment details
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            user.therapist_slug !== null ? setStep(2) : setStep(2)
          }
          className="primary-btn w-100"
          style={{ marginTop: "10px" }}
        >
          Get Started
        </button>
      </Box>
    </Box>
  );
};

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

  if (user.onboarding) window.replace("/dashboard/patient-complete");

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

const Questionnaire = ({ setStep }) => {
  const dispatch = useDispatch();
  const questionnaireToUse = useSelector(
    (state) => state.onboarding.questionnaire_dict
  );
  const [questionNo, setQuestionNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);
  const [fromBack, setFromBack] = useState(false);

  const user = useSelector((state) => state.app.user);
  // if (user.therapist_slug) setStep(3);

  useEffect(() => {
    let completedQuestions = [];

    if (user && questionnaireToUse) {
      user.ob_answers.forEach((element) => {
        completedQuestions.push(
          element.questionnaire.name
            ? element.questionnaire.id
            : element.questionnaire
        );
      });

      if (
        completedQuestions.find(
          (x) => x === questionnaireToUse[questionNo - 1].id
        )
      ) {
        if (questionNo < questionnaireToUse.length) {
          if (!fromBack) setQuestionNo(questionNo + 1);
        } else setStep(3);
      }
      setLoading(false);
    } else {
      setTrigger(trigger + 1);
    }
  }, [questionNo, trigger]);

  useEffect(() => {
    if (!questionnaireToUse) dispatch(getQuestionnaire());
  }, []);

  const handleSubmitAnswer = (e) => {
    if (e.preventDefault) e.preventDefault();
    let answerToSubmit = [];

    if (questionnaireToUse[questionNo - 1].type !== "MULTISELECT") {
      answerToSubmit.push(e.target.answer.value);
    }

    if (questionnaireToUse[questionNo - 1].type === "MULTISELECT") {
      for (let i = 0; i < e.target.length; i++) {
        if (e.target[i].checked) answerToSubmit.push(e.target[i].value);
      }
    }

    dispatch(
      submitAnswer({
        questionnaire: questionnaireToUse[questionNo - 1].id,
        answer: answerToSubmit,
      })
    );

    if (questionNo < questionnaireToUse.length) setQuestionNo(questionNo + 1);
    else {
      setStep(3);
      // dispatch(getMe());
    }
  };

  const renderQuestionChoices = (question) => {
    if (question.type === "TEXT")
      return (
        <form
          method="POST"
          className="w-100 box-column"
          onSubmit={handleSubmitAnswer}
        >
          <input type="text" name="answer" />
          <button type="submit" className="primary-btn">
            {questionNo < questionnaireToUse.length ? "Next" : "Complete"}
          </button>
        </form>
      );

    if (question.type === "SINGLESELECT")
      return (
        <form
          method="POST"
          className="w-100 box-column"
          // onSubmit={handleSubmitAnswer}
        >
          {question.answer_choices.map((answer) => (
            <div
              key={answer}
              className="radio-choice"
              onClick={() =>
                handleSubmitAnswer({ target: { answer: { value: answer } } })
              }
            >
              <div type="radio" name="answer">
                {answer}
              </div>
              {/* <label htmlFor={answer}>{answer}</label> */}
            </div>
          ))}
          {/* <button type="submit" className="primary-btn w-button-100">
            {questionNo < questionnaireToUse.length ? "Next" : "Complete"}
          </button> */}
        </form>
      );

    if (question.type === "MULTISELECT")
      return (
        <form
          method="POST"
          className="w-100 box-column"
          onSubmit={handleSubmitAnswer}
        >
          {question.answer_choices.map((answer) => (
            <div key={answer} className="radio-choice2">
              <input
                className="radio-circle"
                id={answer}
                type="checkbox"
                name="answer"
                value={answer}
              />
              <label className="radio-choice2" htmlFor={answer}>
                {answer}
              </label>
            </div>
          ))}
          <button type="submit" className="primary-btn w-button-100">
            {questionNo < questionnaireToUse.length ? "Next" : "Complete"}
          </button>
        </form>
      );
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  if (!questionnaireToUse || !user || loading) return <Loader />;

  return (
    <Box
      align="center"
      justify="center"
      width="100%"
      alignSelf={isTabletOrMobile ? "start" : "center"}
      pad="medium"
    >
      <div className="box-column w-50 questionnaire-box">
        {questionNo !== 1 ? (
          <Box
            direction="row"
            className="noOutline"
            align="center"
            gap="xsmall"
            onClick={() => {
              setFromBack(true);
              setQuestionNo(questionNo - 1);
            }}
          >
            <FormPrevious size="small" />
            <Text size="small">Back</Text>
          </Box>
        ) : null}

        <Grommet>
          <Box align="start" pad="xsmall">
            <Stack anchor="center">
              <Meter
                type="circle"
                values={[
                  {
                    value: (questionNo / questionnaireToUse.length) * 100,
                    color: "rgba(0, 150, 136, 1)",
                  },
                ]}
                background="rgba(221, 221, 221, 1)"
                round={true}
                size="xsmall"
                thickness="small"
              />
              <div
                style={{
                  color: "#9E9E9E",
                  fontWeight: "bold",
                  fontSize: "small",
                }}
              >
                <span style={{ color: "#000", fontWeight: "bold" }}>
                  {questionNo}
                </span>{" "}
                <span style={{ color: "rgba(158, 158, 158, 1)" }}>/</span>
                <span
                  style={{
                    color: "rgba(158, 158, 158, 1)",
                    fontWeight: "bold",
                  }}
                >
                  {questionnaireToUse.length}
                </span>
              </div>
            </Stack>
          </Box>
        </Grommet>
        <div className="question">
          {questionnaireToUse[questionNo - 1].banner}
        </div>
        <Box style={{ maxHeight: "50vh", overflowY: "scroll" }}>
          {renderQuestionChoices(questionnaireToUse[questionNo - 1])}
        </Box>
      </div>
    </Box>
  );
};

const SelectPackageandTherapist = ({ user, setStep }) => {
  const [internalStep, setInternalStep] = useState(1);
  const [packageSelected, setPackage] = useState("MONTHLY");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [showMB, setShowMB] = useState(false);
  const [showCS, setShowCS] = useState(false);

  const recommendations = useSelector(
    (state) => state.onboarding.recommendations
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRecommendations());
  }, []);

  if (!recommendations)
    return (
      <Box
        align="center"
        justify="center"
        width="100%"
        alignSelf="center"
        pad="small"
        // style={{ overflow: "auto" }}
      >
        <div className="box-column w-50 questionnaire-box center-align">
          <TailSpin color="black" height={80} width={80} />

          <h2 className="ptFont" style={{ textAlign: "center" }}>
            Setting up your personalized package
          </h2>
          <p style={{ color: "rgba(159, 159, 159, 1)", textAlign: "center" }}>
            Based on your answers in the questionnaire, we figure out what will
            be the best package for you that can accomodate all your needs{" "}
          </p>
        </div>
      </Box>
    );

  const getCurrentPackage = () => {
    const currentPackage = recommendations.package.find(
      (x) => x.type === packageSelected
    );

    return currentPackage;
  };

  const goToNextStep = (therapist) => {
    window.localStorage.setItem(
      "fitcy_onboarding_package_id",
      getCurrentPackage().id
    );
    window.localStorage.setItem("fitcy_onboarding_therapist_id", therapist);
    dispatch(
      createPayment({
        package_id: getCurrentPackage().id,
        therapist_id: therapist,
      })
    );

    dispatch(
      setTherapist(recommendations.therapist.find((x) => x.id === therapist))
    );

    setStep(4);
  };

  const goBackFromSelection = () => {
    setStep(user.therapist_slug ? 1 : 2);
  };

  return (
    <>
      {showMB && (
        <Layer
          onClickOutside={() => setShowMB(false)}
          onEsc={() => setShowMB(false)}
          style={{
            maxHeight: "max-content",
            maxWidth: "80vw",
            padding: "10px",
            boxShadow: "0px 0px 10px 1000px  #00000030",
            borderRadius: "10px",
          }}
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
          style={{
            maxHeight: "max-content",
            maxWidth: "80vw",
            padding: "10px",
            boxShadow: "0px 0px 10px 1000px  #00000030",
            borderRadius: "10px",
          }}
        >
          <Box pad="small">
            We&apos;ll work with you as your trusted friend & confidante to help
            you with any difficulties that may arise. We promise to try our best
            to go over & above what you would expect from us.
          </Box>
        </Layer>
      )}

      <div className="box-row-nogap w-100">
        <div
          className="box-column-nogap package-box h-100"
          style={{
            display: isTabletOrMobile && internalStep === 2 ? "none" : null,
            overflowY: "hidden",
          }}
        >
          <div
            className="noOutline"
            onClick={() => goBackFromSelection()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: "5px",
              cursor: "pointer",
            }}
          >
            {" "}
            <FormPreviousLink size="small" />
            <Text size="small">Back</Text>
          </div>
          <Text
            className="ptFont"
            weight="bold"
            style={{ textAlign: "left", width: "100%", margin: "0" }}
          >
            Your personalised package{" "}
          </Text>
          {/* <p style={{ margin: 0 }}>
            Based on your answers, we have generated a personalised package for
            you which is{" "}
            <span
              style={{
                color: "#009688",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              affordable
            </span>{" "}
            and{" "}
            <span
              style={{
                color: "#009688",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              will best fit your needs
            </span>
          </p> */}

          <div className="box-column">
            <Text
              style={{
                color: "rgba(117, 117, 117, 1)",
                margin: 0,
                fontWeight: "bold",
              }}
              size="small"
            >
              Select desired package option
            </Text>
            <Text size="small" style={{ color: "#000", margin: 0 }}>
              We recommend choosing the Monthly Subscription because your mental
              health requires consistency. Our industry-leading{" "}
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
            </Text>
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
              USD {getCurrentPackage() && getCurrentPackage().price}
            </p>
            {packageSelected === "MONTHLY" ? (
              <p style={{ color: "#000", margin: 0 }}>
                Includes <b>4</b> sessions (
                <b>
                  USD {getCurrentPackage() && getCurrentPackage().price / 4}
                </b>
                / Per Session){" "}
              </p>
            ) : null}
            {packageSelected === "ONETIME" ? (
              <p style={{ color: "#000", margin: 0 }}>
                Includes <b>1</b> session{" "}
              </p>
            ) : null}
          </div>
          <Box style={{ overflowY: "auto" }} gap="medium">
            <p
              style={{
                color: "rgba(117, 117, 117, 1)",
                width: "100%",
                margin: 0,
                marginBottom: isTabletOrMobile ? "40px" : null,
              }}
              className="dotted-divider"
            >
              Your package has the following unique features:
            </p>
            <div>
              <div className="box-row ">
                <img src={sessionTick} />
                <p>{packageSelected === "ONETIME" ? 1 : 4} video sessions </p>
              </div>
              <div className="box-row ">
                <img src={sessionTick} />
                <p>
                  {" "}
                  {packageSelected === "ONETIME"
                    ? "7 Days of"
                    : "Unlimited"}{" "}
                  Messaging with your therapist{" "}
                </p>
              </div>
              <div className="box-row ">
                <img src={sessionTick} />
                <p>Access to fitcy dashboard to manage your appointments </p>
              </div>
              {packageSelected === "ONETIME" ? null : (
                <div className="box-row ">
                  <img src={sessionTick} />
                  <p>Lifestyle recommendations </p>
                </div>
              )}
              <div className="box-row ">
                <img src={sessionTick} />
                <p>60 days expiry of unused sessions </p>
              </div>
              <div className="box-row ">
                <img src={sessionTick} />
                <p>
                  1/3 of profits donated to charitable mental health causess{" "}
                </p>
              </div>
            </div>
            <button
              style={{ marginBottom: "10px" }}
              onClick={() => setInternalStep(2)}
              className={
                internalStep === 1 ? "primary-btn w-100" : "white-btn w-100"
              }
              disabled={internalStep === 2}
            >
              {internalStep === 2 ? (
                <span className="box-row center-align">
                  {" "}
                  <img src={sessionTick} /> <div>Confirmed</div>
                </span>
              ) : (
                "Confirm Package"
              )}
            </button>
          </Box>
        </div>
        <div
          style={{
            display: isTabletOrMobile && internalStep === 1 ? "none" : null,
          }}
          className="box-column-nogap therapist-box center-align h-100 "
        >
          {internalStep === 1 ? (
            <>
              <img src={emptyTherapist} alt="empty therapist" />
              <p>Confirm your package to view recommended therapists</p>
            </>
          ) : (
            <div className="w-100 h-100">
              <h2 className="ptFont">Select desired therapist</h2>
              <p style={{ marginBottom: "10px" }}>
                These <b>{recommendations.therapist.length}</b> therapists are
                best fit for your needs based on your answers.{" "}
              </p>
              <div
                className="box-column"
                style={{ maxHeight: "80vh", overflow: "auto" }}
              >
                {recommendations.therapist.map((x) => (
                  <RecommendedTherapist
                    x={x}
                    goToNextStep={goToNextStep}
                    key={x.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function PatientOnboarding() {
  const params = useLocation();
  const [step, setStep] = useState(
    params.search === "?skip_questions" ? 3 : null
  );

  const [checked, setChecked] = useState(true);
  const user = useSelector((state) => state.app.user);

  if (user.onboarding) window.location.replace("/dashboard/patient-complete");

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
    if (step === 1) return <Welcome setStep={(value) => setStep(value)} />;

    if (step === 2)
      return <Questionnaire setStep={(value) => setStep(value)} />;

    if (step === 3)
      return (
        <SelectPackageandTherapist
          user={user}
          setStep={(value) => setStep(value)}
        />
      );

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

import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import { Box, Text } from "grommet";
import { useDispatch } from "react-redux";
import {
  getTherapistFromSlug,
  getTherapistPackageFromID,
} from "../../redux/onboarding/onboardingThunks";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import sessionTick from "../../assets/check-circle-outline.svg";
import Loader from "./Loader";
import { TailSpin } from "react-loader-spinner";

const SelectPackageNewOnboarding = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [packageSelected, setPackage] = useState("MONTHLY");
  const [loading, setLoading] = useState();

  const param = useLocation();
  const slug = param.search.split("=")[1].split("&")[0];
  const onboardingTherapist = useSelector(
    (state) => state.onboarding.onboarding_therapist
  );
  useEffect(() => {
    console.log(slug);

    if (!onboardingTherapist) dispatch(getTherapistFromSlug({ slug }));
  }, []);
  const onboardingTherapistPackage = useSelector(
    (state) => state.onboarding.onboarding_therapist_package
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (onboardingTherapist)
      dispatch(
        getTherapistPackageFromID({ therapistID: onboardingTherapist.id })
      );
  }, [onboardingTherapist]);

  const getCurrentPackage = () => {
    const currentPackage = onboardingTherapistPackage.find(
      (x) => x.type === packageSelected
    );

    return currentPackage;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setLoading(true);
    window.localStorage.setItem("from-guided-journey", true);
    window.localStorage.setItem(
      "fitcy_onboarding_package_id",
      getCurrentPackage().id
    );

    window.localStorage.setItem(
      "fitcy_onboarding_therapist_id",
      onboardingTherapist.id
    );
    window.location.href = `psychologist/calendar?t=${slug}`;
  };

  if (!onboardingTherapistPackage || !onboardingTherapist) return <Loader />;

  return (
    <div className="h-100">
      <Header />
      <Box
        pad="small"
        height="100vh"
        align="center"
        gap="medium"
        style={{ background: "rgba(224, 242, 241, 1)" }}
      >
        <Box
          width={isTabletOrMobile ? "100%" : "60%"}
          background="white"
          pad="medium"
          round="10px"
          gap="medium"
        >
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
            health requires consistency. Our industry-leading money-back
            guarantee & intense dedication to customer service means you can
            stay assured with your purchase.
          </Text>
          <div className="box-row">
            <div
              className={
                packageSelected === "MONTHLY"
                  ? "selected-package"
                  : "unselected-package"
              }
              onClick={() => setPackage("MONTHLY")}
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
              onClick={() => setPackage("ONETIME")}
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
              <b>USD {getCurrentPackage() && getCurrentPackage().price / 4}</b>/
              Per Session){" "}
            </p>
          ) : null}
          {packageSelected === "ONETIME" ? (
            <p style={{ color: "#000", margin: 0 }}>
              Includes <b>1</b> session{" "}
            </p>
          ) : null}
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
            <Box gap="small">
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
            </Box>
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
              <button className="primary-btn w-100" onClick={handleConfirm}>
                {loading ? (
                  <Box width="100%" alignSelf="center" align="center">
                    <TailSpin height={20} color="white" />
                  </Box>
                ) : (
                  "Confirm Package"
                )}
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SelectPackageNewOnboarding;

import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import noAvatar from "../../assets/noAvatar.jpeg";
import { getTherapistFromSlug } from "../../redux/onboarding/onboardingThunks";
import { Box, Text } from "grommet";
import { useMediaQuery } from "react-responsive";
import BookSessionNewOnboarding from "../../components/common/BookSessionNewOnboarding";
import Loader from "../../components/common/Loader";
import { FormPreviousLink, Star } from "grommet-icons";

const GuidedSignUp = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const param = useLocation();
  const slug = param.search.split("=")[1];

  const onboardingTherapist = useSelector(
    (state) => state.onboarding.onboarding_therapist
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!onboardingTherapist) dispatch(getTherapistFromSlug({ slug }));
  }, []);

  if (!onboardingTherapist) return <Loader />;

  return (
    <>
      <div className="h-100">
        <Header />
        <Box
          className="noOutline "
          onClick={() =>
            window.location.replace(
              `/psychologist?t=${onboardingTherapist.slug}`
            )
          }
          style={{
            marginTop: "5px",
            cursor: "pointer",
            marginBottom: "5px",
          }}
          pad="small"
          direction="row"
          align="center"
          gap="small"
        >
          <Box
            className="primary-btn"
            gap="small"
            direction="row"
            pad="small"
            align="center"
            round="8px"
            background="#80808050"
          >
            {" "}
            <FormPreviousLink color="white" size="small" />
            <Text size="small">Change Package</Text>
          </Box>
        </Box>

        {isTabletOrMobile ? (
          <Box
            style={{ flexShrink: "0" }}
            width={isTabletOrMobile ? "100%" : " 275px"}
          >
            <div
              key={onboardingTherapist.id}
              style={{
                alignItems: "center",
                background: "#fafafa",
                boxShadow: " 0px 0px 4px rgba(0, 0, 0, 0.18)",
                borderRadius: "4px",
                padding: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={
                    onboardingTherapist.dp ? onboardingTherapist.dp : noAvatar
                  }
                  style={{
                    borderRadius: "100px",
                    height: isTabletOrMobile ? "80px" : "80px",
                    width: isTabletOrMobile ? "77.76px" : "77.76px",
                    marginBottom: "10px",
                    marginTop: "7px",
                    objectFit: "cover",
                  }}
                />{" "}
                <Box
                  background="#F5F5F5"
                  height="0%"
                  width="20%"
                  direction="row"
                  align="center"
                  justify="between"
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                >
                  <Star color=" #FFC107" size="15px" />
                  <Text size="small" style={{ textAlign: "center" }}>
                    {onboardingTherapist.rating}
                  </Text>
                </Box>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {onboardingTherapist.first_name} {onboardingTherapist.last_name}
              </div>
              <Box
                color="#757575"
                size="16px"
                style={{
                  marginTop: "8px",
                }}
              >
                {onboardingTherapist.designation}
              </Box>
              <Box
                background="#F0FAFF"
                direction="row"
                margin={{ top: "20px" }}
                justify="between"
                align="center"
                style={{
                  textTransform: "capitalize",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <Box gap="xsmall">
                  <Text size="14px">
                    {onboardingTherapist.amelia_package} Subscription
                  </Text>
                  <Box direction="row" justify="between">
                    <Text size="14px" color="#009688">
                      AED 996
                    </Text>
                    <Text
                      size="14px"
                      color="#9E9E9E"
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      AED 1500
                    </Text>
                  </Box>
                </Box>
                <Text
                  color="#757575"
                  size="12px"
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  Change
                </Text>
              </Box>
            </div>
            <Box>
              {onboardingTherapist.category.map(
                (cat, index) =>
                  `${cat.name}${
                    index + 1 === onboardingTherapist.category.length
                      ? ""
                      : ", "
                  }`
              )}
            </Box>
          </Box>
        ) : null}

        <Box
          direction={isTabletOrMobile ? "column" : "row"}
          pad="small"
          align="start"
          gap="medium"
          justify="center"
        >
          <Box
            style={{
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.18)",
              width: isTabletOrMobile ? "100%" : "",
              maxWidth: isTabletOrMobile ? "" : "597px",
              objectFit: "cover",
            }}
            round="8px"
            align="start"
            pad="medium"
            gap="medium"
          >
            <BookSessionNewOnboarding therapistID={onboardingTherapist.id} />
          </Box>

          {!isTabletOrMobile ? (
            <Box
              style={{ flexShrink: "0" }}
              width={isTabletOrMobile ? "100%" : " 275px"}
            >
              <div
                key={onboardingTherapist.id}
                style={{
                  alignItems: "center",
                  background: "#fafafa",
                  boxShadow: " 0px 0px 4px rgba(0, 0, 0, 0.18)",
                  borderRadius: "4px",
                  padding: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <img
                    src={
                      onboardingTherapist.dp ? onboardingTherapist.dp : noAvatar
                    }
                    style={{
                      borderRadius: "100px",
                      height: isTabletOrMobile ? "80px" : "80px",
                      width: isTabletOrMobile ? "77.76px" : "77.76px",
                      marginBottom: "10px",
                      marginTop: "7px",
                      objectFit: "cover",
                    }}
                  />{" "}
                  <Box
                    background="#F5F5F5"
                    height="0%"
                    width="20%"
                    direction="row"
                    align="center"
                    justify="between"
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    <Star color=" #FFC107" size="15px" />
                    <Text size="small" style={{ textAlign: "center" }}>
                      {onboardingTherapist.rating}
                    </Text>
                  </Box>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {onboardingTherapist.first_name}{" "}
                  {onboardingTherapist.last_name}
                </div>
                <Box
                  color="#757575"
                  size="16px"
                  style={{
                    marginTop: "8px",
                  }}
                >
                  {onboardingTherapist.designation}
                </Box>
                <Box
                  background="#F0FAFF"
                  direction="row"
                  margin={{ top: "20px" }}
                  justify="between"
                  align="center"
                  style={{
                    textTransform: "capitalize",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Box gap="xsmall">
                    <Text size="14px">
                      {onboardingTherapist.amelia_package} Subscription
                    </Text>
                    <Box direction="row" justify="between">
                      <Text size="14px" color="#009688">
                        AED 996
                      </Text>
                      <Text
                        size="14px"
                        color="#9E9E9E"
                        style={{
                          textDecoration: "line-through",
                        }}
                      >
                        AED 1500
                      </Text>
                    </Box>
                  </Box>
                  <Text
                    color="#757575"
                    size="12px"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Change
                  </Text>
                </Box>
              </div>
              <Box>
                {onboardingTherapist.category.map(
                  (cat, index) =>
                    `${cat.name}${
                      index + 1 === onboardingTherapist.category.length
                        ? ""
                        : ", "
                    }`
                )}
              </Box>
            </Box>
          ) : null}
        </Box>
      </div>
    </>
  );
};

export default GuidedSignUp;

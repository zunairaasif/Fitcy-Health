import { Avatar, Box, Layer, Text } from "grommet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGreetingTime } from "../../services/globalFunctions";
import noAvatar from "../../assets/noAvatar.jpeg";
import { useMediaQuery } from "react-responsive";
// import starRating from "../../assets/star.svg"
// import sheildPopular from "../../assets/sheild.svg"
import { getUpcomingAppointments } from "../../redux/patient/patientThunks";
import noAppointment from "../../assets/noAppointment.svg";
// import BookSession from "../../components/common/BookSession";
import AppointmentBox from "../../components/common/AppointmentBox";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import Loader from "../../components/common/Loader";
import { getMe } from "../../redux/app/appThunks";
import { FormClose } from "grommet-icons";
import BookSessionNew from "../../components/common/BookSessionNew";
export default function PatientDashboardComplete() {
  const user = useSelector((state) => state.app.user);
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const upcomingAppointments = useSelector(
    (state) => state.patient.upcomingAppointments
  );
  const dispatch = useDispatch();
  const [showBookSession, setShowBookSession] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    dispatch(getUpcomingAppointments());
  }, []);

  useEffect(() => {
    if (!user.current_therapist) dispatch(getMe());
  }, []);

  if (!user.onboarding && user.role === "PATIENT")
    window.location.replace("/dashboard/patient-onboarding");

  if (!user || !user.current_therapist) return <Loader />;

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      {showBookSession ? (
        <BookSessionNew
          therapistID={user.current_therapist.id}
          setShowLayer={(value) => setShowBookSession(value)}
        />
      ) : null}

      <Box className="w-100 h-100" gap="small" pad="medium">
        <Text className="ptFont" size="large">
          {getGreetingTime(moment())},{" "}
          <b>
            {" "}
            {user.first_name} {user.last_name}
          </b>
        </Text>
        <ChangeTimeZone />
        <Box className="divider" />
        <Box gap="small">
          <Text weight="bold" size="medium">
            Upcoming Appointments
          </Text>

          {upcomingAppointments && upcomingAppointments.length === 0 ? (
            <Box
              width={isTabletOrMobile ? "100%" : "100%"}
              pad="medium"
              align="center"
              className="box-row therapist-profile"
            >
              <img src={noAppointment} width="20%" />
              <Text size="small" style={{ textAlign: "center" }}>
                You have no upcoming appointments. <br />
                Schedule your first session with your therapist
              </Text>
              <Box
                pad="small"
                style={{ cursor: "pointer" }}
                className="noOutline"
                onClick={() => setShowBookSession(true)}
                round="50px"
                background="#009688"
                align="center"
                justify="center"
              >
                Book session
              </Box>
            </Box>
          ) : (
            <>
              {upcomingAppointments ? (
                <AppointmentBox appointment={upcomingAppointments[0]} />
              ) : null}
            </>
          )}
        </Box>

        <Box gap="small" width="100%" style={{ flexShrink: "0" }}>
          <Text weight="bold" size="medium">
            Assigned Therapist
          </Text>
          <Box width={isTabletOrMobile ? "100%" : "100%"}>
            {/* <RecommendedTherapist x={user.current_therapist} goToNextStep={() => true} /> */}
            {showProfile && (
              <Layer
                plain
                style={{
                  minWidth: isTabletOrMobile ? "100%" : "60%",
                  maxWidth: isTabletOrMobile ? "100%" : "80%",
                  maxHeight: isTabletOrMobile ? "100%" : "90%",
                }}
                onEsc={() => setShowProfile(false)}
                onClickOutside={() => setShowProfile(false)}
              >
                <Box
                  background="white"
                  margin="xsmall"
                  style={{
                    boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
                  }}
                  round="8px"
                  gap="small"
                  justify="between"
                >
                  <Box
                    round="8px 8px 0px 0px"
                    background="#EFFFFE"
                    pad="medium"
                    style={{
                      borderBottom: "#009688 2px solid",
                      flexShrink: "0",
                    }}
                  >
                    <FormClose
                      className="noOutline"
                      onClick={() => setShowProfile(false)}
                    />
                  </Box>
                  <Box
                    pad="medium"
                    direction="row"
                    gap="medium"
                    align="center"
                    justify="between"
                    style={{
                      borderBottom: "1px dashed rgba(0, 150, 136, 1)",
                      flexShrink: "0",
                    }}
                  >
                    <Box gap="small" direction="row">
                      <Avatar
                        size="xlarge"
                        style={{ border: "2px solid #009688" }}
                        src={
                          user &&
                          user.current_therapist &&
                          user.current_therapist.dp
                            ? user.current_therapist.dp
                            : noAvatar
                        }
                      />

                      <Box gap="xsmall">
                        <Text weight="bold">
                          {user.current_therapist.first_name}{" "}
                          {user.current_therapist.last_name}
                        </Text>
                        <Text size="small">
                          {user.current_therapist.designation}
                        </Text>
                        <div className="box-row">
                          {/* <div className="ratingtag" style={{ fontSize: "small", padding: "5px" }}> <img src={starRating} /> <div><b>4.5</b> {isTabletOrMobile ? null : "Rating"} </div></div> */}
                          {/* <div className="populartag" style={{ fontSize: "small", padding: "5px" }}> <img src={sheildPopular} /> <div>{isTabletOrMobile ? null : "Most Popular"}</div></div> */}
                        </div>
                      </Box>
                    </Box>
                    <Box
                      direction="row"
                      align="center"
                      justify="center"
                      round="10px"
                      gap="xsmall"
                      style={{ border: "0.5px solid #000000" }}
                      background="#EFFFFE"
                      pad="xsmall"
                    >
                      <Box
                        pad="small"
                        align="center"
                        style={{ borderRight: "0.5px solid #00000050" }}
                      >
                        <Text weight="bold">
                          {moment().year() -
                            user.current_therapist.years_of_experience}
                          +
                        </Text>
                        <Text size="small">Years of Experience</Text>
                      </Box>

                      <Box pad="small" align="center">
                        <Text weight="bold">
                          {user.current_therapist.language.length}
                        </Text>
                        <Text size="small">Spoken Languages</Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box pad="medium" direction="row" gap="small">
                    <Box width="70%" style={{ overflowY: "auto" }} gap="small">
                      <Box style={{ flexShrink: "0" }}>
                        <Text size="small" weight="bold">
                          Area of Expertise
                        </Text>
                        {user.current_therapist.category.map((cat) => (
                          <Text key={cat} size="xsmall">
                            • {cat.name}
                          </Text>
                        ))}
                      </Box>
                      <Box style={{ flexShrink: "0" }}>
                        <Text size="small" weight="bold">
                          Overview
                        </Text>
                        <Text size="small">{user.current_therapist.about}</Text>
                      </Box>
                      <Box style={{ flexShrink: "0" }}>
                        <Text size="small">
                          {user.current_therapist.value_to_fitcy}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  {/* {JSON.stringify(x)} */}
                </Box>
              </Layer>
            )}
            <div className="box-row therapist-profile">
              <div>
                <img
                  src={
                    user && user.current_therapist && user.current_therapist.dp
                      ? user.current_therapist.dp
                      : noAvatar
                  }
                  style={{
                    borderRadius: "8px",
                    width: isTabletOrMobile ? "80px" : "80px",
                  }}
                />{" "}
              </div>
              <div className="box-column">
                <div
                  className="box-row"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="box-column-nogap">
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "large",
                        marginBottom: "5px",
                      }}
                    >
                      {user.current_therapist.first_name}{" "}
                      {user.current_therapist.last_name}
                    </div>
                    <div> {user.current_therapist.designation}</div>
                  </div>
                  <div className="box-row">
                    {/* <div className="ratingtag"> <img src={starRating} /> <div><b>4.5</b> {isTabletOrMobile ? null : "Rating"} </div></div> */}
                    {/* <div className="populartag"> <img src={sheildPopular} /> <div>{isTabletOrMobile ? null : "Most Popular"}</div></div> */}
                  </div>
                </div>
                <Box style={{ maxHeight: "100px", overflowY: "scroll" }}>
                  {user.current_therapist.category.map(
                    (cat, index) =>
                      `${cat.name}${
                        index + 1 === user.current_therapist.category.length
                          ? ""
                          : ", "
                      }`
                  )}
                </Box>

                <Box
                  onClick={() => setShowProfile(true)}
                  className="plain-btn noOutline"
                  margin={{ top: "small" }}
                >
                  View Profile
                </Box>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}

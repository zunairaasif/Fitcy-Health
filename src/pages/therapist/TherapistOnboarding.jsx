import React from "react";
import { useState } from "react";
import Header from "../../components/common/Header";
// import WelcomeImage from "../../assets/onboarding/welcome.svg";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text } from "grommet";
import { AddCircle, Trash } from "grommet-icons";
import TimeRange from "react-time-range";
import { useMediaQuery } from "react-responsive";
import { addAppointmentSlot } from "../../redux/therapist/therapistThunks";
import moment from "moment";
import { patchOnboardingStatusTherapist } from "../../redux/onboarding/onboardingThunks";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";

// import moment from 'moment';
const Welcome = ({ setStep }) => {
  const user = useSelector((state) => state.app.user);
  localStorage.removeItem("hasUpdatedFitcyTimeZone");

  return (
    <Box
      align="center"
      justify="center"
      width="100%"
      alignSelf="center"
      pad="medium"
      height="90%"
    >
      <div className="box-column center-align w-50 centerText welcome-box">
        <div className="heading_container_onboarding">
          <h1 className="ptFont">
            Welcome {user.first_name} {user.last_name}
          </h1>
          <p style={{ fontSize: "larger" }}>
            Here is how our onboarding works:
          </p>
        </div>
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
              <div style={{ fontWeight: "bold" }}>Share your expertise</div>
              <div>
                We use this information to craft your profile. If you’re an
                existing therapist, then please skip to the second step.
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
              <div style={{ fontWeight: "bold" }}>Setup your working hours</div>
              <div>
                Your working hours need to be updated as per your time zone. For
                example, if you are in London please make sure to choose
                London/United Kingdom time. Clients can only book a session
                during the hours you have mentioned.
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
              <div style={{ fontWeight: "bold" }}>
                Start receiving bookings from clients
              </div>
              <div>
                Make sure all the details in the dashboard are correct. And you
                are good to go!”
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setStep(2)}
          className="primary-btn w-100"
          style={{ marginTop: "10px" }}
        >
          Get Started
        </button>
      </div>
    </Box>
  );
};

const SetupHours = () => {
  const [trigger, setTrigger] = useState(0);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const user = useSelector((state) => state.app.user);
  const [workHours, setWorkHours] = useState([
    { day: "Monday", abb: "MON", workingHours: [] },
    { day: "Tuesday", abb: "TUE", workingHours: [] },
    { day: "Wednesday", abb: "WED", workingHours: [] },
    { day: "Thursday", abb: "THU", workingHours: [] },
    { day: "Friday", abb: "FRI", workingHours: [] },
    { day: "Saturday", abb: "SAT", workingHours: [] },
    { day: "Sunday", abb: "SUN", workingHours: [] },
  ]);

  const handleAdd = (index) => {
    workHours[index].workingHours.push({
      start: moment().hours(9).minutes(0).seconds(0).milliseconds(0),
      end: moment().hours(17).minutes(0).seconds(0).milliseconds(0),
    });
    setWorkHours(workHours);
    setTrigger(trigger + 1);
  };
  const handleRemove = (index, ind) => {
    workHours[index].workingHours.splice(ind, 1);
    setWorkHours(workHours);
    setTrigger(trigger + 1);
  };

  const handleEdit = (change, index, ind) => {
    if (change.startTime)
      workHours[index].workingHours[ind].start = change.startTime;

    if (change.endTime) workHours[index].workingHours[ind].end = change.endTime;

    setWorkHours(workHours);
    setTrigger(trigger + 1);
  };

  const dispatch = useDispatch();

  const createSlots = () => {
    const toSendSlots = [];
    workHours.forEach((x) => {
      if (x.workingHours.length > 0)
        x.workingHours.forEach((slot) => {
          toSendSlots.push({
            day: x.day.toUpperCase(),
            start_time:
              moment(slot.start).hours() +
              ":" +
              moment(slot.start).minutes() +
              ":00.0000",
            end_time:
              moment(slot.end).hours() +
              ":" +
              moment(slot.end).minutes() +
              ":00:00.0000",
          });
        });
    });

    dispatch(addAppointmentSlot(toSendSlots));

    dispatch(patchOnboardingStatusTherapist({ id: user.id, onboarding: true }));
  };

  const hours = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const determineIftoColor = (x, day) => {
    const thisDay = workHours.find((y) => y.abb === day.abb);

    const rangeDict = [];

    if (thisDay.workingHours.length < 1) return false;

    thisDay.workingHours.forEach((el) => {
      let started = moment(el.start);
      while (moment(started).isBefore(el.end)) {
        rangeDict.push(moment(started).format("hh:00 A"));
        started.add(1, "h");
      }
    });

    if (rangeDict.find((e) => e == x)) return true;
    else return false;
  };

  return (
    <Box
      width="100%"
      height="92vh"
      align="center"
      justify="center"
      direction={isTabletOrMobile ? "column" : "row"}
    >
      <Box
        width={isTabletOrMobile ? "100%" : "50%"}
        background="white"
        height="100%"
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.12)" }}
        justify="between"
      >
        <Box gap={isTabletOrMobile ? "large" : "small"} pad="small">
          <Text className="ptFont" weight="bold" size="xlarge">
            Setup your Schedule
          </Text>
          <ChangeTimeZone />

          <Text color="rgba(117, 117, 117, 1)" size="small" weight="bold">
            When do you start and stop working each day?
          </Text>
          <Text size="small">
            You can setup how an average work week looks like for you. It can
            always be edited later.
          </Text>
          <Box
            direction="row"
            gap={isTabletOrMobile ? "medium" : "small"}
            style={{ flexShrink: "0" }}
          >
            {workHours.map((x) => (
              <Box
                key={x.abb}
                pad={isTabletOrMobile ? "small" : "xxsmall"}
                background={
                  x.workingHours.length > 0 ? "rgba(0, 150, 136, 1)" : null
                }
                round="4px"
                align="center"
                style={{
                  border: "1px solid rgba(0, 150, 136, 1)",
                  minWidth: "40px",
                }}
              >
                <Text size="xsmall" weight="bold">
                  {x.abb}
                </Text>
              </Box>
            ))}
          </Box>
          <Box
            gap={isTabletOrMobile ? "medium" : "small"}
            style={{ flexShrink: "0" }}
          >
            {workHours.map((x, index) => (
              <Box
                key={x.abb}
                pad="xxsmall"
                direction="row"
                gap="small"
                align={x.workingHours.length < 2 ? "center" : "start"}
              >
                <Text size="small" weight="bold" color="rgba(117, 117, 117, 1)">
                  {x.day}
                </Text>
                {x.workingHours.length > 0 ? (
                  <Box gap="small" style={{ flexShrink: "0" }}>
                    {x.workingHours.map((x, ind) => (
                      <Box key={ind} direction="row" align="center" gap="small">
                        <TimeRange
                          startLabel={null}
                          endLabel={null}
                          minuteIncrement={15}
                          startMoment={x.start}
                          sameIsValid={false}
                          endMoment={x.end}
                          onChange={(change) => handleEdit(change, index, ind)}
                          className="timeSelectThera"
                        />
                        {/* <Box background="rgba(225, 245, 254, 1)" round="4px" pad="xsmall"><Text size="small" weight="bold">{x.start}</Text></Box> */}
                        {/* <Text size="xsmall">to</Text> */}
                        {/* <Box background="rgba(225, 245, 254, 1)" round="4px" pad="xsmall"><Text size="small" weight="bold">{x.end}</Text></Box> */}
                        <AddCircle
                          size="small"
                          className="noOutline"
                          color="#000"
                          onClick={() => handleAdd(index)}
                        />
                        <Trash
                          size="small"
                          className="noOutline"
                          color="#000"
                          onClick={() => handleRemove(index, ind)}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box direction="row" gap="small" align="center">
                    <Text size="small">No hours on {x.day}</Text>
                    <AddCircle
                      size="small"
                      className="noOutline"
                      color="#000"
                      onClick={() => handleAdd(index)}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          pad="small"
          align="center"
          style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.12)" }}
        >
          <Box
            className="noOutline"
            onClick={createSlots}
            background="rgba(0, 150, 136, 1)"
            width="100%"
            align="center"
            justify="center"
            height={isTabletOrMobile ? "50px" : "max-content"}
            round="4px"
            pad="xsmall"
          >
            <Text size="small">Confirm Schedule</Text>
          </Box>
        </Box>
      </Box>
      {!isTabletOrMobile && (
        <Box
          width="50%"
          style={{ overflowY: "auto" }}
          pad="small"
          height="100%"
          background="rgba(239, 255, 254, 1)"
        >
          <Box direction="row" margin={{ left: "16%", bottom: "2%" }}>
            {" "}
            {workHours.map((x) => (
              <Box key={x.abb} width="14%" round="4px" align="center">
                <Text size="xsmall" weight="bold">
                  {x.abb}
                </Text>
              </Box>
            ))}
          </Box>
          <Box direction="row" gap="1%">
            <Box width="14%">
              {hours.map((x, index) => (
                <Box height="25px" key={index}>
                  <Text
                    size="small"
                    textAlign="end"
                    color="rgba(158, 158, 158, 1)"
                  >
                    {x}
                  </Text>
                </Box>
              ))}
            </Box>
            <Box direction="row" width="85%">
              {workHours.map((day, index) => (
                <Box width="14%" key={index}>
                  {hours.map((x, index) => (
                    <Box
                      height="25px"
                      align="center"
                      key={index}
                      background={
                        determineIftoColor(x, day)
                          ? "rgba(225, 245, 254, 1)"
                          : "white"
                      }
                      style={{ border: " 0.5px solid rgba(0, 0, 0, 0.16)" }}
                    ></Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default function TherapistOnboarding() {
  const [step, setStep] = useState(1);

  const user = useSelector((state) => state.app.user);

  if (user.onboarding) window.location.replace("/dashboard/therapist-complete");

  const getStepAction = () => {
    if (step === 1) return <Welcome setStep={(value) => setStep(value)} />;

    if (step === 2) return <SetupHours />;
    else return null;
  };

  return (
    <>
      <Header />

      <div className="box container onboarding-main">{getStepAction()}</div>
    </>
  );
}

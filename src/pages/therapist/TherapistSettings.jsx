import { Avatar, Box, Text } from "grommet";
import { Add, AddCircle, Lock, ScheduleNew, Trash, User } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAppointmentSlot,
  updateTherapistPassword,
  updateTherapistPicture,
  updateTherapistProfile,
} from "../../redux/therapist/therapistThunks";
import TimeRange from "react-time-range";
import moment from "moment";
import { getAppointmentSchedule } from "../../redux/patient/patientThunks";
import { ThreeDots } from "react-loader-spinner";
import noAvatar from "../../assets/noAvatar.jpeg";
import { useMediaQuery } from "react-responsive";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updateTherapistPassword({
        old_password: oldPassword,
        new_password: newPassword,
      })
    );
  };

  return (
    <>
      <Box gap="small">
        <Text color="rgba(39, 75, 40, 1)">Change Password</Text>
        <form
          method="POST"
          onSubmit={handleSave}
          className="w-100 box-column center-align"
        >
          <div className="labelInputSet">
            <label className="defaultLabel">Old Password</label>

            <input
              type="password"
              name="old_password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              className="defaultInput"
              onChangeCapture={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="labelInputSet">
            <label className="defaultLabel">New Password</label>

            <input
              type="password"
              name="new_password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              className="defaultInput"
              onChangeCapture={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn w-100">
            Update Password
          </button>
        </form>
      </Box>
    </>
  );
};

const GeneralInfo = ({ user }) => {
  const dispatch = useDispatch();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [minutes, setMinutes] = useState(user.minutes_before_booking);
  const [email, setEmail] = useState(user.email);
  const handleFile = (event) => {
    const FD = new FormData();
    FD.append("dp", event.target.files[0]);

    dispatch(updateTherapistPicture({ id: user.id, formdata: FD }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updateTherapistProfile({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        minutes_before_booking: minutes,
      })
    );
  };

  return (
    <>
      <Box gap={isTabletOrMobile ? "large" : "small"}>
        <Text color="rgba(39, 75, 40, 1)">General Info</Text>
        <Box
          direction="row"
          gap={isTabletOrMobile ? "large" : "medium"}
          align="center"
        >
          <Avatar size="large" src={user.dp ? user.dp : noAvatar} />
          <form encType="multipart/form-data">
            <label className="labelText">
              <input
                type="file"
                name="file"
                style={{ marginTop: "2%" }}
                onChange={(event) => handleFile(event)}
              />
              <Box
                direction="row"
                justify="center"
                gap="small"
                pad={!isTabletOrMobile ? "small" : "medium"}
                background="#009688"
                className="noOutline"
                style={{
                  fontSize: "small",
                  color: "white",
                  borderRadius: "8px",
                }}
                align="center"
              >
                <Add size="small" /> Change Picture
              </Box>
            </label>
          </form>
        </Box>
        <form
          method="POST"
          onSubmit={handleSave}
          className="w-100 box-column center-align"
        >
          <div className="labelInputSet">
            <label className="defaultLabel">First Name</label>
            <input
              type="text"
              name="first_name"
              value={firstName}
              onChangeCapture={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Last Name</label>

            <input
              type="text"
              name="last_name"
              value={lastName}
              onChangeCapture={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Minutes before booking</label>

            <input
              type="text"
              name="minutes_before_booking"
              value={minutes}
              onChangeCapture={(e) => setMinutes(e.target.value)}
              placeholder="Minutes before booking"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Email Address</label>

            <input
              type="email"
              name="email"
              value={email}
              onChangeCapture={(e) => setEmail(e.target.value)}
              disabled
              placeholder="Your email address"
              className="defaultInput"
            />
          </div>
          <button type="submit" className="primary-btn w-100">
            Save Changes
          </button>
        </form>
      </Box>
    </>
  );
};

const SetupHours = () => {
  const user = useSelector((state) => state.app.user);
  const therapistSchedule = useSelector(
    (state) => state.patient.therapistSchedule.appointment_slot
  );
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [trigger, setTrigger] = useState(0);

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
  };

  // const hours = [
  //   "12:00 AM",
  //   "01:00 AM",
  //   "02:00 AM",
  //   "03:00 AM",
  //   "04:00 AM",
  //   "05:00 AM",
  //   "06:00 AM",
  //   "07:00 AM",
  //   "08:00 AM",
  //   "09:00 AM",
  //   "10:00 AM",
  //   "11:00 AM",
  //   "12:00 PM",
  //   "01:00 PM",
  //   "02:00 PM",
  //   "03:00 PM",
  //   "04:00 PM",
  //   "05:00 PM",
  //   "06:00 PM",
  //   "07:00 PM",
  //   "08:00 PM",
  //   "09:00 PM",
  //   "10:00 PM",
  //   "11:00 PM",
  // ];

  // const determineIftoColor = (x, day) => {
  //   const thisDay = workHours.find((y) => y.abb === day.abb);

  //   const rangeDict = [];

  //   if (thisDay.workingHours.length < 1) return false;

  //   thisDay.workingHours.forEach((el) => {
  //     let started = moment(el.start);
  //     while (moment(started).isBefore(el.end)) {
  //       rangeDict.push(moment(started).format("hh:00 A"));
  //       started.add(1, "h");
  //     }
  //   });

  //   if (rangeDict.find((e) => e == x)) return true;
  //   else return false;
  // };

  useEffect(() => {
    if (!therapistSchedule)
      dispatch(getAppointmentSchedule({ user_id: user.id }));
  }, []);

  if (!therapistSchedule)
    return <ThreeDots color="black" height={80} width={80} />;

  if (therapistSchedule && trigger === 0) {
    const serialized = Object.entries(therapistSchedule);
    const working = [];

    serialized.forEach((x) => {
      const workingHoursForThisX = [];
      x[1].forEach((y) => {
        workingHoursForThisX.push({
          start: moment()
            .set({
              hours: y.start_time[0] + y.start_time[1],
              minute: y.start_time[3] + y.start_time[4],
              second: 0,
              millisecond: 0,
            })
            .toISOString(),
          end: moment()
            .set({
              hours: y.end_time[0] + y.end_time[1],
              minute: y.end_time[3] + y.end_time[4],
              second: 0,
              millisecond: 0,
            })
            .toISOString(),
        });
      });
      working.push({
        day: x[0].charAt(0).toUpperCase() + x[0].slice(1).toLowerCase(),
        abb: x[0][0] + x[0][1] + x[0][2],
        workingHours: workingHoursForThisX,
      });
    });

    setTrigger(1);
    setWorkHours(working);
  }

  return (
    <>
      <ChangeTimeZone />

      <Box
        width="100%"
        // height="100vh"
        align="center"
        justify="center"
        direction="row"
      >
        <Box
          width={isTabletOrMobile ? "100%" : "100%"}
          background="white"
          // height="100%"
          style={{ maxHeight: "60vh", overflowY: "auto", flexShrink: "0" }}
        >
          <Box gap="small" pad="small" style={{ flexShrink: "0" }}>
            <Box bac direction="row" gap="small" style={{ flexShrink: "0" }}>
              {workHours.map((x) => (
                <Box
                  key={x.abb}
                  pad="xxsmall"
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
            <Box gap="small" style={{ flexShrink: "0" }}>
              {workHours.map((x, index) => (
                <Box
                  key={x.abb}
                  pad="xxsmall"
                  direction="row"
                  gap="small"
                  align={x.workingHours.length < 2 ? "center" : "start"}
                  style={{ flexShrink: "0" }}
                >
                  <Text
                    size="small"
                    weight="bold"
                    color="rgba(117, 117, 117, 1)"
                  >
                    {x.day}
                  </Text>
                  {x.workingHours.length > 0 ? (
                    <Box gap="small" style={{ flexShrink: "0" }}>
                      {x.workingHours.map((x, ind) => (
                        <Box
                          key={ind}
                          direction="row"
                          style={{ flexShrink: "0" }}
                          align="center"
                          gap="small"
                        >
                          <TimeRange
                            startLabel={null}
                            endLabel={null}
                            sameIsValid={false}
                            minuteIncrement={15}
                            startMoment={x.start}
                            endMoment={x.end}
                            onChange={(change) =>
                              handleEdit(change, index, ind)
                            }
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
          <Box pad="small" align="center" style={{ flexShrink: "0" }}>
            <Box
              className="noOutline"
              onClick={createSlots}
              background="rgba(0, 150, 136, 1)"
              width="100%"
              align="center"
              round="4px"
              pad="xsmall"
            >
              <Text size="small">Confirm Schedule</Text>
            </Box>
          </Box>
        </Box>
        {/* {isTabletOrMobile ? null : (
        <Box
          width="50%"
          style={{ overflowY: "auto" }}
          pad="small"
          height="100%"
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
                    size="xsmall"
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
      )} */}
      </Box>
    </>
  );
};

export default function TherapistSettings() {
  const user = useSelector((state) => state.app.user);

  const getWhattoRender = () => {
    if (currentTab === 1) return <GeneralInfo user={user} />;

    if (currentTab === 2) return <ChangePassword user={user} />;

    if (currentTab === 3) return <SetupHours />;
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <Box
      className="w-100 h-100"
      gap={isTabletOrMobile ? "medium" : "small"}
      pad="medium"
      style={{ overflowY: "scroll" }}
    >
      <Text className="ptFont" size="xxlarge" weight="bold">
        Settings
      </Text>
      <Box
        gap={isTabletOrMobile ? "small" : null}
        background="rgba(255, 255, 255, 1)"
        pad="medium"
        direction={isTabletOrMobile ? "column" : "row"}
        style={{
          boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.12)",
          flexShrink: "0",
        }}
        align={isTabletOrMobile ? "center" : null}
        justify={isTabletOrMobile ? "center" : null}
      >
        <Box
          width={isTabletOrMobile ? "100%" : "20%"}
          gap="small"
          direction={isTabletOrMobile ? "row" : "column"}
          align={isTabletOrMobile ? "center" : null}
          justify={isTabletOrMobile ? "center" : null}
        >
          <Box
            className="noOutline"
            onClick={() => setCurrentTab(1)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
            round="full"
          >
            <User color={currentTab === 1 ? "#000" : null} />
            <Text
              color={currentTab === 1 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
            >
              Account
            </Text>
          </Box>
          <Box
            className="noOutline"
            onClick={() => setCurrentTab(2)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
            round="full"
          >
            <Lock color={currentTab === 2 ? "#000" : null} />
            <Text
              color={currentTab === 2 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
            >
              Change Password
            </Text>
          </Box>
          <Box
            className="noOutline"
            onClick={() => setCurrentTab(3)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
            round="full"
          >
            <ScheduleNew color={currentTab === 3 ? "#000" : null} />
            <Text
              color={currentTab === 3 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
            >
              Change Schedule
            </Text>
          </Box>
        </Box>
        <Box width={isTabletOrMobile ? "100%" : "80%"}>{getWhattoRender()}</Box>
      </Box>
    </Box>
  );
}

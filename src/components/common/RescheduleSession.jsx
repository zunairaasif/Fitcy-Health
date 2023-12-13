import { Box, Layer, Text } from "grommet";
import { FormClose } from "grommet-icons";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { CradleLoader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  listAvailableSlots,
  patchAppointment,
} from "../../redux/patient/patientThunks";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ChangeTimeZone from "./ChangeTimeZone";

const RescheduleSession = ({ appointment, setShowLayer }) => {
  const dispatch = useDispatch();

  const bookableSlots = useSelector((state) => state.patient.availableSlots);

  const user = useSelector((state) => state.app.user);
  const [value, onChange] = useState();
  const [chosenTime, setChosenTime] = useState();
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const bookAppointment = () => {
    setBookingInProgress(true);
    dispatch(
      patchAppointment({
        id: appointment.id,
        appointment_time:
          moment(chosenTime).format("YYYY-MM-DDTHH:mm:ss.000") + "Z",
        duration: "01:00:00",
        patient: user.id,
        therapist: appointment.therapist,
        is_active: true,
      })
    );
  };

  const getAvailableSlots = (x) => {
    setChosenTime(null);
    onChange(x);
    dispatch(
      listAvailableSlots({
        therapist_id: appointment.therapist,
        start_date: moment(x).format("YYYY-MM-DD"),
        end_date: moment(x).format("YYYY-MM-DD"),
      })
    );
  };

  const minimum = new Date();

  minimum.setDate(new Date().getDate() + 1);

  const getWhattoShow = () => {
    if (
      value &&
      bookableSlots[moment(value).format("YYYY-MM-DD")] &&
      bookableSlots[moment(value).format("YYYY-MM-DD")].length > 0
    )
      return (
        <Box gap="small" style={{ overflowY: "scroll" }}>
          {bookableSlots[moment(value).format("YYYY-MM-DD")].map((x, index) => (
            <Box
              pad="xsmall"
              style={{
                border: "1px solid rgba(0, 150, 136, 1)",
                flexShrink: "0",
              }}
              background={
                chosenTime === value.setHours(x[0] + x[1], x[3] + x[4])
                  ? "rgba(0, 150, 136, 1)"
                  : null
              }
              align="center"
              justify="center"
              round="8px"
              className="noOutline"
              key={index}
              onClick={() => {
                setChosenTime(value.setHours(x[0] + x[1], x[3] + x[4]));
              }}
            >
              <Text size="small">{x}</Text>
            </Box>
          ))}
        </Box>
      );
    else if (
      value &&
      bookableSlots[moment(value).format("YYYY-MM-DD")] &&
      bookableSlots[moment(value).format("YYYY-MM-DD")].length === 0
    )
      return (
        <Text size="small" width="100%" textAlign="center">
          No slots for this date
        </Text>
      );
  };

  if (!bookableSlots) return <CradleLoader />;

  return (
    <Layer plain style={{ minWidth: "40%", maxHeight: "70%" }}>
      <Box
        background="white"
        pad="medium"
        margin="xsmall"
        style={{
          boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        gap="medium"
        direction="row"
        justify="between"
      >
        <Box gap="small">
          <Text size="small" weight="bold">
            Rescheduling Session on{" "}
            {moment(appointment.local_time)
              .parseZone()
              .format("DD-MM-YY hh:mm a")}
          </Text>
          <Box justify="between" direction="row">
            <Text weight="bold">Select Date</Text>
          </Box>
          <Box className="divider" />

          <Box>
            <Calendar
              onChange={getAvailableSlots}
              minDate={minimum}
              value={value}
              //   tileDisabled={determineIfDateAllowed}
            />
          </Box>
        </Box>
        <Box gap="small">
          <Box style={{ flexShrink: "0" }}>
            <Box justify="between" direction="row">
              <Text weight="bold">Select Available Time</Text>
              <Box
                className="noOutline"
                margin={{ left: "medium" }}
                onClick={() => setShowLayer(false)}
              >
                <FormClose />
              </Box>
            </Box>
            <ChangeTimeZone />
          </Box>
          <Text color="#009688">{moment(value).format("ddd, DD MMMM")}</Text>
          <Box className="divider" />

          {value
            ? // <Box>
              getWhattoShow()
            : // </Box>
              null}
          {chosenTime ? (
            <Box
              style={{ flexShrink: "0" }}
              margin={{ top: "large" }}
              onClick={!bookingInProgress ? bookAppointment : () => {}}
              pad="small"
              className="noOutline"
              round="8px"
              background="rgba(0, 150, 136, 1)"
              width="100%"
              alignSelf="center"
              align="center"
            >
              <Text size="small" color="white">
                Confirm Booking
              </Text>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Layer>
  );
};

export default RescheduleSession;

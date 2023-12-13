import { Box, Layer, Text } from "grommet";
import { FormClose } from "grommet-icons";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { CradleLoader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointmentSchedule,
  scheduleNewAppointment,
} from "../../redux/patient/patientThunks";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const BookSession = ({ therapistID, setShowLayer }) => {
  const dispatch = useDispatch();
  const therapistSchedule = useSelector(
    (state) => state.patient.therapistSchedule.appointment_slot
  );
  const therapistAppointments = useSelector(
    (state) => state.patient.upcomingAppointments
  );

  const user = useSelector((state) => state.app.user);
  const [value, onChange] = useState();
  const [chosenTime, setChosenTime] = useState();
  const [chosenTimeEnd, setChosenTimeEnd] = useState();

  const bookAppointment = () => {
    dispatch(
      scheduleNewAppointment({
        appointment_time:
          moment(chosenTime).format("YYYY-MM-DDTHH:mm:ss.000") + "Z",
        duration:
          Math.abs(
            0 +
              moment
                .duration(moment(chosenTimeEnd).diff(moment(chosenTime)))
                .asHours()
          ) + ":00:00.0000",
        patient: user.id,
        therapist: therapistID,
        is_active: true,
      })
    );
  };

  useEffect(() => {
    dispatch(getAppointmentSchedule({ user_id: therapistID }));
  }, []);

  const determineIfDateAllowed = ({ date }) => {
    const daysAllowed = [];
    const arraySchedule = Object.entries(therapistSchedule);
    arraySchedule.forEach((x, index) => {
      if (x[1].length > 0) daysAllowed[index] = 1;
      else daysAllowed[index] = 0;
    });

    if (date.getDay() !== 0 && daysAllowed[date.getDay() - 1]) return false;

    if (date.getDay() === 0 && daysAllowed[6]) return false;
    else return true;
  };

  const getWhattoShow = () => {
    const arraySchedule = Object.entries(therapistSchedule);

    const test = [];
    arraySchedule[value.getDay() > 0 ? value.getDay() - 1 : 6][1].forEach(
      (x) => {
        var duration = moment.duration(
          moment(
            value.setHours(
              x.end_time[0] + x.end_time[1],
              x.end_time[3] + x.end_time[4]
            )
          ).diff(
            moment(
              value.setHours(
                x.start_time[0] + x.start_time[1],
                x.start_time[3] + x.start_time[4]
              )
            )
          )
        );
        var hours = duration.asHours();
        var time = x.start_time;

        for (let i = 0; i < hours; i++) {
          var totalInMinutes =
            parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);

          var otherMinutes = 60;

          var grandTotal = otherMinutes + totalInMinutes;

          //Now using your own code

          var bookH = Math.floor(grandTotal / 60);
          var bookM = grandTotal % 60;
          var bookingDurationToHour =
            bookH > 9
              ? bookH + ":" + bookM + "0:00"
              : "0" + bookH + ":" + bookM + "0:00";

          test.push({ start_time: time, end_time: bookingDurationToHour });
          time = bookingDurationToHour;
        }
      }
    );

    const checkIfExistingAppointment = (x) => {
      let found = null;
      therapistAppointments.forEach((y) => {
        const appointStart =
          y.local_time[11] +
          y.local_time[12] +
          y.local_time[13] +
          y.local_time[14] +
          y.local_time[15] +
          y.local_time[16] +
          y.local_time[17] +
          y.local_time[18];
        if (
          new Date(y.local_time).toDateString() === value.toDateString() &&
          x.start_time === appointStart
        )
          found = true;
      });

      return found;
    };

    return (
      <Box gap="small" style={{ overflowY: "scroll" }}>
        {test.map((x, index) => (
          <Box
            pad="xsmall"
            background={
              checkIfExistingAppointment(x)
                ? "red"
                : chosenTime ===
                  value.setHours(
                    x.start_time[0] + x.start_time[1],
                    x.start_time[3] + x.start_time[4]
                  )
                ? "rgba(0, 150, 136, 1)"
                : null
            }
            style={{
              border: "1px solid rgba(0, 150, 136, 1)",
              flexShrink: "0",
            }}
            align="center"
            justify="center"
            round="8px"
            className="noOutline"
            key={index}
            onClick={() => {
              checkIfExistingAppointment(x)
                ? () => {}
                : setChosenTime(
                    value.setHours(
                      x.start_time[0] + x.start_time[1],
                      x.start_time[3] + x.start_time[4]
                    )
                  );
              setChosenTimeEnd(
                value.setHours(
                  x.end_time[0] + x.end_time[1],
                  x.end_time[3] + x.end_time[4]
                )
              );
            }}
          >
            <Text size="small">
              {moment(
                value.setHours(
                  x.start_time[0] + x.start_time[1],
                  x.start_time[3] + x.start_time[4]
                )
              ).format("hh a")}{" "}
              -&nbsp;
              {moment(
                value.setHours(
                  x.end_time[0] + x.end_time[1],
                  x.end_time[3] + x.end_time[4]
                )
              ).format("hh a")}
              {/* {checkIfExistingAppointment(value, x) ? "yes" : "no"} */}
            </Text>
          </Box>
        ))}
      </Box>
    );
  };

  if (!therapistSchedule) return <CradleLoader />;

  return (
    <Layer plain style={{ minWidth: "40%", maxHeight: "65%" }}>
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
          <Box justify="between" direction="row">
            <Text weight="bold">Select Date</Text>
          </Box>
          <Box className="divider" />

          <Box>
            <Calendar
              onChange={onChange}
              minDate={new Date()}
              value={value}
              tileDisabled={determineIfDateAllowed}
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
            <Text size="small">
              Your local timezone is <b> {user.timezone}</b>
            </Text>
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
              onClick={bookAppointment}
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

export default BookSession;

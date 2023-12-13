import { Box, Layer, Text } from "grommet";
import { FormClose, FormPreviousLink } from "grommet-icons";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { CradleLoader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { listAvailableSlots } from "../../redux/patient/patientThunks";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ChangeTimeZone from "./ChangeTimeZone";
import { useMediaQuery } from "react-responsive";
import {
  getSinglePatient,
  scheduleNewAppointmentAdmin,
} from "../../redux/app/appThunks";

const BookSessionAdmin = ({ patientID, therapistID, setShowLayer }) => {
  const dispatch = useDispatch();

  const bookableSlots = useSelector((state) => state.patient.availableSlots);
  const [internalStep, setInternalStep] = useState(1);
  const [chosenTime, setChosenTime] = useState();
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const allTherapists = useSelector((state) => state.app.therapist_list);

  const bookAppointment = () => {
    setBookingInProgress(true);
    dispatch(
      scheduleNewAppointmentAdmin({
        appointment_time:
          moment(chosenTime).format("YYYY-MM-DDTHH:mm:ss.000") + "Z",
        duration: "01:00:00",
        patient: patientID,
        therapist: therapistID,
        is_active: true,
      })
    );
    dispatch(getSinglePatient({ patientID: patientID }));
    setShowLayer(false);
  };

  useEffect(() => {
    dispatch(
      listAvailableSlots({
        therapist_id: therapistID,
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        end_date: moment(new Date()).format("YYYY-MM-DD"),
      })
    );
    onChange(new Date());
  }, []);

  const getAvailableSlots = (x) => {
    setChosenTime(null);
    onChange(x);
    dispatch(
      listAvailableSlots({
        therapist_id: therapistID,
        start_date: moment(x).format("YYYY-MM-DD"),
        end_date: moment(x).format("YYYY-MM-DD"),
      })
    );
  };

  const minimum = new Date();

  minimum.setDate(new Date().getDate() + 1);
  const [value, onChange] = useState(minimum);

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
    <Layer
      onClickOutside={() => setShowLayer(false)}
      plain
      style={{
        minWidth: "40%",
        maxHeight: "55%",
        width: isTabletOrMobile ? "80%" : null,
      }}
    >
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
        justify={isTabletOrMobile ? "center" : "between"}
        // justify="between"
      >
        {(!isTabletOrMobile || internalStep === 1) && (
          <Box gap="small">
            <Box justify="between">
              <Text size="small">
                <b>Therapist:</b>{" "}
                {allTherapists.find((x) => x.id === therapistID).first_name}{" "}
                {allTherapists.find((x) => x.id === therapistID).last_name}
              </Text>
              {/* <Text weight="bold">Select Date</Text> */}
            </Box>
            <Box className="divider" />

            <Box>
              <Calendar
                onChange={getAvailableSlots}
                minDate={new Date()}
                value={value}
                // defaultValue={minimum}
                //   tileDisabled={determineIfDateAllowed}
              />
            </Box>

            {isTabletOrMobile && (
              <Box width="100%" align="center" margin={{ top: "medium" }}>
                <Box
                  width="80%"
                  align="center"
                  background="#009688"
                  pad="small"
                  round="20px"
                  onClick={() => setInternalStep(2)}
                  className="noOutline"
                >
                  <Text size="small" color="white">
                    Confirm
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        )}
        {(!isTabletOrMobile || internalStep === 2) && (
          <Box gap="small" width={isTabletOrMobile ? "100%" : null}>
            {isTabletOrMobile && (
              <div
                className="noOutline"
                onClick={() => setInternalStep(1)}
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
            )}
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
        )}
      </Box>
    </Layer>
  );
};

export default BookSessionAdmin;

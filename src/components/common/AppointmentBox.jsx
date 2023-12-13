import { Box, Layer, Text } from "grommet";
import { Calendar, Clock } from "grommet-icons";
import { delay } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../redux/app/appThunks";
import { deleteAppointment } from "../../redux/patient/patientThunks";
import {
  getTherapistPatients,
  getUpcomingAppointmentsTherapist,
} from "../../redux/therapist/therapistThunks";
import RescheduleSession from "./RescheduleSession";
import {
  videoCallLog,
  getTherapistList,
} from "../../redux/patient/patientThunks";

export default function AppointmentBox({ appointment, isPast }) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [deleting, setDeleting] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const user = useSelector((state) => state.app.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [idToDelete, setIDtoDelete] = useState();
  const handleRoute = async () => {
    navigate(
      `/dashboard/session?` + appointment.patient + "&app_id=" + appointment.id,
      {
        state: { user: user.id, appointment: appointment.id },
      }
    );

    dispatch(
      videoCallLog({
        action: "JOIN",
        user: user.id,
        appointment: appointment.id,
      })
    );
  };

  const cancelSession = (id) => {
    setDeleting(true);
    setIDtoDelete(id);
    setShow(true);
  };

  const rescheduleSession = () => {
    setRescheduling(true);
  };

  const handleClose = () => {
    setShow(false);
    if (user.role === "PATIENT") dispatch(getMe());

    dispatch(getUpcomingAppointmentsTherapist());
  };

  const patients = useSelector((state) => state.therapist.therapistPatients);
  const therapists = useSelector((state) => state.patient.therapist_list);

  useEffect(() => {
    if (!patients && user.role !== "PATIENT")
      dispatch(getTherapistPatients({ therapist: user.id }));
    else {
      dispatch(getTherapistList());
    }
  }, []);

  const getPatientName = (id) => {
    if (patients) {
      const thisPatient = patients.find((x) => x.patient.id === id);
      if (thisPatient)
        return (
          thisPatient.patient.first_name + " " + thisPatient.patient.last_name
        );
      else return " ";
    } else return " ";
  };

  const getTherapistName = (id) => {
    if (therapists) {
      const thistherapist = therapists.find((x) => x.id === id);
      if (thistherapist)
        return thistherapist.first_name + " " + thistherapist.last_name;
      else return " ";
    } else return " ";
  };

  return (
    <>
      {rescheduling && (
        <RescheduleSession
          appointment={appointment}
          setShowLayer={(value) => setRescheduling(value)}
        />
      )}
      {show && (
        <Layer
          plain
          style={{ minWidth: "40%", maxHeight: "60%" }}
          onEsc={() => handleClose()}
          onClickOutside={() => handleClose()}
        >
          <Box
            background="white"
            pad="medium"
            margin="xsmall"
            style={{
              boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            }}
            round="8px"
            gap="small"
            align="center"
            justify="center"
          >
            <Box
              width="100%"
              justify="end"
              direction="row"
              align="center"
            ></Box>
            <Text size="small">
              Are you sure you want to cancel this appointment?
            </Text>
            <Box direction="row" gap="small">
              <Box
                onClick={() => {
                  setSaidYes(true);
                  delay(() => {
                    dispatch(deleteAppointment({ idToDelete }));
                    setDeleting(false);
                    setShow(false);
                    dispatch(getMe());
                  }, 2000);
                }}
                pad="small"
                background="#009688"
                round="10px"
                className="noOutline"
                align="center"
                justify="center"
                width="150px"
                style={{ cursor: "pointer" }}
              >
                {saidYes ? (
                  <ThreeDots width={30} height={10} color="white" />
                ) : (
                  <Text size="small" color="white">
                    Yes
                  </Text>
                )}
              </Box>
              <Box
                onClick={() => {
                  setSaidYes(false);
                  setIDtoDelete(null);
                  setDeleting(false);
                  setShow(false);
                }}
                pad="small"
                justify="center"
                background="#f76a6a"
                round="10px"
                className="noOutline"
                align="center"
                width="150px"
                style={{ cursor: "pointer" }}
              >
                <Text size="small" color="white">
                  No
                </Text>
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
      <Box
        width={isTabletOrMobile ? "100%" : "100%"}
        pad={isTabletOrMobile ? "large" : "medium"}
        background="white"
        style={{ flexShrink: "0" }}
        className="box-row therapist-profile"
      >
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
                  fontSize: isTabletOrMobile ? "medium" : "large",
                  marginBottom: "5px",
                }}
              >
                Session with{" "}
                <span style={{ color: "rgba(0, 150, 136, 1)" }}>
                  {user.role === "THERAPIST"
                    ? getPatientName(appointment.patient)
                    : getTherapistName(appointment.therapist)}
                </span>
              </div>
            </div>
          </div>
          <Box gap="medium" direction="row" align="center">
            <Box gap="small" direction="row" align="center">
              <Calendar color="#101112" />
              <Text size="small" color="#101112" style={{ fontWeight: "600" }}>
                {moment
                  .parseZone(
                    appointment.local_time
                      ? appointment.local_time
                      : appointment.appointment_time
                  )
                  .format("ddd DD, MMMM")}
              </Text>
            </Box>
            <Box direction="row" gap="small" align="center">
              <Clock color="#101112" />
              {/* <Text size="small">{moment(upcomingAppointments[upcomingAppointments.length - 1].appointment_time).format("hha")} - {upcomingAppointments[upcomingAppointments.length - 1].duration} </Text> */}
              <Text size="small" color="#101112" style={{ fontWeight: "600" }}>
                {moment
                  .parseZone(
                    appointment.local_time
                      ? appointment.local_time
                      : appointment.appointment_time
                  )
                  .format("hh:mm a")}
              </Text>
            </Box>
          </Box>
          {isPast ? null : (
            <div className="box-row">
              <button onClick={handleRoute} className="third-btn">
                Join Session
              </button>
              {/* <button onClick={handleRoute} className="third-btn">Reschedule</button> */}
              {user.role === "PATIENT" ? (
                <button
                  disabled={deleting}
                  onClick={() => cancelSession(appointment.id)}
                  className="red-btn"
                >
                  {" "}
                  {!deleting ? (
                    "Cancel Session"
                  ) : (
                    <ThreeDots height={10} color="red" />
                  )}
                </button>
              ) : null}

              {user.role === "PATIENT" ? (
                <button
                  disabled={rescheduling}
                  onClick={() => rescheduleSession(appointment.id)}
                  className="third-btn"
                >
                  {" "}
                  {!deleting ? (
                    "Reschedule"
                  ) : (
                    <ThreeDots height={10} color="red" />
                  )}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </Box>
    </>
  );
}

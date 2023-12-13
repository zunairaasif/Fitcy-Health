import { Box, Text } from "grommet";
import { FormAdd } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppointmentBox from "../../components/common/AppointmentBox";
// import BookSession from "../../components/common/BookSession";
import BookSessionNew from "../../components/common/BookSessionNew";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import {
  getAllAppointmentsPatient,
  getUpcomingAppointments,
} from "../../redux/patient/patientThunks";
import noAppointment from "../../assets/noAppointment.svg";

export default function Appoinments() {
  const [showBookSession, setShowBookSession] = useState(false);
  const upcomingAppointments = useSelector(
    (state) => state.patient.upcomingAppointments
  );
  const allAppointments = useSelector(
    (state) => state.patient.all_appointments
  );
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  useEffect(() => {
    dispatch(getUpcomingAppointments());
    dispatch(getAllAppointmentsPatient());
  }, []);

  const [tab, setTab] = useState(0);

  return (
    <>
      {showBookSession ? (
        <BookSessionNew
          therapistID={user.current_therapist.id}
          setShowLayer={(value) => setShowBookSession(value)}
        />
      ) : null}

      <Box className="w-100 h-100" gap="small" pad="medium">
        <Text className="ptFont" size="xxlarge" weight="bold">
          Appointments
        </Text>
        <ChangeTimeZone />
        <Box
          width="100%"
          direction="row"
          justify="between"
          style={{ borderBottom: "1px solid #00000024", flexShrink: "0" }}
        >
          <Box direction="row" gap="small">
            <Box
              pad="small"
              style={{ borderBottom: tab === 0 ? "1px solid #009688" : null }}
              onClick={() => setTab(0)}
              className="noOutline"
            >
              <Text
                size="small"
                weight={tab === 0 ? "bold" : null}
                color={tab === 0 ? "#009688" : null}
              >
                Upcoming
              </Text>
            </Box>
            <Box
              pad="small"
              style={{ borderBottom: tab === 1 ? "1px solid #009688" : null }}
              onClick={() => setTab(1)}
              className="noOutline"
            >
              <Text
                size="small"
                weight={tab === 1 ? "bold" : null}
                color={tab === 1 ? "#009688" : null}
              >
                Past
              </Text>
            </Box>
          </Box>
          <Box
            pad="small"
            style={{ cursor: "pointer", fontSize: "small", color: "#009688" }}
            direction="row"
            gap="xsmall"
            className="noOutline"
            onClick={() => setShowBookSession(true)}
            round="50px"
            align="center"
            justify="center"
          >
            <FormAdd color="#009688" />
            Book New Session
          </Box>
        </Box>
        <Box gap="small" style={{ overflowY: "auto" }}>
          {tab === 0
            ? upcomingAppointments
              ? upcomingAppointments.map((x) => (
                  <AppointmentBox key={x.id} appointment={x} />
                ))
              : null
            : allAppointments
            ? allAppointments.map((x) =>
                new Date(x.appointment_time) < new Date() ? (
                  <AppointmentBox key={x.id} appointment={x} isPast={true} />
                ) : null
              )
            : null}
        </Box>
        {tab === 0 &&
        upcomingAppointments &&
        upcomingAppointments.length === 0 ? (
          <Box
            height="100%"
            align="center"
            justify="center"
            gap="small"
            // direction=""
          >
            <img src={noAppointment} width="20%" />

            <Text textAlign="center" size="small">
              You have no upcoming appointments. Schedule your next session with
              your therapist
            </Text>
          </Box>
        ) : null}
        {tab === 1 && allAppointments && allAppointments.length === 0 ? (
          <Box
            height="100%"
            align="center"
            justify="center"
            gap="small"
            // direction=""
          >
            <img src={noAppointment} width="20%" />

            <Text textAlign="center" size="small">
              You have no past appointments. Schedule your next session with
              your therapist
            </Text>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

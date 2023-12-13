import { Box, Text } from "grommet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AppointmentBox from "../../components/common/AppointmentBox";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import {
  getAllAppointmentsTherapist,
  getUpcomingAppointmentsTherapist,
} from "../../redux/therapist/therapistThunks";

export default function TherapistAppoinments() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const upcomingAppointments = useSelector(
    (state) => state.therapist.upcomingAppointments
  );
  const allAppointments = useSelector(
    (state) => state.therapist.all_appointments
  );
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.app.user);
  useEffect(() => {
    dispatch(getUpcomingAppointmentsTherapist());
    dispatch(getAllAppointmentsTherapist());
  }, []);

  const [tab, setTab] = useState(0);

  return (
    <>
      <Box className="w-100 h-100" gap="small" pad="medium">
        <Text className="ptFont" size="xxlarge" weight="bold">
          Appointments
        </Text>
        <ChangeTimeZone />
        <Box
          width="100%"
          direction="row"
          style={{
            borderBottom: "1px solid #00000024",
            flexShrink: "0",
            background: isTabletOrMobile ? "white" : "null",
          }}
        >
          <Box direction="row" width="100%">
            <Box
              pad="small"
              direction="row"
              justify="center"
              width="20%"
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
              direction="row"
              justify="center"
              width="20%"
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
        </Box>
        <Box gap="medium" height="100%" style={{ overflowY: "auto" }}>
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
          {tab === 0 &&
          upcomingAppointments &&
          upcomingAppointments.length === 0 ? (
            <Box
              height="100%"
              align="center"
              justify="center"
              gap="small"
              direction="row"
            >
              <Text>No appointments have been made yet</Text>
            </Box>
          ) : null}
          {tab === 1 && allAppointments && allAppointments.length === 0 ? (
            <Box
              height="100%"
              align="center"
              justify="center"
              gap="small"
              direction="row"
            >
              <Text>No past appointments</Text>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}

import { Box, Text } from "grommet";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGreetingTime } from "../../services/globalFunctions";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import {
  getTherapistPatients,
  getUpcomingAppointmentsTherapist,
} from "../../redux/therapist/therapistThunks";
import { Calendar, Clock, Group } from "grommet-icons";
import { useNavigate } from "react-router-dom";
import { Calendar as ReactCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMediaQuery } from "react-responsive";
import _ from "lodash";
import { videoCallLog } from "../../redux/patient/patientThunks";
export default function TherapistDashboardComplete() {
  const user = useSelector((state) => state.app.user);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const localizer = momentLocalizer(moment);
  let events = [];
  const upcomingAppointments = useSelector(
    (state) => state.therapist.upcomingAppointments
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRoute = (id, appointment) => {
    dispatch(
      videoCallLog({
        action: "JOIN",
        user: user.id,
        appointment: appointment,
      })
    );
    navigate(`/dashboard/session?` + id + "&app_id=" + appointment);
  };
  const patients = useSelector((state) => state.therapist.therapistPatients);
  // const schedule = useSelector((state) => state.patient.therapistSchedule.appointment_slot);
  let sortedPatients;
  if (patients) {
    sortedPatients = _.cloneDeep(patients);
    sortedPatients.reverse();
  }

  useEffect(() => {
    dispatch(getUpcomingAppointmentsTherapist());
    dispatch(getTherapistPatients({ therapist: user.id }));
    // dispatch(getAppointmentSchedule({ user_id: user.id }))
  }, []);
  const getActivePatientsLength = (patients) => {
    let count = 0;
    patients.forEach((p) => {
      if (p.is_active) count = count + 1;
    });
    return count;
  };
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
  if (upcomingAppointments && upcomingAppointments.length > 0) {
    events = [];
    upcomingAppointments.forEach((x) => {
      const starting = new Date(x.local_time).setHours(
        moment.parseZone(x.local_time).hours()
      );
      const statingAdj = new Date(starting);
      const endingAdj = new Date(starting);
      endingAdj.setHours(endingAdj.getHours() + 1);
      events.push({
        start: statingAdj,
        end: new Date(endingAdj),
        title: "Session with " + getPatientName(x.patient),
      });
    });
  }

  if (!user.onboarding && user.role === "THERAPIST")
    window.location.replace("/dashboard/therapist-onboarding");

  console.log(events);
  return (
    <>
      <Box
        className="w-100 h-100"
        style={{ overflowY: "auto" }}
        gap="small"
        pad="medium"
      >
        <Text className="ptFont">
          {getGreetingTime(moment())},{" "}
          <b>
            {" "}
            {user.first_name} {user.last_name}
          </b>
        </Text>
        <ChangeTimeZone />
        <Box className="divider" />
        <Box
          width="100%"
          direction={isTabletOrMobile ? "column" : "row"}
          gap="small"
          style={{ flexShrink: "0" }}
        >
          <Box
            width={isTabletOrMobile ? "100%" : "50%"}
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.18)",
              flexShrink: "0",
            }}
          >
            <Box
              background="#FFEB3B"
              pad="small"
              direction="row"
              align="center"
              gap="small"
              style={{ flexShrink: "0" }}
            >
              <Box background="white" round="full" pad="small">
                <Group />
              </Box>
              <Box>
                <Text size="small" weight="bold">
                  Recent Upcoming Appointments
                </Text>
              </Box>
            </Box>
            {/* <Box background="white" pad="small">
              <Text size="small"> Recent Upcoming Appointments</Text>
            </Box> */}
            <Box
              pad="small"
              height="100%"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {patients &&
                upcomingAppointments &&
                upcomingAppointments.length > 0 &&
                upcomingAppointments.map((x) => (
                  <>
                    <Box
                      justify="between"
                      align="center"
                      pad="small"
                      key={x.id}
                      direction="row"
                      style={{
                        borderBottom: isTabletOrMobile
                          ? null
                          : "1px solid #80808020",
                        flexShrink: "0",
                      }}
                    >
                      <Box gap="small">
                        <Text size="small">
                          Session with{" "}
                          <span style={{ color: "rgba(0, 150, 136, 1)" }}>
                            {getPatientName(x.patient)}
                          </span>
                        </Text>
                        <Box gap="medium" direction="row" align="center">
                          <Box gap="small" direction="row" align="center">
                            <Calendar />
                            <Text size="small">
                              {moment
                                .parseZone(x.local_time)
                                .format("ddd DD, MMMM")}
                            </Text>
                          </Box>
                          <Box direction="row" gap="small" align="center">
                            <Clock />
                            {/* <Text size="small">{moment(upcomingAppointments[upcomingAppointments.length - 1].appointment_time).format("hha")} - {upcomingAppointments[upcomingAppointments.length - 1].duration} </Text> */}
                            <Text size="small">
                              {moment.parseZone(x.local_time).format("hh:mm a")}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                      {isTabletOrMobile ? null : (
                        <Box
                          className="noOutline"
                          background="rgba(0, 150, 136, 1)"
                          round="20px"
                          pad="xsmall"
                          onClick={() => handleRoute(x.patient, x.id)}
                        >
                          <Text size="small">Join Session</Text>
                        </Box>
                      )}
                    </Box>
                    {isTabletOrMobile && (
                      <div style={{ marginBottom: "12px" }}>
                        <Box
                          className="noOutline"
                          align="center"
                          justify="center"
                          direction="row"
                          height={{ min: "30px" }}
                          margin={{ top: "xsmall", bottom: "xsmall" }}
                          background="rgba(0, 150, 136, 1)"
                          round="20px"
                          pad="xsmall"
                          onClick={() => handleRoute(x.patient, x.id)}
                        >
                          <Text size="small">Join Session</Text>
                        </Box>
                        <Box
                          style={{
                            width: "100%",
                            borderBottom: "1px solid #80808020",
                          }}
                          pad="xsmall"
                        ></Box>
                      </div>
                    )}
                  </>
                ))}
              {patients &&
              upcomingAppointments &&
              upcomingAppointments.length === 0 ? (
                <Box width="100%" justify="center" height="100%" align="center">
                  <Text size="small">No appointments</Text>
                </Box>
              ) : null}
            </Box>
            <Box
              style={{
                borderTop: "1px solid #80808020",
                cursor: "pointer",
                flexShrink: "0",
              }}
              className="noOutline"
              onClick={() => navigate("/dashboard/therapist-appointments")}
              background="white"
              pad="small"
              align="center"
            >
              <Text size="small"> View all</Text>
            </Box>
          </Box>
          <Box
            width={isTabletOrMobile ? "100%" : "50%"}
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.18)",
              flexShrink: "0",
            }}
          >
            <Box
              background="#FFEB3B"
              pad="small"
              direction="row"
              align="center"
              gap="small"
            >
              <Box background="white" round="full" pad="small">
                <Group />
              </Box>
              <Box>
                <Text size="small" weight="bold">
                  {patients ? getActivePatientsLength(patients) : null} Clients
                </Text>
              </Box>
            </Box>

            <Box pad="small" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {sortedPatients &&
                sortedPatients.length > 0 &&
                sortedPatients.map((x) =>
                  x.is_active ? (
                    <Box
                      justify="between"
                      align="center"
                      pad="small"
                      key={x.id}
                      direction="row"
                      style={{
                        borderBottom: "1px solid #80808020",
                        flexShrink: "0",
                      }}
                    >
                      <Box gap="small">
                        <Text size="small">
                          {x.patient.first_name} {x.patient.last_name}
                        </Text>
                      </Box>
                    </Box>
                  ) : null
                )}
            </Box>
          </Box>
        </Box>
        {isTabletOrMobile ? null : (
          <ReactCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: 500,
              flexShrink: "0",
              fontSize: "small",
              background: "#fff",
              padding: "2%",
            }}
            // views={['week']}
            defaultView="week"
          />
        )}
      </Box>
    </>
  );
}

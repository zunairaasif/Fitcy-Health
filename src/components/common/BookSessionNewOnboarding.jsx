import { Box, Layer, Select, Text } from "grommet";
import { Clear, FormClose } from "grommet-icons";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { CradleLoader, TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeZoneOptions,
  listAvailableSlotsUnAuth,
} from "../../redux/patient/patientThunks";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import _, { delay } from "lodash";
import { Sun, FormNext, FormPrevious } from "grommet-icons";
import { useRef } from "react";
import styled from "styled-components";
import { useCalendarState } from "@react-stately/calendar";
import { useCalendar, useCalendarGrid } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { createCalendar } from "@internationalized/date";
import { Button } from "./Button";
import { CalendarCell } from "./CalendarCell";
import info from "../../assets/onboarding/info.svg";
import {
  changeTherapist,
  scheduleNewAppointmentAdmin,
} from "../../redux/app/appThunks";
import { toast } from "react-toastify";
// import { today, getLocalTimeZone } from "@internationalized/date";

const StyledWeekView = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
`;

const BookSessionNewOnboarding = ({ therapistID }, props) => {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const onboardingTherapist = useSelector(
    (state) => state.onboarding.onboarding_therapist
  );
  const bookableSlots = useSelector((state) => state.patient.availableSlots);
  const day = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  // const [internalStep, setInternalStep] = useState(1);
  const [chosenTime, setChosenTime] = useState();
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [currentDay, setCurrentDay] = useState(null);
  const [bookableLoading, setBookableLoading] = useState(false);

  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    visibleDuration: { weeks: 1 },
    locale,
    createCalendar,
  });
  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state,
    ref
  );
  let { gridProps } = useCalendarGrid(props, state);
  const minimum = moment().parseZone()._d;
  const [value, onChange] = useState(minimum._d);

  const bookAppointment = () => {
    setBookingInProgress(true);
    window.localStorage.setItem(
      "guided-selected-slot",
      JSON.stringify({
        appointment_time:
          moment(chosenTime).format("YYYY-MM-DDTHH:mm:ss.000") + "Z",
        duration: "01:00:00",
        // patient: patientID,
        therapist: therapistID,
        is_active: true,
      })
    );
    window.localStorage.setItem(
      "guided-selected-therapist",
      JSON.stringify(onboardingTherapist)
    );
    if (!user) window.location.href = `/sign-up`;
    else if (user && !user.package)
      window.location.href = "/dashboard/package-confirmation";
    else if (
      user &&
      user.package &&
      user.package.tier === onboardingTherapist.tier
    ) {
      if (onboardingTherapist.id !== user.current_therapist.id) {
        dispatch(changeTherapist({ therapist_id: onboardingTherapist.id }));
        dispatch(
          scheduleNewAppointmentAdmin({
            ...JSON.parse(window.localStorage.getItem("guided-selected-slot")),
            patient: user.id,
          })
        );

        delay(() => {
          window.localStorage.removeItem("guided-selected-therapist");
          window.localStorage.removeItem("guided-selected-slot");
          window.localStorage.removeItem("from-guided-journey");
          window.localStorage.removeItem("fitcy_onboarding_package_id");
          window.localStorage.removeItem("fitcy_onboarding_payment_id");
          window.localStorage.removeItem("fitcy_onboarding_client_secret");
          window.localStorage.removeItem("fitcy_onboarding_therapist_id");

          window.location.href = "/dashboard/patient-complete";
        }, 4000);
      } else {
        dispatch(
          scheduleNewAppointmentAdmin({
            ...JSON.parse(window.localStorage.getItem("guided-selected-slot")),
            patient: user.id,
          })
        );

        delay(() => {
          window.localStorage.removeItem("guided-selected-therapist");
          window.localStorage.removeItem("guided-selected-slot");
          window.localStorage.removeItem("from-guided-journey");
          window.localStorage.removeItem("fitcy_onboarding_package_id");
          window.localStorage.removeItem("fitcy_onboarding_payment_id");
          window.localStorage.removeItem("fitcy_onboarding_client_secret");
          window.localStorage.removeItem("fitcy_onboarding_therapist_id");

          window.location.href = "/dashboard/patient-complete";
        }, 4000);
      }
    } else if (
      user &&
      user.package &&
      user.package.tier !== onboardingTherapist.tier
    ) {
      toast.error("Therapist of different tier");
    }
  };

  useEffect(() => {
    dispatch(
      listAvailableSlotsUnAuth({
        therapist_id: therapistID,
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        end_date: moment(new Date()).format("YYYY-MM-DD"),
        timezone: moment.tz.guess(),
      })
    );
    let today = new Date();
    onChange(moment().parseZone()._d);
    setCurrentDay(
      today.getDay() == 0 ? state.getDatesInWeek(0).length - 1 : today.getDay()
    );
  }, []);

  const getAvailableSlots = (x, day) => {
    setChosenTime(null);
    setCurrentDay(day);
    onChange(x);
    dispatch(
      listAvailableSlotsUnAuth({
        therapist_id: therapistID,
        start_date: moment(x).format("YYYY-MM-DD"),
        end_date: moment(x).format("YYYY-MM-DD"),
        timezone: window.localStorage.getItem("onboarding-timezone")
          ? JSON.parse(window.localStorage.getItem("onboarding-timezone"))[0]
          : moment.tz.guess(),
      })
    );
  };
  useEffect(() => {
    if (bookableSlots[moment(value).format("YYYY-MM-DD")]) {
      setBookableLoading(false);
    } else {
      setBookableLoading(true);
    }
  }, [bookableSlots[moment(value).format("YYYY-MM-DD")]]);

  const isInRange = (value, range) => {
    return value >= range[0] && value <= range[1];
  };

  // minimum.setDate(new Date().getDate() + 1);

  const getWhattoShow = () => {
    if (bookableLoading) {
      return (
        <Box
          direction="row"
          wrap
          style={{
            overflowY: isTabletOrMobile ? "scroll" : "hidden",
            display: "flex",
            // marginTop:"32px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TailSpin width={40} />
        </Box>
      );
    }
    if (value && bookableSlots[moment(value).format("YYYY-MM-DD")]) {
      return (
        <Box
          direction="row"
          wrap
          style={{
            overflowY: isTabletOrMobile ? "scroll" : "hidden",
          }}
        >
          {bookableSlots[moment(value).format("YYYY-MM-DD")].length === 0 ? (
            <Box
              margin={{ left: "small" }}
              width="100%"
              align="center"
              pad="small"
            >
              <Clear />
              <Text size="small">No slots for this date</Text>
            </Box>
          ) : (
            <>
              <Box
                width="100%"
                margin={{ top: "small" }}
                direction="row"
                align="center"
              >
                <Sun size="small" color="#757575" />
                <Text
                  style={{ color: "#757575", marginLeft: "3px" }}
                  size="small"
                >
                  Morning
                </Text>
              </Box>
              {bookableSlots[moment(value).format("YYYY-MM-DD")].map(
                (x, index) =>
                  isInRange(x, ["00:00", "11:59"]) ? (
                    <Box
                      pad="small"
                      style={{
                        border: " 0.5px solid rgba(0, 89, 150, 0.16)",
                        flexShrink: "0",
                      }}
                      background={
                        chosenTime === value.setHours(x[0] + x[1], x[3] + x[4])
                          ? "rgba(0, 150, 136, 1)"
                          : "#F0FAFF"
                      }
                      align="center"
                      justify="center"
                      round="8px"
                      className="noOutline"
                      key={index}
                      margin={isTabletOrMobile ? "small" : "xsmall"}
                      onClick={() => {
                        setChosenTime(value.setHours(x[0] + x[1], x[3] + x[4]));
                      }}
                    >
                      <Text size="small" weight="bold">
                        {x}
                      </Text>
                    </Box>
                  ) : null
              )}
              <Box
                width="100%"
                margin={{ top: "small" }}
                direction="row"
                align="center"
              >
                <Sun size="small" color="#757575" />
                <Text
                  style={{ color: "#757575", marginLeft: "3px" }}
                  size="small"
                >
                  Afternoon
                </Text>
              </Box>
              {bookableSlots[moment(value).format("YYYY-MM-DD")].map(
                (x, index) =>
                  isInRange(x, ["12:00", "17:59"]) ? (
                    <Box
                      pad="small"
                      style={{
                        border: " 0.5px solid rgba(0, 89, 150, 0.16)",
                        flexShrink: "0",
                      }}
                      background={
                        chosenTime === value.setHours(x[0] + x[1], x[3] + x[4])
                          ? "rgba(0, 150, 136, 1)"
                          : "#F0FAFF"
                      }
                      align="center"
                      justify="center"
                      round="8px"
                      className="noOutline"
                      key={index}
                      margin={isTabletOrMobile ? "small" : "xsmall"}
                      onClick={() => {
                        setChosenTime(value.setHours(x[0] + x[1], x[3] + x[4]));
                      }}
                    >
                      <Text size="small" weight="bold">
                        {x}
                      </Text>
                    </Box>
                  ) : null
              )}
              <Box
                width="100%"
                margin={{ top: "small" }}
                direction="row"
                align="center"
              >
                <Sun size="small" color="#757575" />
                <Text
                  style={{ color: "#757575", marginLeft: "3px" }}
                  size="small"
                >
                  Evening
                </Text>
              </Box>
              {bookableSlots[moment(value).format("YYYY-MM-DD")].map(
                (x, index) =>
                  isInRange(x, ["18:00", "23:59"]) ? (
                    <Box
                      pad="small"
                      style={{
                        border: " 0.5px solid rgba(0, 89, 150, 0.16)",
                        flexShrink: "0",
                      }}
                      background={
                        chosenTime === value.setHours(x[0] + x[1], x[3] + x[4])
                          ? "rgba(0, 150, 136, 1)"
                          : "#F0FAFF"
                      }
                      align="center"
                      justify="center"
                      round="8px"
                      className="noOutline"
                      key={index}
                      margin={isTabletOrMobile ? "small" : "xsmall"}
                      onClick={() => {
                        setChosenTime(value.setHours(x[0] + x[1], x[3] + x[4]));
                      }}
                    >
                      <Text size="small" weight="bold">
                        {x}
                      </Text>
                    </Box>
                  ) : null
              )}
            </>
          )}
        </Box>
      );
    }
    if (
      value &&
      bookableSlots[moment(value).format("YYYY-MM-DD")] &&
      bookableSlots[moment(value).format("YYYY-MM-DD")].length === 0
    ) {
      console.log("display");
      return (
        <Text size="small" width="100%" textAlign="center">
          No slots for this date
        </Text>
      );
    }
  };
  const [show, setShow] = useState(
    localStorage.getItem("hasUpdatedFitcyTimeZone") ? false : true
  );

  const [valueT, setValueT] = React.useState([
    moment.tz.guess(),
    `(GMT${moment().format("Z")}) ${moment.tz.guess()}`,
  ]);

  const timezoneOptions = useSelector((state) => state.patient.timezoneOptions);

  const [timezoneCopy, settimezonecopy] = useState(
    _.cloneDeep(timezoneOptions)
  );

  const searchArray = (term) => {
    if (term === "") settimezonecopy(_.cloneDeep(timezoneOptions));
    else
      settimezonecopy(
        timezoneOptions.filter((x) =>
          x[0].toLowerCase().match(term.toLowerCase())
        )
      );
  };

  useEffect(() => {
    settimezonecopy(_.cloneDeep(timezoneOptions));
  }, [timezoneOptions]);

  useEffect(() => {
    if (!timezoneOptions) dispatch(getTimeZoneOptions());
  }, []);

  if (!bookableSlots) return <CradleLoader />;

  return (
    <Box gap="small">
      {show && (
        <Layer
          plain
          style={{ minWidth: "40%", maxHeight: "60%" }}
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
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
            justify="between"
          >
            <Box width="100%" justify="between" direction="row" align="center">
              <Text size="small">
                Your local timezone is{" "}
                <b>
                  {" "}
                  {window.localStorage.getItem("onboarding-timezone")
                    ? JSON.parse(
                        window.localStorage.getItem("onboarding-timezone")
                      )[0]
                    : moment.tz.guess()}
                </b>
                &nbsp;
              </Text>
              <FormClose
                style={{ cursor: "pointer" }}
                className="noOutline"
                onClick={() => setShow(false)}
              />
            </Box>
            {timezoneCopy ? (
              <Select
                // valueKey={(option) => option[0]}
                searchPlaceholder="Search..."
                options={timezoneCopy}
                onSearch={(x) => searchArray(x)}
                value={valueT}
                emptySearchMessage="No match found"
                labelKey={(option) => option[1]}
                placeholder="Select new timezone"
                onChange={({ option }) => {
                  setValueT(option);
                }}
                size="small"
                valueLabel={
                  <Box pad="small">
                    <Text size="small">
                      {valueT ? valueT[1] : "Select a new timezone"}
                    </Text>
                  </Box>
                }
              />
            ) : null}
            <Box
              background="#009688"
              style={{ width: "max-content" }}
              className="noOutline"
              onClick={() => {
                window.localStorage.setItem(
                  "onboarding-timezone",
                  JSON.stringify(valueT)
                );
                window.localStorage.setItem("hasUpdatedFitcyTimeZone", true);
                setShow(false);
                dispatch(
                  listAvailableSlotsUnAuth({
                    therapist_id: therapistID,
                    start_date: moment(new Date()).format("YYYY-MM-DD"),
                    end_date: moment(new Date()).format("YYYY-MM-DD"),
                    timezone:
                      JSON.parse(
                        window.localStorage.getItem("onboarding-timezone")
                      )[0] || moment.tz.guess(),
                  })
                );
                onChange(moment().parseZone()._d);
              }}
              pad="small"
              round="8px"
            >
              <Text size="small" weight="bold">
                Update
              </Text>
            </Box>
          </Box>
        </Layer>
      )}

      <Box direction="row" gap="xlarge" justify="between" align="center">
        <Box gap="small">
          <Text>Schedule Your Session</Text>
          <Text size="small">
            Your local timezone is{" "}
            <b>
              {" "}
              {window.localStorage.getItem("onboarding-timezone")
                ? JSON.parse(
                    window.localStorage.getItem("onboarding-timezone")
                  )[0]
                : moment.tz.guess()}
            </b>
            &nbsp;
            <span
              onClick={() => setShow(true)}
              style={{
                color: "rgba(0, 150, 136, 1)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Update
            </span>
          </Text>
        </Box>
        <Box direction="row" gap="small">
          <Button {...prevButtonProps} onClick={() => setCurrentDay(null)}>
            <FormPrevious size="medium" color="black" />
          </Button>

          <Button {...nextButtonProps} onClick={() => setCurrentDay(null)}>
            <FormNext size="medium" color="black" />
          </Button>
        </Box>
      </Box>

      <Box
        background="white"
        margin={{ top: "15px" }}
        width="100%"
        gap="medium"
        align="center"
        justify={isTabletOrMobile ? "center" : "center"}
      >
        <Box gap="small" width="100%">
          <StyledWeekView {...calendarProps} ref={ref}>
            <table {...gridProps}>
              <tbody>
                <div style={{ display: "flex", width: "100%" }}>
                  {state.getDatesInWeek(0).map((date, i) =>
                    date ? (
                      <div
                        className={
                          currentDay === i
                            ? "calender_div_selected"
                            : "calender_div"
                        }
                        // onClick={() => setCurrentDay(i)}
                      >
                        {/* <p>{new Date(date.year,date.month-1,date.day).toDateString()} </p> */}
                        <p>{day[i]} </p>
                        {/* <p>{JSON.stringify(date)} </p> */}

                        <CalendarCell
                          key={i}
                          date={date}
                          state={state}
                          defaultValue={date}
                          minValue={date}
                          onClick={() => getAvailableSlots(date.toDate(), i)}
                        />
                      </div>
                    ) : (
                      <td key={i} />
                    )
                  )}
                </div>
              </tbody>
            </table>
          </StyledWeekView>

          {/* {isTabletOrMobile && (
            <Box
              style={{
                background: isTabletOrMobile ? "white" : null,
                position: isTabletOrMobile ? "fixed" : null,
                bottom: isTabletOrMobile ? "0px" : null,
                width: isTabletOrMobile ? "100vw" : "100%",
                minWidth: !isTabletOrMobile ? "597px" : null,
                left: isTabletOrMobile ? 0 : null,
                boxShadow: "0px -2px 12px rgba(132, 132, 132, 0.25)",
                height: "100px",
                display: "flex",
                margin: !isTabletOrMobile ? "0px  -24px -24px -24px" : null,
                justifyContent: "center",
                alignItems: "center",
              }}
              width="100%"
              pad={isTabletOrMobile ? "medium" : null}
            >
              <Box width="100%" align="center" margin={{ top: "medium" }}>
                <Box
                  width="100%"
                  align="center"
                  background="#009688"
                  pad={isTabletOrMobile ? "medium" : "xsmall"}
                  round="8px"
                  // onClick={() => setInternalStep(2)}
                  className="noOutline"
                >
                  <Text size="small" color="white">
                    Confirm
                  </Text>

                </Box>
              </Box>
            </Box>
          )} */}
        </Box>

        <Box gap="small" width={isTabletOrMobile ? "100%" : "100%"}>
          {/* {isTabletOrMobile && (
              <div
                className="noOutline"
                // onClick={() => setInternalStep(1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: "5px",
                  cursor: "pointer",
                  marginBottom: "5px",
                }}
              >
                {" "}
                <Box
                  className="primary-btn"
                  gap="small"
                  direction="row"
                  pad="small"
                  align="center"
                  round="8px"
                >
                  <FormPreviousLink color="white" size="small" />
                  <Text size="small">Change Date</Text>
                </Box>
              </div>
            )} */}
          {/* <Box style={{ flexShrink: "0" }}>
              <Box justify="between" direction="row">
                <Text weight="bold">Select Available Time</Text>
              </Box>
            </Box>
            <Text color="#009688">{moment(value).format("ddd, DD MMMM")}</Text>
            <Box className="divider" /> */}

          {value
            ? // <Box>
              getWhattoShow()
            : // </Box>
              "loadinggggg"}
          {chosenTime ? (
            <Box
              style={{
                background: isTabletOrMobile ? "white" : null,
                position: isTabletOrMobile ? "sticky" : null,
                overflowY: isTabletOrMobile ? "scroll" : "hidden",
                bottom: isTabletOrMobile ? "0px" : null,
                width: isTabletOrMobile ? "100vw" : "100%",
                minWidth: !isTabletOrMobile ? "597px" : null,
                left: isTabletOrMobile ? 0 : null,
                boxShadow: "0px -2px 12px rgba(132, 132, 132, 0.25)",
                height: "100px",
                display: "flex",
                margin: !isTabletOrMobile ? "0px  -24px -24px -24px" : null,
                justifyContent: "center",
                alignItems: "center",
              }}
              pad={isTabletOrMobile ? "medium" : null}
            >
              <Box
                width="90%"
                align="center"
                margin={{
                  background: "#FFFFFF",
                  boxShadow: "0px -2px 12px rgba(132, 132, 132, 0.25)",
                }}
              >
                {" "}
                <span className="info_onboarding">
                  <img src={info} />
                  <p>
                    One session usually lasts <span>one hour</span>
                  </p>
                </span>
                <Box
                  style={{
                    flexShrink: "0",
                    boxShadow: "0px -2px 12px rgba(132, 132, 132, 0.2)",
                  }}
                  margin={{ top: "small" }}
                  onClick={!bookingInProgress ? bookAppointment : () => {}}
                  pad={isTabletOrMobile ? "medium" : "small"}
                  className="noOutline"
                  round="8px"
                  background="rgba(0, 150, 136, 1)"
                  width="100%"
                  alignSelf="center"
                  align="center"
                >
                  <Text size="small" color="white">
                    {bookingInProgress ? (
                      <Box width="100%" alignSelf="center" align="center">
                        <TailSpin height={20} color="white" />
                      </Box>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Text>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default BookSessionNewOnboarding;

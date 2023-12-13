import { Box, Layer, Select, Text } from "grommet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getMe } from "../../redux/app/appThunks";
// import { getMe } from "../../redux/app/appThunks";
import {
  getTimeZoneOptions,
  updatePatientProfile,
} from "../../redux/patient/patientThunks";
import { updateTherapistProfile } from "../../redux/therapist/therapistThunks";
import * as _ from "lodash";
import { FormClose } from "grommet-icons";
import moment from "moment-timezone";

const ChangeTimeZone = () => {
  const user = useSelector((state) => state.app.user);
  const [show, setShow] = React.useState(
    localStorage.getItem("hasUpdatedFitcyTimeZone") ? false : true
  );
  const [value, setValue] = React.useState([
    moment.tz.guess(),
    `(GMT${moment().format("Z")}) ${moment.tz.guess()}`,
  ]);

  const [valueConfirmed, setConfirmed] = React.useState();
  const check = useLocation();

  const timezoneOptions = useSelector((state) => state.patient.timezoneOptions);

  const [timezoneCopy, settimezonecopy] = useState(
    _.cloneDeep(timezoneOptions)
  );

  useEffect(() => {
    settimezonecopy(_.cloneDeep(timezoneOptions));
  }, [timezoneOptions]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!timezoneOptions) dispatch(getTimeZoneOptions());
  }, []);

  const saveNewTimezone = () => {
    if (user.role === "THERAPIST")
      dispatch(updateTherapistProfile({ id: user.id, timezone: value[0] }));
    else dispatch(updatePatientProfile({ id: user.id, timezone: value[0] }));

    setConfirmed(value[0]);
    localStorage.setItem("hasUpdatedFitcyTimeZone", true);
    setShow(false);
    if (check.pathname !== "/dashboard/therapist-onboarding") dispatch(getMe());
  };

  const searchArray = (term) => {
    if (term === "") settimezonecopy(_.cloneDeep(timezoneOptions));
    else
      settimezonecopy(
        timezoneOptions.filter((x) =>
          x[0].toLowerCase().match(term.toLowerCase())
        )
      );
  };
  return (
    <>
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
            {!localStorage.getItem("hasUpdatedFitcyTimeZone") ? (
              <Text weight="bold" size="small">
                Please verify your time zone
              </Text>
            ) : null}
            <Box width="100%" justify="between" direction="row" align="center">
              <Text size="small">
                Your local timezone is <b> {user.timezone}</b>&nbsp;
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
                value={value}
                emptySearchMessage="No match found"
                labelKey={(option) => option[1]}
                placeholder="Select new timezone"
                onChange={({ option }) => setValue(option)}
                size="small"
                valueLabel={
                  <Box pad="small">
                    <Text size="small">
                      {value ? value[1] : "Select a new timezone"}
                    </Text>
                  </Box>
                }
              />
            ) : null}

            {/* <Text size="small">
                        New timezone:
                        <Text size="small" color="#009688" weight="bold">   {value ? value[1] : null}
                        </Text>
                    </Text> */}
            <Box
              background="#009688"
              style={{ width: "max-content" }}
              className="noOutline"
              onClick={saveNewTimezone}
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
      <Text size="small">
        Your local timezone is{" "}
        <b> {valueConfirmed ? valueConfirmed : user.timezone}</b>&nbsp;
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
    </>
  );
};

export default ChangeTimeZone;

import { Box, Select, Text, TextInput, Layer } from "grommet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import * as _ from "lodash";
import { Clipboard, FormAdd, Search } from "grommet-icons";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import {
  addTransactionHistory,
  getPackagesList,
  getPatientList,
  getSinglePatient,
  getTherapistListAdmin,
  sendOnboardingEmail,
  sendSetPasswordLink,
  signupUserAdmin,
} from "../../redux/app/appThunks";
import BookSessionAdmin from "../../components/common/BookSessionAdmin";
import {
  clearCurrentPatient,
  clearPasswordLink,
} from "../../redux/app/appSlice";
import { TailSpin } from "react-loader-spinner";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export default function ChangeTherapist() {
  const allTherapists = useSelector((state) => state.app.therapist_list);
  const allPatients = useSelector((state) => state.app.patient_list);
  const currentPatientDetails = useSelector(
    (state) => state.app.current_patient
  );
  const [searchVal, setSearchVal] = useState();
  const [currThera, setCurrThera] = useState();
  const [showSchedule, setShowSchedule] = useState();
  const [selectedPatient, setSelectedPatient] = useState();
  const [showAddPatientPopup, setShowAddPatientPopup] = useState();
  const packagesList = useSelector((state) => state.app.packages_list);
  useEffect(() => {
    if (!packagesList) dispatch(getPackagesList());
  }, []);
  const [searchPatient, setSearchPatient] = useState("");

  const passwordLink = useSelector((state) => state.app.current_password_link);

  const dispatch = useDispatch();
  // const user = useSelector((state) => state.app.user);
  useEffect(() => {
    dispatch(
      getTherapistListAdmin({
        tier:
          currentPatientDetails &&
          packagesList &&
          packagesList.find((x) => x.id === currentPatientDetails.package)
            ? packagesList.find((x) => x.id === currentPatientDetails.package)
                .tier
            : "",
      })
    );
  }, [currentPatientDetails]);
  useEffect(() => {
    dispatch(getPatientList({ search: searchPatient }));
  }, [searchPatient]);
  useEffect(() => {
    if (selectedPatient)
      dispatch(getSinglePatient({ patientID: selectedPatient }));
  }, [selectedPatient]);

  let filteredTherapists = _.cloneDeep(allTherapists);

  if (searchVal)
    filteredTherapists = filteredTherapists.filter(
      (x) =>
        x.first_name.toLowerCase().includes(searchVal.toLowerCase()) ||
        x.last_name.toLowerCase().includes(searchVal.toLowerCase())
    );

  const processShowSchedule = (therapist_id) => {
    setCurrThera(therapist_id);
    setShowSchedule(true);
  };

  if (!allTherapists || !allPatients || !packagesList) return <Loader />;

  return (
    <>
      {showSchedule ? (
        <BookSessionAdmin
          patientID={selectedPatient}
          therapistID={currThera}
          setShowLayer={(value) => setShowSchedule(value)}
        />
      ) : null}

      {showAddPatientPopup && (
        <AddPatient
          setSelectedPatient={setSelectedPatient}
          patientID={selectedPatient}
          setShow={setShowAddPatientPopup}
        />
      )}

      <Box
        className="w-100 h-100"
        gap="small"
        pad="medium"
        margin={{ bottom: "small" }}
        style={{ overflowY: "auto" }}
      >
        <Box direction="column" gap="small" style={{ flexShrink: "0" }}>
          <Text className="ptFont" size="xxlarge" weight="bold">
            Admin
          </Text>
          <Box
            direction="row"
            align="center"
            style={{ flexShrink: "0" }}
            justify="between"
          >
            <ChangeTimeZone />
            <Box
              pad="small"
              onClick={() => setShowAddPatientPopup(true)}
              style={{ cursor: "pointer" }}
              className="noOutline"
              background={"#009688"}
              round="4px"
              align="center"
              justify="center"
            >
              <Box direction="row" gap="xsmall" align="center" justify="center">
                {" "}
                <FormAdd size="small" /> <Text size="small">Add Patient</Text>
              </Box>
            </Box>
          </Box>
          <Box style={{ flexShrink: "0", overflowY: "auto" }}>
            <PatientAdminSelector
              selectedPatient={selectedPatient}
              searchPatient={searchPatient}
              setSelectedPatient={setSelectedPatient}
              setSearchPatient={setSearchPatient}
            />
            {currentPatientDetails && (
              <Box
                direction="row"
                gap="small"
                round="4px"
                style={{ border: "1px solid #009688" }}
                pad="xsmall"
                align="center"
              >
                <Text size="small">
                  Patient: {currentPatientDetails.first_name}{" "}
                  {currentPatientDetails.last_name}
                </Text>
                <Text size="small">Email: {currentPatientDetails.email} </Text>
                <Text size="small">
                  Package:{" "}
                  {packagesList.find(
                    (x) => x.id === currentPatientDetails.package
                  ) &&
                    packagesList.find(
                      (x) => x.id === currentPatientDetails.package
                    ).tier}{" "}
                </Text>
                <Text size="small">
                  Timezone: {currentPatientDetails.timezone}{" "}
                </Text>
                <Text size="small">
                  Therapist Slug: {currentPatientDetails.therapist_slug}{" "}
                </Text>
                <Text size="small">
                  Credits: {currentPatientDetails.credits}{" "}
                </Text>

                <Text size="small">
                  Last Active: {currentPatientDetails.last_active}{" "}
                </Text>
              </Box>
            )}
          </Box>
          {/* {JSON.stringify(currentPatientDetails)} */}
          {passwordLink && <Text size="small">{passwordLink.url} </Text>}
        </Box>

        <Box pad="xsmall" style={{ flexShrink: "0" }}>
          <TextInput
            className="noOutline"
            icon={<Search size="small" />}
            value={searchVal}
            size="small"
            placeholder="Search Therapist"
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </Box>

        <Box gap="small">
          {filteredTherapists.map((x) => (
            <Box
              round="4px"
              align="center"
              direction="row"
              justify="between"
              key={x.id}
              pad="xsmall"
              style={{
                border: "1px solid #80808080",
                flexShrink: "0",
              }}
            >
              <Text size="small">
                {x.first_name} {x.last_name} - {x.tier ? x.tier : "No Tier"}
              </Text>
              <Text size="small"></Text>
              <Box direction="row" align="center" justify="between" width="70%">
                <Box direction="row" gap="xsmall">
                  <Text size="small">Time before booking:</Text>
                  {Math.floor(x.minutes_before_booking / 60) > 0 && (
                    <Text size="small">
                      {Math.floor(x.minutes_before_booking / 60) + " hours "}
                    </Text>
                  )}
                  {x.minutes_before_booking % 60 > 0 && (
                    <Text size="small">
                      {(x.minutes_before_booking % 60) + " minutes"}
                    </Text>
                  )}
                  {x.minutes_before_booking === 0 && (
                    <Text size="small">None</Text>
                  )}
                </Box>
                <Box direction="row" gap="small" align="center">
                  <Box
                    round="8px"
                    pad="xsmall"
                    background="#009688"
                    className="noOutline"
                    onClick={() => processShowSchedule(x.id)}
                  >
                    <Text size="small"> Set Appointment</Text>
                  </Box>

                  {x.therapist_link && (
                    <CopyToClipboard
                      text={x.therapist_link}
                      onCopy={() => toast.success("Copied to clipboard")}
                    >
                      <Box
                        direction="row"
                        size="small"
                        round="8px"
                        pad="xsmall"
                        background="#009688"
                        className="noOutline"
                        align="center"
                        style={{ cursor: "pointer" }}
                        gap="xsmall"
                      >
                        <Text size="small">Therapist Link</Text>
                        <Clipboard />
                      </Box>
                    </CopyToClipboard>
                  )}
                  {x.booking_link && (
                    <CopyToClipboard
                      text={x.booking_link}
                      onCopy={() => toast.success("Copied to clipboard")}
                    >
                      <Box
                        direction="row"
                        size="small"
                        round="8px"
                        pad="xsmall"
                        background="#009688"
                        className="noOutline"
                        align="center"
                        style={{ cursor: "pointer" }}
                        gap="xsmall"
                      >
                        <Text size="small">Copy Booking Link</Text>
                        <Clipboard />
                      </Box>
                    </CopyToClipboard>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

const PatientAdminSelector = ({
  selectedPatient,
  setSearchPatient,
  setSelectedPatient,
}) => {
  const allPatients = useSelector((state) => state.app.patient_list);
  const passwordLink = useSelector((state) => state.app.current_password_link);
  let token = passwordLink && passwordLink.url.slice(55);
  console.log(token);

  const [showTransactionHistoryPopup, setShowTransactionHistoryPopup] =
    useState();

  const dispatch = useDispatch();

  return (
    <>
      {showTransactionHistoryPopup && selectedPatient && (
        <TransactionHistoryPopup
          patientID={selectedPatient}
          setShow={setShowTransactionHistoryPopup}
        />
      )}

      <Box direction="row" align="center" justify="between">
        <Box
          pad="xsmall"
          margin={{ vertical: "small" }}
          direction="row"
          gap="small"
          align="center"
        >
          <Select
            // valueKey={(option) => option[0]}
            searchPlaceholder="Search Patient"
            emptySearchMessage="No match found"
            onSearch={(x) => {
              setSelectedPatient(undefined);
              setSearchPatient(x);
            }}
            options={allPatients}
            clear
            value={selectedPatient}
            valueKey={{ key: "id" }}
            labelKey={(x) => (
              <Box gap="xsmall">
                <Text size="small">{x.first_name + " " + x.last_name}</Text>
                <Text size="xsmall">{x.email}</Text>
              </Box>
            )}
            valueLabel={() => (
              <Box pad="small">
                <Text size="small">
                  {" "}
                  {selectedPatient
                    ? allPatients.find((x) => x.id === selectedPatient).email
                    : "Select Patient"}
                </Text>
              </Box>
            )}
            placeholder="Select Patient"
            onChange={({ option }) => {
              setSelectedPatient(option !== undefined ? option.id : undefined);
              dispatch(clearPasswordLink());
              if (option === undefined) {
                dispatch(clearCurrentPatient());
              }
            }}
            size="small"
          />
          {selectedPatient && (
            <Box
              pad="small"
              onClick={() =>
                selectedPatient
                  ? dispatch(
                      sendSetPasswordLink({
                        email: allPatients.find((x) => x.id === selectedPatient)
                          .email,
                      })
                    )
                  : null
              }
              style={{ cursor: "pointer" }}
              className="noOutline"
              background={selectedPatient ? "#009688" : "grey"}
              round="4px"
            >
              <Text size="small">Get Password Link</Text>
            </Box>
          )}

          {passwordLink && (
            <Box
              pad="small"
              onClick={() =>
                selectedPatient
                  ? dispatch(
                      sendOnboardingEmail({
                        user_id: selectedPatient,
                        token: token,
                      })
                    )
                  : null
              }
              style={{ cursor: "pointer" }}
              className="noOutline"
              background={selectedPatient ? "#009688" : "grey"}
              round="4px"
            >
              <Text size="small">Send Onboarding Email</Text>
            </Box>
          )}
        </Box>
        {selectedPatient && (
          <Box
            pad="small"
            onClick={() => setShowTransactionHistoryPopup(true)}
            style={{ cursor: "pointer" }}
            className="noOutline"
            background={selectedPatient ? "#009688" : "grey"}
            round="4px"
          >
            <Text size="small">Add Session/Credit</Text>
          </Box>
        )}
      </Box>
    </>
  );
};

const TransactionHistoryPopup = ({ setShow, patientID }) => {
  const packagesList = useSelector((state) => state.app.packages_list);
  const [selectedPackage, setSelectedPackage] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!packagesList) dispatch(getPackagesList());
  }, []);

  const handleAddTransactionHistory = (e) => {
    e.preventDefault();
    dispatch(
      addTransactionHistory({
        credits_awarded: e.target.credits_awarded.value,
        amount: e.target.amount.value,
        patient: patientID,
        package: selectedPackage,
      })
    );
    dispatch(getSinglePatient({ patientID: patientID }));
    setShow(false);
  };

  return (
    <Layer
      plain
      style={{
        minWidth: "60%",
        maxWidth: "80%",
        maxHeight: "95%",
      }}
      // position="top height: "50%" "
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
    >
      <Box
        background={"white"}
        margin="xsmall"
        style={{
          boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        gap={"small"}
        justify="between"
        pad="medium"
      >
        {packagesList ? (
          <Box gap="small">
            <Text className="ptFont" weight="bold">
              Add Session/Credit
            </Text>
            <form
              method="POST"
              onSubmit={handleAddTransactionHistory}
              className="w-100 box-column center-align"
            >
              <div className="labelInputSet">
                <label className="defaultLabel">Credits Awarded</label>
                <input
                  name="credits_awarded"
                  className="defaultInput"
                  type="number"
                />
              </div>
              <div className="labelInputSet">
                <label className="defaultLabel">Amount</label>
                <input type="number" name="amount" className="defaultInput" />
              </div>

              <Box width="100%">
                <Select
                  value={selectedPackage}
                  options={packagesList}
                  valueKey="id"
                  dropHeight="small"
                  size="small"
                  placeholder={<Text size="small">Select Package</Text>}
                  style={{ width: "100%" }}
                  valueLabel={
                    selectedPackage && (
                      <Box
                        gap="xsmall"
                        direction="row"
                        align="center"
                        pad="small"
                      >
                        <Text size="xsmall">
                          {
                            packagesList.find((x) => x.id === selectedPackage)
                              .name
                          }
                        </Text>{" "}
                        <Text size="xsmall">
                          {
                            packagesList.find((x) => x.id === selectedPackage)
                              .type
                          }
                        </Text>
                      </Box>
                    )
                  }
                  labelKey={(option) => (
                    <Box gap="xsmall">
                      <Text size="xsmall">{option.name}</Text>{" "}
                      <Text size="xsmall">{option.type}</Text>
                    </Box>
                  )}
                  onChange={({ option }) => setSelectedPackage(option.id)}
                />
              </Box>
              <button type="submit" className="primary-btn w-100">
                Add Session/Credit
              </button>
            </form>
          </Box>
        ) : (
          <Box align="center" width="100%">
            <TailSpin />
          </Box>
        )}
      </Box>
    </Layer>
  );
};

const AddPatient = ({ setShow, setSelectedPatient }) => {
  const dispatch = useDispatch();

  const handleSignUp = (e) => {
    e.preventDefault();

    dispatch(
      signupUserAdmin({
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        cell_number: e.target.cell_number.value,
      })
    );
    setShow(false);
    setSelectedPatient(undefined);
  };

  return (
    <Layer
      plain
      style={{
        minWidth: "60%",
        maxWidth: "80%",
        maxHeight: "95%",
      }}
      // position="top"
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
    >
      <Box
        background={"white"}
        margin="xsmall"
        style={{
          boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        gap={"small"}
        justify="between"
        pad="medium"
      >
        <Box gap="small">
          <Text className="ptFont" weight="bold">
            Add Patient
          </Text>
          <form
            method="POST"
            onSubmit={handleSignUp}
            className="w-100 box-column center-align"
          >
            <div className="labelInputSet">
              <label className="defaultLabel">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="Your first name"
                className="defaultInput"
              />
            </div>

            <div className="labelInputSet">
              <label className="defaultLabel">Last Name</label>

              <input
                type="text"
                name="last_name"
                placeholder="Your last name"
                className="defaultInput"
              />
            </div>
            <div className="labelInputSet">
              <label className="defaultLabel">Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="defaultInput"
              />
            </div>
            <div className="labelInputSet">
              <label className="defaultLabel">Phone Number</label>

              <input
                type="number"
                name="cell_number"
                placeholder="Your phone number"
                className="defaultInput"
              />
            </div>

            <button type="submit" className="primary-btn w-100">
              Create Account{" "}
            </button>
          </form>
        </Box>
      </Box>
    </Layer>
  );
};

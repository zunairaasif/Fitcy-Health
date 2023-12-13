import { Avatar, Box, Text, Spinner } from "grommet";
import {
  Add,
  AddCircle,
  DocumentLocked,
  Lock,
  Package,
  Upgrade,
  User,
} from "grommet-icons";
import React, { useState } from "react";
import { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import ChangeTimeZone from "../../components/common/ChangeTimeZone";
import PackageSetupModal from "../../components/common/PackageSetupModal";
import RechargeModal from "../../components/common/RechargeModal";
import {
  getBillingRedirect,
  getCardDetails,
  getTherapistTierPackage,
  updatePatientPassword,
  updatePatientPicture,
  updatePatientProfile,
  cancelSubscription,
  autoChangeSub,
  subAutoCharge,
} from "../../redux/patient/patientThunks";
import noAvatar from "../../assets/noAvatar.jpeg";
import UpgradeModal from "../../components/common/UpgradeModal";
import AddPaymentModal from "../../components/common/AddPaymentModal";
import Switch from "@mui/material/Switch";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updatePatientPassword({
        old_password: oldPassword,
        new_password: newPassword,
      })
    );
  };

  return (
    <>
      <Box gap="small">
        <Text color="rgba(39, 75, 40, 1)">Change Password</Text>
        <form
          method="POST"
          onSubmit={handleSave}
          className="w-100 box-column center-align"
        >
          <div className="labelInputSet">
            <label className="defaultLabel">Old Password</label>

            <input
              type="password"
              name="old_password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              className="defaultInput"
              onChangeCapture={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="labelInputSet">
            <label className="defaultLabel">New Password</label>

            <input
              type="password"
              name="new_password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              className="defaultInput"
              onChangeCapture={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn w-100">
            Update Password
          </button>
        </form>
      </Box>
    </>
  );
};

const GeneralInfo = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [num, setNum] = useState(user.cell_number);
  const [email, setEmail] = useState(user.email);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const handleFile = (event) => {
    const FD = new FormData();
    FD.append("dp", event.target.files[0]);

    dispatch(updatePatientPicture({ id: user.id, formdata: FD }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updatePatientProfile({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        cell_number: num,
      })
    );
  };

  return (
    <>
      <Box gap="small">
        <Text color="rgba(39, 75, 40, 1)">General Info</Text>

        <Box
          direction="row"
          gap={isTabletOrMobile ? "large" : "medium"}
          align="center"
        >
          <Avatar size="large" src={user.dp ? user.dp : noAvatar} />
          <form encType="multipart/form-data">
            <label className="labelText">
              <input
                type="file"
                name="file"
                style={{ marginTop: "2%" }}
                onChange={(event) => handleFile(event)}
              />
              <Box
                direction="row"
                justify="center"
                gap="small"
                pad={!isTabletOrMobile ? "small" : "medium"}
                background="#009688"
                className="noOutline"
                style={{
                  fontSize: "small",
                  color: "white",
                  borderRadius: "8px",
                }}
                align="center"
              >
                <Add size="small" /> Change Picture
              </Box>
            </label>
          </form>
        </Box>
        <form
          method="POST"
          onSubmit={handleSave}
          className="w-100 box-column center-align"
        >
          <div className="labelInputSet">
            <label className="defaultLabel">First Name</label>
            <input
              type="text"
              name="first_name"
              value={firstName}
              onChangeCapture={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Last Name</label>

            <input
              type="text"
              name="last_name"
              value={lastName}
              onChangeCapture={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Phone Number</label>
            <input
              type="text"
              name="cell_number"
              value={num}
              onChangeCapture={(e) => setNum(e.target.value)}
              placeholder="Your phone number"
              className="defaultInput"
            />
          </div>

          <div className="labelInputSet">
            <label className="defaultLabel">Email Address</label>

            <input
              type="email"
              name="email"
              value={email}
              onChangeCapture={(e) => setEmail(e.target.value)}
              disabled
              placeholder="Your email address"
              className="defaultInput"
            />
          </div>
          <button type="submit" className="primary-btn w-100">
            Save Changes
          </button>
        </form>
      </Box>
    </>
  );
};

const MyPackage = ({ user, checked, setChecked }) => {
  const dispatch = useDispatch();
  const paymentDetails = useSelector((state) => state.patient.patient_payment);
  const therapistTierPackage = useSelector(
    (state) => state.patient.therapist_tier
  );
  const [setupModal, setSetupModal] = useState(false);
  const [rechargeModal, setRechargeModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    if (checked === false) {
      setChecked(event.target.checked);
      dispatch(
        autoChangeSub({
          auto_charge: true,
        })
      );
      console.log("auto_charge", event.target.checked);
      dispatch(
        subAutoCharge({
          auto_charge: true,
        })
      );
    } else {
      setChecked(event.target.checked);
      dispatch(
        autoChangeSub({
          auto_charge: false,
        })
      );
      console.log("auto_charge", event.target.checked);
      dispatch(
        subAutoCharge({
          auto_charge: false,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getCardDetails({ user_id: user.id }));
    dispatch(getTherapistTierPackage({ user_id: user.id }));
  }, []);

  const removeSubscription = async () => {
    setLoading(true);
    await dispatch(cancelSubscription());
    window.location.reload();
  };

  if (!paymentDetails || !therapistTierPackage)
    return <ThreeDots color="black" height={80} width={80} />;

  return (
    <>
      {setupModal && (
        <PackageSetupModal
          user={user}
          options={therapistTierPackage}
          setDisplayOut={(value) => setSetupModal(value)}
        />
      )}
      {rechargeModal && (
        <RechargeModal
          user={user}
          setDisplayOut={(value) => setRechargeModal(value)}
        />
      )}
      {upgradeModal && (
        <UpgradeModal
          user={user}
          setDisplayOut={(value) => setUpgradeModal(value)}
          auto_charge={checked}
        />
      )}

      {addPaymentModal && (
        <AddPaymentModal
          user={user}
          setDisplayOut={(value) => setAddPaymentModal(value)}
        />
      )}

      <Box gap="small">
        <Text color="rgba(39, 75, 40, 1)">Package Details</Text>
        <Box gap="small" align="start">
          <Box
            style={{
              boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.12)",
            }}
            round="10px"
            width="100%"
          >
            <Box
              background="rgba(225, 245, 254, 1)"
              pad="small"
              style={{
                borderRadius: "10px 10px 0px 0px",
              }}
            >
              {user.package ? (
                <Text size="small">
                  Current Package: {user.package.type} - {user.package.tier}
                </Text>
              ) : (
                <Box
                  direction="row"
                  onClick={() => setSetupModal(true)}
                  style={{ cursor: "pointer", width: "max-content" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="#009688"
                  pad="xsmall"
                >
                  {" "}
                  <AddCircle color="white" size="small" />{" "}
                  <Text size="small">Setup package</Text>
                </Box>
              )}
            </Box>
            <Box>
              <Box
                pad="small"
                direction="row"
                width="100%"
                justify="between"
                align="center"
              >
                <Box gap="small" direction="row" align="center">
                  <Avatar
                    size="medium"
                    src={
                      user.current_therapist.dp
                        ? user.current_therapist.dp
                        : noAvatar
                    }
                  />
                  <Box>
                    <Text weight="bold" size="small">
                      {user.current_therapist.first_name}{" "}
                      {user.current_therapist.last_name}
                    </Text>
                    <Text size="small">
                      {user.current_therapist.designation}
                    </Text>
                  </Box>
                </Box>
                <Text size="small">Available Credits: {user.credits}</Text>
              </Box>
            </Box>
          </Box>
          <Box direction="row" align="center" gap="small">
            {user.package &&
              paymentDetails !== "none" &&
              user.package.type === "ONETIME" && (
                <Box
                  onClick={() => setRechargeModal(true)}
                  direction="row"
                  style={{ cursor: "pointer" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="#009688"
                  pad="xsmall"
                >
                  {" "}
                  <AddCircle color="white" size="small" />{" "}
                  <Text size="small">Recharge</Text>
                </Box>
              )}
            {user.package &&
              paymentDetails !== "none" &&
              user.package.type === "ONETIME" && (
                <Box
                  onClick={() => setUpgradeModal(true)}
                  direction="row"
                  style={{ cursor: "pointer" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="#009688"
                  pad="xsmall"
                >
                  {" "}
                  <Upgrade color="white" size="small" />{" "}
                  <Text size="small">Upgrade</Text>
                </Box>
              )}
            {user.package &&
              paymentDetails !== "none" &&
              user.package.type === "MONTHLY" && (
                <Box
                  onClick={() => removeSubscription()}
                  direction="row"
                  style={{ cursor: "pointer" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="red"
                  pad="xsmall"
                >
                  {" "}
                  <Text size="small" color="white">
                    {loading ? (
                      <Spinner color="white" />
                    ) : (
                      <>
                        <Upgrade color="white" size="small" /> Cancel
                        Subscription
                      </>
                    )}
                  </Text>
                </Box>
              )}
          </Box>
        </Box>

        <Box
          direction="row"
          margin={{ top: "small", bottom: "small" }}
          align="center"
        >
          <Text color="rgba(39, 75, 40, 1)">Auto-charge Subscription</Text>
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Box>

        <Text color="rgba(39, 75, 40, 1)">Payment Method</Text>
        <Box
          style={{
            boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.12)",
          }}
          pad="small"
          round="10px"
          width="100%"
        >
          <>
            {paymentDetails !== "none" ? (
              <Box direction="row" align="center" gap="small">
                <Text size="small">
                  Card Details: {paymentDetails.card_details.card.brand} *****
                  {paymentDetails.card_details.card.last4} - Exp:{" "}
                  {paymentDetails.card_details.card.exp_month}/
                  {paymentDetails.card_details.card.exp_year}
                </Text>
                <Box
                  direction="row"
                  style={{ cursor: "pointer" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="#009688"
                  pad="xsmall"
                  onClick={() => setAddPaymentModal(true)}
                >
                  {" "}
                  <AddCircle color="white" size="small" />{" "}
                  <Text size="small">Change payment method</Text>
                </Box>
              </Box>
            ) : (
              <Box direction="row" gap="small" align="center">
                <Text size="small"> No payment method</Text>
                <Box
                  direction="row"
                  style={{ cursor: "pointer" }}
                  className="noOutline"
                  gap="xxsmall"
                  round="8px"
                  align="center"
                  background="#009688"
                  pad="xsmall"
                  onClick={() => setAddPaymentModal(true)}
                >
                  {" "}
                  <AddCircle color="white" size="small" />{" "}
                  <Text size="small">Add payment method</Text>
                </Box>
              </Box>
            )}
          </>
        </Box>
      </Box>
    </>
  );
};

const ManageBilling = () => {
  const dispatch = useDispatch();
  const billingRedirect = useSelector(
    (state) => state.patient.billing_redirect
  );

  useEffect(() => {
    dispatch(getBillingRedirect());
  }, []);

  if (!billingRedirect)
    return <ThreeDots color="black" height={80} width={80} />;

  if (billingRedirect) window.location.replace(billingRedirect.url);

  return (
    <Box gap="small">
      <Text size="small" color="rgba(39, 75, 40, 1)">
        Please click the URL below if you are not automatically redirected:
      </Text>
      <a
        href={billingRedirect.url}
        style={{ fontSize: "small", textDecoration: "none", color: "#009688" }}
      >
        Click here
      </a>
    </Box>
  );
};

export default function Settings() {
  const user = useSelector((state) => state.app.user);

  const param = useLocation();
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const [checked, setChecked] = React.useState(
    JSON.parse(localStorage.getItem("Checked"))
  );

  const [currentTab, setCurrentTab] = useState(
    param.search === "?package" ? 3 : 1
  );

  const getWhattoRender = () => {
    if (currentTab === 1) return <GeneralInfo user={user} />;

    if (currentTab === 2) return <ChangePassword user={user} />;

    if (currentTab === 3)
      return (
        <MyPackage user={user} checked={checked} setChecked={setChecked} />
      );

    if (currentTab === 4) return <ManageBilling user={user} />;
  };

  return (
    <Box
      className="w-100 h-100"
      gap="small"
      pad="medium"
      style={{ overflowY: "scroll" }}
    >
      <Text className="ptFont" size="xxlarge" weight="bold">
        Settings
      </Text>
      <ChangeTimeZone />
      <Box
        gap={isTabletOrMobile ? "small" : null}
        background="rgba(255, 255, 255, 1)"
        pad="medium"
        direction={isTabletOrMobile ? "column" : "row"}
        style={{
          boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.12)",
          flexShrink: "0",
        }}
        align={isTabletOrMobile ? "center" : null}
        justify={isTabletOrMobile ? "center" : null}
      >
        {/* <Box background="rgba(255, 255, 255, 1)" pad="medium" direction="row" style={{ boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.12)" }}> */}
        <Box
          width={isTabletOrMobile ? "100%" : "20%"}
          gap="small"
          direction={isTabletOrMobile ? "row" : "column"}
          align={isTabletOrMobile ? "center" : null}
          justify={isTabletOrMobile ? "center" : null}
        >
          {/* <Box className="noOutline" onClick={() => setCurrentTab(1)} direction="row" align="center" gap="small"><User color={currentTab === 1 ? "#000" : null} /><Text color={currentTab === 1 ? "#000" : null} size="small">Account</Text></Box> */}
          {/* <Box className="noOutline" onClick={() => setCurrentTab(2)} direction="row" align="center" gap="small"><Lock color={currentTab === 2 ? "#000" : null} /><Text color={currentTab === 2 ? "#000" : null} size="small">Change Password</Text></Box> */}
          <Box
            className="noOutline"
            onClick={() => setCurrentTab(1)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            justify={isTabletOrMobile ? "center" : null}
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
          >
            <User color={currentTab === 1 ? "#000" : null} />
            <Text
              color={currentTab === 1 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
              textAlign="center"
            >
              Account
            </Text>
          </Box>

          <Box
            className="noOutline"
            onClick={() => setCurrentTab(2)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            justify={isTabletOrMobile ? "center" : null}
            background={isTabletOrMobile ? null : null}
          >
            <Lock color={currentTab === 2 ? "#000" : null} />
            <Text
              color={currentTab === 2 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
              textAlign="center"
            >
              Change Password
            </Text>
          </Box>

          {/* <Box className="noOutline" onClick={() => setCurrentTab(1)} direction="row" align="center" gap="small"><User color={currentTab === 1 ? "#000" : null} /><Text color={currentTab === 1 ? "#000" : null} size="small">Account</Text></Box> */}
          {/* <Box className="noOutline" onClick={() => setCurrentTab(2)} direction="row" align="center" gap="small"><Lock color={currentTab === 2 ? "#000" : null} /><Text color={currentTab === 2 ? "#000" : null} size="small">Change Password</Text></Box> */}

          <Box
            className="noOutline"
            onClick={() => {
              setCurrentTab(3);
              navigate("/dashboard/settings?package");
            }}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
          >
            <Package color={currentTab === 3 ? "#000" : null} />
            <Text
              color={currentTab === 3 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
              textAlign="center"
            >
              Package Details
            </Text>
          </Box>
          <Box
            className="noOutline"
            onClick={() => setCurrentTab(4)}
            direction={isTabletOrMobile ? "column" : "row"}
            align="center"
            pad={isTabletOrMobile ? "small" : null}
            gap="small"
            background={isTabletOrMobile ? null : null}
          >
            <DocumentLocked color={currentTab === 4 ? "#000" : null} />
            <Text
              color={currentTab === 4 ? "#000" : null}
              size={isTabletOrMobile ? "xsmall" : "small"}
              textAlign="center"
            >
              Manage Billing
            </Text>
          </Box>
        </Box>
        <Box width="80%">{getWhattoRender()}</Box>
      </Box>
    </Box>
  );
}

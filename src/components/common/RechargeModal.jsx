import { Box, Layer, Spinner, Text } from "grommet";
import { delay } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getMe } from "../../redux/app/appThunks";
import {
  applyCouponOneTimeRecharge,
  oneTimeRecharge,
  payOneTime,
} from "../../redux/patient/patientThunks";

const RechargeModal = ({ setDisplayOut }) => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const handleCoupon = () => {
    dispatch(
      applyCouponOneTimeRecharge({ payment_id: chargeObj.id, code: coupon })
    );
    setCoupon("");
  };
  const chargeObj = useSelector((state) => state.patient.onetime_recharge);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(oneTimeRecharge());
  }, []);

  const onPay = () => {
    setLoading(true);
    dispatch(payOneTime({ payment_id: chargeObj.id }));

    delay(() => {
      dispatch(getMe());

      setLoading(false);
      setDisplayOut(false);
    }, 4000);
  };

  if (!chargeObj)
    return (
      <Layer
        onClickOutside={() => setDisplayOut(false)}
        plain
        onEsc={() => setDisplayOut(false)}
        style={{ minWidth: "40%", maxWidth: "80%", maxHeight: "80%" }}
      >
        <Box
          background="white"
          pad="medium"
          margin="xsmall"
          style={{
            boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            fontSize: "small",
          }}
          round="8px"
          gap="small"
          justify="between"
        >
          {" "}
          <ThreeDots color="black" />{" "}
        </Box>
      </Layer>
    );

  return (
    <>
      <Layer
        onClickOutside={() => setDisplayOut(false)}
        plain
        onEsc={() => setDisplayOut(false)}
        style={{ minWidth: "40%", maxWidth: "80%", maxHeight: "80%" }}
      >
        <Box
          background="white"
          pad="medium"
          margin="xsmall"
          style={{
            boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            fontSize: "small",
          }}
          round="8px"
          gap="small"
          justify="between"
        >
          <Box>
            <Text size="small">
              <b>Buying credits:</b> {chargeObj.package.creditable}
            </Text>
            <Text size="small">
              <b>Price:</b> {chargeObj.package.price} USD
            </Text>
            {chargeObj.coupon ? (
              <Text size="small">
                <b>Discounted Price:</b> {chargeObj.discounted_price} USD
              </Text>
            ) : null}
            <Text size="small">
              <b>Therapist tier:</b> {chargeObj.package.tier}
            </Text>
          </Box>
          {chargeObj.coupon ? (
            "COUPON " + chargeObj.coupon.code + " APPLIED"
          ) : (
            <div
              className="box-row"
              style={{ justifyContent: "space-between" }}
            >
              <div className="labelInputSet">
                <label className="defaultLabel">Apply Coupon</label>

                <div className="box-row">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="defaultInput"
                    value={coupon}
                    onChange={(value) => setCoupon(value.target.value)}
                  />

                  <button
                    onClick={() => handleCoupon()}
                    size="small"
                    className="secondary-btn"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
          <Box
            className="noOutline"
            style={{
              cursor: "pointer",
              width: "max-content",
              minWidth: "100px",
            }}
            background="#009688"
            round="8px"
            pad="small"
            align="center"
            onClick={() => (loading ? null : onPay())}
          >
            {loading ? <Spinner color="white" /> : "Pay"}
          </Box>
        </Box>
      </Layer>
    </>
  );
};

export default RechargeModal;

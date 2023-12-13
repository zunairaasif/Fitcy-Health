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
  applyCouponUpgradeRecharge,
  autoChangeSub,
  payUpgrade,
  upgradeRecharge,
} from "../../redux/patient/patientThunks";

const UpgradeModal = ({ setDisplayOut, auto_charge }) => {
  const [loading, setLoading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const handleCoupon = () => {
    setIsloading(true);
    dispatch(
      applyCouponUpgradeRecharge({ payment_id: chargeObj.id, code: coupon })
    );
    setCoupon("");

    delay(() => {
      setIsloading(false);
    }, 2000);
  };
  const chargeObj = useSelector((state) => state.patient.upgrade_recharge);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(upgradeRecharge());
    dispatch(autoChangeSub({ auto_charge: auto_charge }));
    console.log("auto-change", auto_charge);
  }, []);

  const onPay = () => {
    setLoading(true);
    dispatch(payUpgrade({ payment_id: chargeObj.id }));

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
              <b>Upgrading to monthly subscription</b>
            </Text>
            <br />
            <Text size="small">
              <b>Buying credits:</b> 3
            </Text>
            <Text size="small">
              <b>Price:</b> {chargeObj.package.unit_price * 3} USD
            </Text>
            {chargeObj.coupon ? (
              <Text size="small">
                <b>Discounted Price:</b> {chargeObj.discounted_price} USD
              </Text>
            ) : null}
            <Text size="small">
              <b>Therapist tier:</b> {chargeObj.package.tier}
            </Text>

            {auto_charge === true ? (
              <Text size="small">
                <b>Upcoming invoice charge will be:</b> USD {""}
                {chargeObj.package.price}
              </Text>
            ) : (
              ""
            )}
          </Box>

          {chargeObj.coupon ? (
            "COUPON " + chargeObj.coupon.code + " APPLIED"
          ) : (
            <>
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
                      onClick={() => (isloading ? null : handleCoupon())}
                      size="small"
                      className="secondary-btn"
                    >
                      {isloading ? <Spinner color="black" /> : "Apply"}
                    </button>
                  </div>
                </div>
              </div>

              <Box margin={{ top: "small" }}>
                <div className="box-column-nogap">
                  {chargeObj.coupon ? (
                    <div
                      className="box-row"
                      style={{ justifyContent: "space-between", margin: "0" }}
                    >
                      <p>Discount Amount ({chargeObj.coupon.code})</p>

                      <p
                        style={{
                          color: "rgba(39, 75, 40, 1)",
                          fontWeight: "bolder",
                          fontSize: "normal",
                        }}
                      >
                        {(
                          chargeObj.package.price - chargeObj.discounted_price
                        ).toFixed(2)}
                      </p>
                    </div>
                  ) : null}
                  {chargeObj.s_coupon ? (
                    <div
                      className="box-row"
                      style={{ justifyContent: "space-between", margin: "0" }}
                    >
                      <p>Discount Amount ({chargeObj.s_coupon.id})</p>

                      <p
                        style={{
                          color: "rgba(39, 75, 40, 1)",
                          fontWeight: "bolder",
                          fontSize: "normal",
                        }}
                      >
                        {(
                          chargeObj.package.price - chargeObj.discounted_price
                        ).toFixed(2)}
                      </p>
                    </div>
                  ) : null}
                  <div
                    className="box-row"
                    style={{ justifyContent: "space-between", margin: "0" }}
                  >
                    <p>Total Amount</p>

                    <p
                      style={{
                        color: "rgba(39, 75, 40, 1)",
                        fontWeight: "bolder",
                        fontSize: "medium",
                      }}
                    >
                      USD {chargeObj.package.unit_price * 3}
                    </p>
                  </div>
                </div>
              </Box>
            </>
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

export default UpgradeModal;

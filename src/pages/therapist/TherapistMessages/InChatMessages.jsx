import { Box } from "grommet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRTMToken } from "../../../redux/agora/agoraThunks";
// import Loader from "../../../components/common/Loader";
import { RTMInstance as rtm } from "./rtm-client";
import {
  getMessageHistory,
  patchSingleMessage,
} from "../../../redux/patient/patientThunks";
import moment from "moment";
import * as $ from "jquery";
import InChatConversations from "./InChatConversation";
import { ThreeDots } from "react-loader-spinner";
import { getTherapistPatients } from "../../../redux/therapist/therapistThunks";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { delay } from "lodash";
import { getAppointment } from "../../../redux/app/appThunks";

// import { getTherapistPatients } from "../../../redux/therapist/therapistThunks";
const appId = process.env.REACT_APP_AGORA_APP_ID; //ENTER APP ID HERE
// import noAvatar from "../../../assets/noAvatar.jpeg";

// const PatientBox = ({ selectedPatient, patientID, setPatient, setPeerName }) => {
//     console.log(selectedPatient, patientID.id)

//     return (
//         <Box direction="row" className="noOutline" pad="small" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)", borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }} background={selectedPatient === patientID.id ? "white" : "transparent"} align="center" justify="start" gap="small" onClick={() => { setPatient(patientID.id); setPeerName(patientID.first_name + " " + patientID.last_name) }}>
//             <Avatar size="medium" src={patientID.dp ? patientID.dp : noAvatar} />

//             <Text size="small"> {patientID.first_name + " " + patientID.last_name}</Text>
//         </Box>
//     )
// }
// const PatientSelector = ({ patientSelected, setPatient, setPeerName }) => {

//     const patients = useSelector((state) => state.therapist.therapistPatients);
//     const user = useSelector((state) => state.app.user);
//     const dispatch = useDispatch();
//     useEffect(() => {
//         if (!patients)
//             dispatch(getTherapistPatients({ therapist: user.id }))

//     }, [])

//     if (!patients)

//         return <Box width="25%">
//             <Box pad="medium">

//                 <Text className="ptFont" size="xxlarge" weight="bold">
//                     Messages
//                 </Text>
//             </Box>
//         </Box>

//     return (
//         <Box gap="small" width="25%" >
//             <Box pad="medium">

//                 <Text className="ptFont" size="xxlarge" weight="bold">
//                     Messages
//                 </Text>
//             </Box>
//             <Box>
//                 {patients.map((x) => <PatientBox selectedPatient={patientSelected} setPeerName={setPeerName} patientID={x.patient} setPatient={(value) => setPatient(value)} key={x.id} />)}
//             </Box>
//         </Box>
//     )

// }

export default function TherapistInChatMessages({ peerID, setShow }) {
  const params = useParams();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.agora.rtmToken);
  const user = useSelector((state) => state.app.user);
  const appointment = useSelector((state) => state.app.this_appointment);

  const data = useSelector((state) => state.patient.messageHistory);
  const [logined, setLogined] = useState();

  const [popCount, setPopCount] = useState(0);
  const patients = useSelector((state) => state.therapist.therapistPatients);
  const getPatientName = () => {
    if (patients) {
      const thisPatient = patients.find(
        (x) => x.patient.id === appointment.patient
      );
      return (
        thisPatient.patient.first_name + " " + thisPatient.patient.last_name
      );
    } else return " ";
  };

  const getPatient = () => {
    if (patients) {
      const thisPatient = patients.find(
        (x) => x.patient.id === appointment.patient
      );
      return thisPatient.patient;
    } else return " ";
  };
  useEffect(() => {
    if (!patients && user.role !== "PATIENT")
      dispatch(getTherapistPatients({ therapist: user.id }));
    if (!appointment) dispatch(getAppointment({ id: params.app_id }));
  }, []);

  useEffect(() => {
    if (rtm.logined) setLogined(true);
  }, [rtm.logined]);
  useEffect(() => {
    if (!token)
      dispatch(
        getRTMToken({
          user_id: user.id,
        })
      );
  }, []);

  const updateScroll = () => {
    const element = document.getElementById("log");
    if (element && element.scrollTop === 0)
      element.scrollTop = element.scrollHeight;
  };

  const updateScrollOther = () => {
    const element = document.getElementById("log");
    if (element && element.scrollTop === 0)
      element.scrollTop = element.scrollHeight;
  };

  const uid = user.id;

  useEffect(() => {
    if (popCount === 0)
      rtm.on("ChannelMessage", async () => {
        // const msgObj = {
        //   message: data.args[0],
        //   from: data.args[1],
        //   timestamp: data.args[2].serverReceivedTs,
        // };
        // $("#log").append(
        //   `<div class="messageWrapperRecieve"><div class="recievedMessage" ><div class="messageSender">${sendername}</div>${
        //     msgObj.message.text
        //   }</div><div class="timeStampMessageRecieve">${moment().format(
        //     "MM/DD/YY hh:mm a"
        //   )}</div></div>`
        // );
        // updateScroll();
        updateScrollOther();
        delay(() => {
          loadMessageHistory(peerID);
        }, 500);
      });

    rtm.on("ConnectionStateChanged", async (data, data2) => {
      if (data === "ABORTED" && data2 === "REMOTE_LOGIN") {
        rtm.logined = false;
      }
    });
  }, []);

  useEffect(() => {
    if (!rtm.logined && token) {
      try {
        rtm.init(appId);
        window.rtm = rtm;
        rtm
          .login(uid.toString(), token)
          .then(() => {
            rtm.logined = true;
            setLogined(true);
            if (peerID) {
              rtm.joinChannel(peerID.toString());
              loadMessageHistory(peerID);
            }
          })
          .catch((err) => {
            console.log("here we go:", err);
          });
      } catch (err) {
        console.error("catch we go:", err);
      }
    }
  }, [token, rtm.logined]);

  useEffect(() => {
    if (peerID) {
      rtm.joinChannel(peerID.toString());
      loadMessageHistory(peerID);
      setPopCount(0);
    }
  }, [peerID]);

  const loadMessageHistory = (peerid) => {
    dispatch(
      getMessageHistory({
        patient_id: peerid,
        therapist_id:
          user.role === "PATIENT" ? user.current_therapist.id : user.id,
      })
    );
  };

  let sendername;
  sendername =
    user.role === "PATIENT"
      ? user.current_therapist.first_name +
        " " +
        user.current_therapist.last_name
      : getPatientName();

  if (data) {
    // setPopCount(1);
    if (data) {
      $("#log").empty();
      // const datainverted = _.cloneDeep(data);
      // datainverted.reverse();
      data.forEach((element) => {
        if (element.message_type === "text") {
          if (element.sender === user.id)
            $("#log").append(
              `<div class="messageWrapperSend"><div class="timeStampMessageSend">${moment(
                element.created
              ).format("MM/DD/YY hh:mm a")}</div><div class="sentMessage" >${
                element.message
              }</div></div>`
            );
          else {
            $("#log").append(
              `<div class="messageWrapperRecieve"><div class="recievedMessage" ><div class="messageSender">${sendername}</div>${
                element.message
              }</div><div class="timeStampMessageRecieve">${moment(
                element.created
              ).format("MM/DD/YY hh:mm a")}</div></div>`
            );
            if (element.read_status === false)
              dispatch(
                patchSingleMessage({ id: element.id, read_status: true })
              );
          }
        }
      });
      updateScroll();
    }
  }

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  if (!token || (!patients && user.role === "THERAPIST") || !appointment)
    return (
      <Box
        background="white"
        style={{
          position: "fixed",
          zIndex: "999999",
          right: 0,
          bottom: 0,
          height: "100vh",
          minWidth: isTabletOrMobile ? "100vw" : "450px",
        }}
        gap="small"
      >
        <Box height="100%" width="100%" align="center" justify="center">
          <ThreeDots color="black" />
        </Box>
      </Box>
    );

  return (
    <Box
      background="white"
      style={{
        position: "fixed",
        zIndex: "999999",
        right: 0,
        bottom: 0,
        // top: 0,
        height: isTabletOrMobile ? "50vh" : "100vh",
        borderRadius: isTabletOrMobile ? "28px 28px 0px 0px" : "0px",
        // boxShadow: isTabletOrMobile ? "0px 0px 100px 100px #808080" : "none",
        minWidth: isTabletOrMobile ? "100vw" : "450px",
        maxWidth: isTabletOrMobile ? "100vw" : "450px",
      }}
      gap="small"
    >
      {!logined ? null : (
        <Box width="100%" direction="row">
          {/* <PatientSelector patientSelected={peerID} setPatient={(value) => setPeerID(value)} setPeerName={(value) => setPeerName(value)} /> */}
          <InChatConversations
            uid={uid}
            close={setShow}
            peerID={peerID}
            patient={
              user.role === "PATIENT" ? user.current_therapist : getPatient()
            }
            peerName={
              user.role === "PATIENT"
                ? user.current_therapist.first_name +
                  " " +
                  user.current_therapist.last_name
                : getPatientName()
            }
          />
        </Box>
      )}
    </Box>
  );
}

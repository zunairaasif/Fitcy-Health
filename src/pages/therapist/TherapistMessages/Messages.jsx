import { Avatar, Box, Text, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRTMToken } from "../../../redux/agora/agoraThunks";
import Loader from "../../../components/common/Loader";
import Conversations from "./Conversations";
import { RTMInstance as rtm } from "./rtm-client";
import {
  getMessageHistory,
  patchSingleMessage,
} from "../../../redux/patient/patientThunks";
import moment from "moment";
import * as $ from "jquery";
import * as _ from "lodash";
import { getTherapistPatients } from "../../../redux/therapist/therapistThunks";
import {
  getLatestMessagesTime,
  getUnreadMessagesCount,
} from "../../../redux/app/appThunks";
const appId = process.env.REACT_APP_AGORA_APP_ID; //ENTER APP ID HERE
import noAvatar from "../../../assets/noAvatar.jpeg";
import { useMediaQuery } from "react-responsive";
import ConversationsMobile from "./CoversationsMobile";
import { Search } from "grommet-icons";
// import { concat } from "lodash";
const BASE_URL = process.env.REACT_APP_API_URL;

const PatientBox = ({
  selectedPatient,
  patientID,
  setPatient,
  setPeerName,
  setChatModal,
}) => {
  const user = useSelector((state) => state.app.user);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const messageCount = useSelector((state) => state.app.unread_count);

  const [lastMessage, setLastMessage] = useState("");
  const getLastMessage = async () => {
    await fetch(`${BASE_URL}/api/chat-history-unread/filter-chat/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ patient_id: patientID.id, therapist_id: user.id }),
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then((x) =>
      x.json().then((x) => {
        setLastMessage(
          x.length > 0 && x[x.length - 1]
            ? x[x.length - 1]
            : { message: "No Messages in this conversation" }
        );
      })
    );
    // const res = response.json(); // parses JSON response into native JavaScript objects

    // if (res && res.results && res.results[0])
  };
  useEffect(() => {
    getLastMessage();
  }, []);

  return (
    <Box
      direction="row"
      className="noOutline"
      pad={{
        top: isTabletOrMobile ? "medium" : "small",
        bottom: isTabletOrMobile ? "medium" : "small",
        left: "small",
        right: "small",
      }}
      style={{
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        flexShrink: "0",
      }}
      background={
        selectedPatient === patientID.id
          ? "white"
          : isTabletOrMobile
          ? "white"
          : "transparent"
      }
      align="center"
      justify="start"
      gap="small"
      onClick={() => {
        setPatient(patientID);
        setPeerName(patientID.first_name + " " + patientID.last_name);
        setChatModal(true);
        window.localStorage.setItem(
          "fitcyChatName",
          patientID.first_name + " " + patientID.last_name
        );
      }}
    >
      <Avatar
        style={{ flexShrink: "0" }}
        size="medium"
        src={patientID.dp ? patientID.dp : noAvatar}
      />
      <Box
        style={{ marginLeft: isTabletOrMobile ? "12px" : null }}
        gap={isTabletOrMobile ? "small" : "xsmall"}
      >
        <Box direction="row">
          <Text size={isTabletOrMobile ? "small" : "small"}>
            {" "}
            {patientID.first_name + " " + patientID.last_name}
          </Text>
          {messageCount && (
            <Box
              pad="4px"
              height="20px"
              width="20px"
              round="full"
              margin={{ left: "small" }}
              background={messageCount[patientID.id] > 0 ? "#009688" : null}
              align="center"
              justify="center"
              style={{
                border:
                  messageCount[patientID.id] > 0 ? "1px solid #ffffff80" : null,
              }}
            >
              {messageCount[patientID.id] > 0 ? (
                <Text size="xsmall">{messageCount[patientID.id]} </Text>
              ) : null}
            </Box>
          )}
        </Box>
        <Text
          color="#009688"
          weight="bold"
          size={isTabletOrMobile ? "xsmall" : "xsmall"}
          style={{
            whiteSpace: "nowrap",
            maxWidth: "300px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {" "}
          {lastMessage.message}
        </Text>
      </Box>
    </Box>
  );
};
const PatientSelector = ({
  patientSelected,
  setPatient,
  setPeerName,
  setChatModal,
}) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [searchVal, setSearchVal] = useState();
  const patients = useSelector((state) => state.therapist.therapistPatients);
  const messagesCount = useSelector((state) => state.app.unread_count);
  const latestTimes = useSelector((state) => state.app.latest_times);

  let filteredPatients = _.cloneDeep(patients);

  if (searchVal && filteredPatients)
    filteredPatients = filteredPatients.filter(
      (x) =>
        x.patient.first_name.toLowerCase().includes(searchVal.toLowerCase()) ||
        x.patient.last_name.toLowerCase().includes(searchVal.toLowerCase()) ||
        x.patient.first_name
          .toLowerCase()
          .concat(" " + x.patient.last_name.toLowerCase())
          .includes(searchVal.toLowerCase())
    );

  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!patients) dispatch(getTherapistPatients({ therapist: user.id }));
    if (!messagesCount) dispatch(getUnreadMessagesCount());
    if (!latestTimes) dispatch(getLatestMessagesTime());
  }, []);

  if (!patients)
    return (
      <Box width={isTabletOrMobile ? "100%" : "25%"} height="100%">
        <Box pad="medium">
          <Text className="ptFont" size="xxlarge" weight="bold">
            Messages
          </Text>
        </Box>
      </Box>
    );

  if (!patients)
    return (
      <Box width={isTabletOrMobile ? "100%" : "25%"} height="100%">
        <Box pad="medium">
          <Text className="ptFont" size="xxlarge" weight="bold">
            Messages
          </Text>
        </Box>
      </Box>
    );

  if (filteredPatients && latestTimes) {
    filteredPatients.reverse();
    filteredPatients.sort(
      (a, b) =>
        new Date(latestTimes[b.patient.id]) -
        new Date(latestTimes[a.patient.id])
    );
  }

  return (
    <Box
      gap="small"
      width={isTabletOrMobile ? "100%" : "25%"}
      height="100vh"
      style={{ flexShrink: "0", maxHeight: "90vh", overflowY: "auto" }}
    >
      <Box pad="medium" style={{ flexShrink: "0" }}>
        <Text className="ptFont" size="xxlarge" weight="bold">
          Messages
        </Text>
      </Box>
      <Box pad="xsmall" style={{ flexShrink: "0" }}>
        <TextInput
          className="noOutline"
          icon={<Search size="small" />}
          value={searchVal}
          size="small"
          placeholder="Search"
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
        />
      </Box>

      <Box
        background={isTabletOrMobile ? "#80808020" : null}
        direction="column"
      >
        {filteredPatients &&
          filteredPatients.map((x) =>
            x.is_active ? (
              <PatientBox
                selectedPatient={patientSelected}
                setPeerName={setPeerName}
                patientID={x.patient}
                setPatient={(value) => setPatient(value)}
                key={x.id}
                setChatModal={(value) => setChatModal(value)}
              />
            ) : null
          )}
      </Box>
    </Box>
  );
};

export default function TherapistMessages() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.agora.rtmToken);
  const user = useSelector((state) => state.app.user);
  const data = useSelector((state) => state.patient.messageHistory);
  const [logined, setLogined] = useState();
  const [chatModal, setChatModal] = useState(false);
  const [popCount, setPopCount] = useState(0);

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

  const [peerID, setPeerID] = useState({ id: null });
  const [peerName, setPeerName] = useState();

  const updateScroll = () => {
    const element = document.getElementById("log");

    if (element) element.scrollTop = element.scrollHeight;
  };
  const uid = user.id;

  useEffect(() => {
    if (popCount === 0)
      rtm.on("ChannelMessage", async (data) => {
        console.log("hello mister");
        const msgObj = {
          message: data.args[0],
          from: data.args[1],
          timestamp: data.args[2].serverReceivedTs,
        };
        $("#log").append(
          `<div class="messageWrapperRecieve"><div class="recievedMessage" ><div class="messageSender">${window.localStorage.getItem(
            "fitcyChatName"
          )}</div>${
            msgObj.message.text
          }</div><div class="timeStampMessageRecieve">${moment().format(
            "MM/DD/YY hh:mm a"
          )}</div></div>`
        );
        updateScroll();
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

            if (peerID && peerID.id) {
              rtm.joinChannel(peerID.id.toString());
              loadMessageHistory(peerID.id);
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
    if (peerID && peerID.id) {
      rtm.joinChannel(peerID.id.toString());
      loadMessageHistory(peerID.id);
      setPopCount(0);
    }
  }, [peerID]);

  const loadMessageHistory = (peerid) => {
    dispatch(getMessageHistory({ patient_id: peerid, therapist_id: user.id }));
  };

  if (data) {
    // setPopCount(1);
    if (data) {
      $("#log").empty();
      // const datainverted = _.cloneDeep(data);
      // datainverted.reverse();
      data.forEach((element) => {
        if (
          element.message_type === "text" &&
          (element.sender === peerID.id || element.sender === user.id)
        ) {
          if (element.sender === user.id)
            $("#log").append(
              `<div class="messageWrapperSend"><div class="timeStampMessageSend">${moment(
                element.created
              ).format("MM/DD/YY hh:mm a")}</div><div class="sentMessage" >${
                element.message
              }</div>
              ${
                element.read_status
                  ? `<span class="checkmark">
                    <div class="checkmark_stem"></div>
                    <div class="checkmark_kick"></div>
                  </span>`
                  : ""
              }
              </div>`
            );
          else {
            $("#log").append(
              `<div class="messageWrapperRecieve"><div class="recievedMessage" ><div class="messageSender">${peerName}</div>${
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

  if (!token) return <Loader />;

  return (
    <Box className="h-100 w-100" gap="small">
      {!logined ? null : (
        <Box
          width="100%"
          direction={isTabletOrMobile ? "column" : "row"}
          gap={isTabletOrMobile ? null : null}
        >
          <PatientSelector
            patientSelected={peerID.id}
            setPatient={(value) => setPeerID(value)}
            setPeerName={(value) => setPeerName(value)}
            setChatModal={(value) => setChatModal(value)}
          />
          {isTabletOrMobile ? (
            <ConversationsMobile
              uid={uid}
              peerID={peerID.id}
              peerName={peerName}
              patient={peerID}
              chatModal={chatModal}
              setChatModal={(value) => setChatModal(value)}
            />
          ) : (
            <Conversations
              uid={uid}
              peerID={peerID.id}
              peerName={peerName}
              patient={peerID}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

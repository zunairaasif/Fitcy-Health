/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import React, { useState } from "react";
// import * as $ from "jquery";
import { Avatar, Box, Form, Text, TextInput } from "grommet";
import { Emoji, FormClose, Send } from "grommet-icons";
// import moment from "moment";
// import { useDispatch, useSelector } from "react-redux";
import { BallTriangle as Loader, ThreeDots } from "react-loader-spinner";
import Picker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react";
import { serializeFormData } from "./common";
import { RTMInstance as rtm } from "./rtm-client";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessageHistory,
  saveSingleMessage,
} from "../../../redux/patient/patientThunks";
import { delay } from "lodash";
import { useMediaQuery } from "react-responsive";

const InChatConversations = (props) => {
  const { peerID, patient } = props;
  const user = useSelector((state) => state.app.user);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const updateScroll = () => {
    const element = document.getElementById("log");

    if (element) element.scrollTop = element.scrollHeight;
  };

  const loadMessageHistory = () => {
    dispatch(
      getMessageHistory({
        patient_id: peerID,
        therapist_id:
          user.role === "PATIENT" ? user.current_therapist.id : user.id,
      })
    );
  };

  const sendText = () => {
    const params = serializeFormData("loginForm");

    if (!params.peerMessage) return;

    setSending(true);

    rtm
      .sendChannelMessage(params.peerMessage, peerID)
      .then(() => {
        // $("#log").append(
        //   `<div class="messageWrapperSend"><div class="timeStampMessageSend">${moment().format(
        //     "MM/DD/YY hh:mm a"
        //   )}</div><div class="sentMessage" >${params.peerMessage}</div></div>`
        // );

        dispatch(
          saveSingleMessage({
            message_type: "text",
            message: params.peerMessage,
            read_status: false,
            to: user.role === "PATIENT" ? user.current_therapist.id : peerID,
            sender: user.id,
          })
        );
        delay(() => {
          loadMessageHistory();
        }, 500);
        delay(() => {
          updateScroll();
        }, 2000);
        document.getElementById("textMessage").value = "";

        setSending(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onEmojiClick = (event, emojiObject) => {
    document.getElementById("textMessage").value =
      document.getElementById("textMessage").value + emojiObject.emoji;
    setShowEmojiPicker(false);
    document.getElementById("textMessage").focus();
  };

  const handleKeyPress = (event) => {
    if (sending) return;

    if (event.key === "Enter") {
      event.preventDefault();
      sendText();
    }
  };

  return (
    <Box
      width="100%"
      height={isTabletOrMobile ? "49vh" : "100vh"}
      // height="100%"
      justify="between"
      pad={{ top: "small" }}
      // background="red"
      // border="all"
      style={{ borderLeft: "1px solid #80808020" }}
      // background="red"
      // round="8px"
    >
      <Box
        // margin={{ bottom: "small" }}
        // background="#FFFFFF"
        round="8px"
        direction="row"
        gap="small"
        align="center"
        width="100%"
        // height="100%"
        style={{ flexShrink: "0" }}
        justify="start"
        pad="small"
      >
        <FormClose onClick={() => props.close()} />
        <Avatar background="#f1f1f5" src={patient.dp} />

        <Box pad="small" round="8px">
          {props.peerName ? (
            props.peerName
          ) : (
            <Box
              pad="small"
              round="small"
              width="200px"
              background="#f1f1f5"
            ></Box>
          )}
        </Box>
      </Box>

      <Box id="log" gap="small" pad="medium">
        <Box justify="center" height="100%" align="center">
          <ThreeDots color="black" height={30} />
          <Text size="small" color="black" textAlign="center">
            Loading chat
          </Text>
        </Box>
      </Box>
      {showEmojiPicker ? (
        <Picker
          onEmojiClick={onEmojiClick}
          disableAutoFocus
          skinTone={SKIN_TONE_NEUTRAL}
          groupNames={{ smileys_people: "PEOPLE" }}
          native
          disableSkinTonePicker
          pickerStyle={{ position: "absolute", marginBottom: 120, bottom: 0 }}
        />
      ) : null}
      {peerID ? (
        <Box
          pad="small"
          margin={{ bottom: "xsmall" }}
          background="white"
          round="8px"
          justify="center"
        >
          <Form id="loginForm">
            <Box gap="small">
              <Box justify="center" gap="small" align="end">
                <Box
                  background="#1B366410"
                  width="100%"
                  direction="row"
                  align="center"
                  style={{ fontSize: "16px" }}
                  round="8px"
                  pad={{ left: "small" }}
                >
                  <Box direction="row" gap="small" pad={{ right: "small" }}>
                    <Emoji
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                  </Box>
                  <TextInput
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    name="peerMessage"
                    id="textMessage"
                    className="noOutlineNoBorder"
                  />
                  {sending ? (
                    <Box className="noOutline" width="10%" align="center">
                      <Loader
                        type="ThreeDots"
                        color="#395E9D"
                        height="30"
                        width="30"
                      />
                    </Box>
                  ) : (
                    <Box
                      onClick={() => sendText()}
                      className="noOutline"
                      width="10%"
                      align="center"
                    >
                      <Send />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Form>
        </Box>
      ) : null}
    </Box>
  );
};

export default InChatConversations;

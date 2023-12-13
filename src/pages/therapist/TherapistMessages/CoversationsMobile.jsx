/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import React, { useState } from "react";
import * as $ from "jquery";
import { Avatar, Box, Form, Text, TextInput } from "grommet";
import { Emoji, Send, FormPreviousLink } from "grommet-icons";
import moment from "moment";
// import { useDispatch, useSelector } from "react-redux";
import { BallTriangle as Loader, ThreeDots } from "react-loader-spinner";
import Picker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react";
import { serializeFormData } from "./common";
import { RTMInstance as rtm } from "./rtm-client";
import { useDispatch, useSelector } from "react-redux";
import { saveSingleMessage } from "../../../redux/patient/patientThunks";
import noAvatar from "../../../assets/noAvatar.jpeg";
import { useMediaQuery } from "react-responsive";

const ConversationsMobile = (props) => {
  const { peerID, patient, chatModal, setChatModal } = props;
  const user = useSelector((state) => state.app.user);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();

  const updateScroll = () => {
    const element = document.getElementById("log");

    if (element) element.scrollTop = element.scrollHeight;
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const sendText = () => {
    const params = serializeFormData("loginForm");

    if (!params.peerMessage) return;

    setSending(true);

    rtm
      .sendChannelMessage(params.peerMessage, peerID)
      .then(() => {
        $("#log").append(
          `<div class="messageWrapperSend"><div class="timeStampMessageSend">${moment().format(
            "MM/DD/YY hh:mm a"
          )}</div><div class="sentMessage" >${params.peerMessage}</div></div>`
        );

        dispatch(
          saveSingleMessage({
            message_type: "text",
            message: params.peerMessage,
            read_status: false,
            to: peerID,
            sender: user.id,
          })
        );

        updateScroll();
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
    <>
      {chatModal && (
        <Box
          width="100%"
          height="100%"
          // alignSelf="end"
          justify="between"
          // pad={{ top: "small,,/" }}
          style={{
            borderLeft: "1px solid #80808020",
            background: "white",
            boxShadow: "0px 0px 10px 10px #fff",
            // minHeight: isTabletOrMobile ? null",
            position: "fixed",
            top: "0",
            zIndex: "999",
          }}
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
            justify="start"
            pad="medium"
            style={{
              borderTop: "1px solid rgba(0, 0, 0, 0.12)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <FormPreviousLink onClick={() => setChatModal(false)} />
            {!isTabletOrMobile && (
              <Avatar size="medium" src={patient.dp ? patient.dp : noAvatar} />
            )}

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

          <Box id="log" gap="small" height="100%" pad="medium">
            <Box justify="center" height="100%" align="center">
              <Box justify="center" height="100%" align="center">
                {peerID ? (
                  <>
                    <ThreeDots color="black" height={30} />
                    <Text size="small" textAlign="center">
                      Loading chat
                    </Text>
                  </>
                ) : (
                  <Text size="small" textAlign="center">
                    Your conversations appears here,
                    <br />
                    select a chat to get started{" "}
                  </Text>
                )}
              </Box>
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
              pickerStyle={{
                position: "absolute",
                marginBottom: 120,
                bottom: 0,
              }}
            />
          ) : null}
          {peerID ? (
            <Box pad="small" background="white" round="8px" justify="center">
              <Form id="loginForm">
                <Box gap="small">
                  <Box justify="center" pad="small" gap="small" align="end">
                    <Box
                      background="#1B366410"
                      width="100%"
                      direction="row"
                      align="center"
                      style={{ fontSize: "16px" }}
                      round="8px"
                      pad="small"
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
      )}
    </>
  );
};

export default ConversationsMobile;

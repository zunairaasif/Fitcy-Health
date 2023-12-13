import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  // ClientConfig,
  // ICameraVideoTrack,
  // IMicrophoneAudioTrack,
} from "agora-rtc-react";
import {
  BsMicMuteFill,
  BsFillMicFill,
  BsCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import { IoExitOutline, IoReload } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllUsersForAgora, getRTCToken } from "../redux/agora/agoraThunks";
import Loader from "../components/common/Loader";
import { Box, Image, Layer, Text } from "grommet";
// import TherapistMessages from "./therapist/TherapistMessages/Messages";
import TherapistInChatMessages from "./therapist/TherapistMessages/InChatMessages";
import { Alert, ChatOption, FormClose } from "grommet-icons";
import Welcome from "../assets/videoWelcome.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { getAppointment, getUnreadMessagesCount } from "../redux/app/appThunks";
import { videoCallLog } from "../redux/patient/patientThunks";
import CameraAudioModal from "./../components/common/CameraAudioModal";

const config = {
  mode: "rtc",
  codec: "vp8",
};

const videoConfig = {
  encoderConfig: "1080p",
};

const appId = process.env.REACT_APP_AGORA_APP_ID; //ENTER APP ID HERE

const AgoraDemo = () => {
  const [inCall, setInCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const token = useSelector((state) => state.agora.rtcToken);
  const all_users = useSelector((state) => state.agora.all_users);
  const params = useParams();
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const appointment = useSelector((state) => state.app.this_appointment);

  useEffect(() => {
    if (!appointment) dispatch(getAppointment({ id: params.app_id }));

    if (!token)
      dispatch(
        getRTCToken({
          user_id: user.id,
          role: 1,
          channel_name: params.app_id.toString(),
        })
      );
    if (!all_users) dispatch(getAllUsersForAgora());
  }, []);

  console.log("ayyyyyyyy", params.app_id);

  if (!token || !all_users || !appointment) return <Loader />;

  if (appointment === "invalid")
    return (
      <Box align="center" gap="small">
        <Alert size="large" color="red" />
        <Box align="center" gap="small">
          <Text size="small" weight="bold">
            Invalid session ID
          </Text>
          <Box
            onClick={() => {
              navigate(`/`);
            }}
            className="primary-btn"
            round="100px"
            pad={{ vertical: "small", horizontal: "medium" }}
            responsive
          >
            <Text size="small" textAlign="center">
              Back to dashboard
            </Text>
          </Box>
        </Box>
      </Box>
    );

  return (
    <Box
      width="100%"
      height="100%"
      align="center"
      justify={isMessagesOpen && isTabletOrMobile ? "start" : "center"}
      background={inCall ? "#0E1420" : "white"}
    >
      {inCall ? (
        // <Box direction="row" justify="between">
        <>
          <VideoCall
            appointment={appointment}
            setInCall={setInCall}
            setCallEnded={setCallEnded}
            channelName={params.app_id.toString()}
            token={token}
            isMessagesOpen={isMessagesOpen}
            setIsMessagesOpen={setIsMessagesOpen}
          />
        </>
      ) : (
        // </Box>
        <ChannelForm setInCall={setInCall} callEnded={callEnded} />
      )}
    </Box>
  );
};
// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(
  undefined,
  videoConfig
);

const VideoCall = (props) => {
  const { setInCall, channelName, token, setCallEnded } = props;
  const [users, setUsers] = useState([]);
  const [usersReal, setUsersReal] = useState([]);
  const [showError, setShowError] = useState(false);
  const [start, setStart] = useState(false);
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks({ videoConfig });
  const fitcyUser = useSelector((state) => state.app.user);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        console.log(user);
        console.log(users);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            if (!prevUsers.find((x) => x.uid === user.uid))
              return [...prevUsers, user];
            else return [...prevUsers];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
        setUsersReal((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      client.on("user-joined", () => {
        setUsers(() => client.remoteUsers);
        setUsersReal(() => client.remoteUsers);
      });

      await client.join(appId, name, token, fitcyUser.id).catch((e) => {
        console.log(e);
        setShowError(true);
      });
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      console.log("init ready");
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  return (
    <div
      className="AgoraDemo"
      style={{
        width: props.isMessagesOpen && !isTabletOrMobile ? "65vw" : null,
        height: props.isMessagesOpen && isTabletOrMobile ? "48vh" : null,
      }}
    >
      {showError && (
        <Layer>
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
            justify="center"
            align="center"
          >
            <Text textAlign="center">
              Something went wrong, please click the button below to reload the
              page
            </Text>
            <Box
              background="rgb(0, 150, 136, 1)"
              className="noOutline"
              pad="small"
              round="8px"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.reload();
              }}
              align="center"
              direction="row"
              gap="xsmall"
            >
              <IoReload /> <Text>Reload</Text>
            </Box>
          </Box>
        </Layer>
      )}
      {start && tracks ? (
        <Videos
          usersReal={usersReal}
          users={users}
          tracks={tracks}
          isMessagesOpen={props.isMessagesOpen}
        />
      ) : (
        <Loader />
      )}
      {ready && tracks && (
        <Controls
          appointment={props.appointment}
          setCallEnded={setCallEnded}
          tracks={tracks}
          setStart={setStart}
          setInCall={setInCall}
          isMessagesOpen={props.isMessagesOpen}
          setIsMessagesOpen={props.setIsMessagesOpen}
        />
      )}
      {!ready && <CameraAudioModal />}
    </div>
  );
};

const Videos = (props) => {
  const { users, tracks, usersReal } = props;
  const fitcyUser = useSelector((state) => state.app.user);
  const allUsers = useSelector((state) => state.agora.all_users);
  const getUserNameViaID = (id) => {
    if (allUsers)
      return (
        allUsers.find((x) => x.id === id).first_name +
        " " +
        allUsers.find((x) => x.id === id).last_name
      );

    return "working";
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 786px)" });

  return (
    <>
      <div
        id="videos"
        style={{
          flexDirection:
            !isTabletOrMobile || props.isMessagesOpen ? "row" : "column",
        }}
      >
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <div
          style={{
            height: isTabletOrMobile ? "90%" : "95%",
            width: isTabletOrMobile ? "100%" : "50%",
            margin: "5px",
            marginBottom: "30px",
          }}
        >
          <AgoraVideoPlayer className="vid" videoTrack={tracks[1]} />
          <p className="videoNameTag">{getUserNameViaID(fitcyUser.id)}</p>
        </div>
        {usersReal.length > 0 &&
          usersReal.map((user) => {
            if (user) {
              return (
                <div
                  style={{
                    height: isTabletOrMobile ? "90%" : "95%",
                    width: isTabletOrMobile ? "100%" : "50%",
                    margin: "5px",
                  }}
                >
                  {users.find((x) => x.uid === user.uid) &&
                  users.find((x) => x.uid === user.uid).videoTrack ? (
                    <AgoraVideoPlayer
                      className="vid"
                      videoTrack={user.videoTrack}
                      key={user.uid}
                    />
                  ) : (
                    <div className="vid" />
                  )}
                  <p className="videoNameTag">{getUserNameViaID(user.uid)}</p>
                </div>
              );
            } else
              return (
                <div
                  style={{
                    height: "95%",
                    width: "50%",
                    margin: "5px",
                  }}
                >
                  {/* <AgoraVideoPlayer
                  className="vid"
                  videoTrack={user.videoTrack ? user.videoTrack : null}
                  key={user.uid}
                /> */}
                  <div className="vid" />
                  <p className="videoNameTag">{getUserNameViaID(user.uid)}</p>
                </div>
              );
          })}
        {allUsers.length === 0 && (
          <div
            style={{
              height: "95%",
              width: "50%",
              margin: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
            }}
          >
            Waiting for others to join...
          </div>
        )}
      </div>
    </>
  );
};

export const Controls = (props) => {
  const client = useClient();
  const { tracks, setStart, setInCall, setCallEnded } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [showMessages, setShowMessage] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  // const upcomingAppointments = useSelector(
  //   (state) => state.patient.upcomingAppointments
  // );
  // const upcomingAppointmentsTherapist = useSelector(
  //   (state) => state.therapist.upcomingAppointments
  // );

  useEffect(() => {
    const messagesInterval = setInterval(() => {
      dispatch(getUnreadMessagesCount());
    }, 3000);

    return () => {
      clearInterval(messagesInterval);
    };
  }, []);
  const messageCount = useSelector((state) => state.app.unread_count);

  const params = useParams();

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    dispatch(
      videoCallLog({
        action: "LEAVE",
        user: user.id,
        appointment: params.app_id,
      })
    );
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    setCallEnded(true);
  };

  const setCloseMessage = () => {
    setShowMessage(false);
    props.setIsMessagesOpen(false);
  };

  return (
    <div
      className="controls"
      style={{
        minWidth: props.isMessagesOpen && !isTabletOrMobile ? "65vw" : null,
      }}
    >
      {showMessages ? (
        <TherapistInChatMessages
          peerID={props.appointment.patient}
          setShow={() => setCloseMessage()}
        />
      ) : null}

      <p className={trackState.audio ? "on" : ""} onClick={() => mute("audio")}>
        {trackState.audio ? <BsFillMicFill /> : <BsMicMuteFill />}
      </p>
      <p className={trackState.video ? "on" : ""} onClick={() => mute("video")}>
        {trackState.video ? (
          <BsCameraVideoFill />
        ) : (
          <BsFillCameraVideoOffFill />
        )}
      </p>
      {
        <p
          onClick={() => {
            props.setIsMessagesOpen(true);
            setShowMessage(true);
          }}
        >
          <ChatOption size="15px" color="#fff" />
          {messageCount &&
            messageCount[
              user.role === "THERAPIST"
                ? props.appointment.patient
                : user.current_therapist.id
            ] > 0 && (
              <Box
                pad="4px"
                height="13px"
                width="13px"
                round="full"
                margin={{ left: "small" }}
                background={
                  messageCount[
                    user.role === "THERAPIST"
                      ? props.appointment.patient
                      : user.current_therapist.id
                  ] > 0
                    ? "#009688"
                    : null
                }
                align="center"
                justify="center"
                style={{
                  border:
                    messageCount[
                      user.role === "THERAPIST"
                        ? props.appointment.patient
                        : user.current_therapist.id
                    ] > 0
                      ? "1px solid #ffffff80"
                      : null,
                  flexShrink:
                    messageCount[
                      user.role === "THERAPIST"
                        ? props.appointment.patient
                        : user.current_therapist.id
                    ] > 0
                      ? "0"
                      : null,
                }}
              >
                {messageCount[
                  user.role === "THERAPIST"
                    ? props.appointment.patient
                    : user.current_therapist.id
                ] > 0 ? (
                  <Text size="9px">
                    {user.role === "THERAPIST"
                      ? messageCount[props.appointment.patient]
                      : messageCount[user.current_therapist.id]}{" "}
                  </Text>
                ) : null}
              </Box>
            )}
        </p>
      }
      {
        <p onClick={() => leaveChannel()}>
          <IoExitOutline color="#F44336" />
        </p>
      }
    </div>
  );
};

const ChannelForm = (props) => {
  const { setInCall, callEnded } = props;
  const navigate = useNavigate();
  const handleRoute = () => {
    navigate(`/`);
  };
  return (
    <Box
      gap="small"
      pad="small"
      align="center"
      justify="center"
      height="100vh"
      width="100vw"
    >
      <Box
        onClick={(e) => {
          e.preventDefault();
          handleRoute();
        }}
        className="noOutline"
        direction="row"
        align="center"
        gap="small"
        justify="end"
        width="100%"
      >
        <FormClose size="large" />
      </Box>

      <Box
        width="50%"
        align="center"
        margin="auto"
        gap="medium"
        alignSelf="center"
        style={{ justifySelf: "center" }}
      >
        <Image width="250px" src={Welcome} />
        {callEnded && (
          <Text textAlign="center">Your session has successfully ended</Text>
        )}
        {!callEnded && (
          <>
            <Text textAlign="center">
              To make fitcyhealth a secure space for you, we’ve ensured that all
              sessions are automatically{" "}
              <span style={{ color: "#009688" }}>
                <b>end-to-end encrypted</b>
              </span>
            </Text>
            <Text textAlign="center" size="small" color="#757575">
              <i>
                This means that your content is private, so FitcyHealth and
                third parties can’t see it
              </i>
            </Text>
          </>
        )}

        <Box
          onClick={(e) => {
            e.preventDefault();
            if (!callEnded) setInCall(true);
            else handleRoute();
          }}
          className="primary-btn"
          round="100px"
          pad={{ vertical: "small", horizontal: "medium" }}
          responsive
        >
          <Text size="small" textAlign="center">
            {callEnded
              ? "Back to dashboard"
              : "Proceed to your encrypted session"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AgoraDemo;

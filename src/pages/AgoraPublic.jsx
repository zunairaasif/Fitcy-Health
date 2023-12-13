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
import Loader from "../components/common/Loader";
import { Box, Image, Layer, Text } from "grommet";
// import TherapistMessages from "./therapist/TherapistMessages/Messages";
import { FormClose } from "grommet-icons";
import Welcome from "../assets/videoWelcome.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CameraAudioModal from "../components/common/CameraAudioModal";

const config = {
  mode: "rtc",
  codec: "vp8",
};

const videoConfig = {
  encoderConfig: "1080p",
};

const appId = "e71ec12c65ed468e9b2387a1836cef8c"; //ENTER APP ID HERE

const AgoraPublic = () => {
  const [inCall, setInCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  // const dispatch = useDispatch();

  // const token = useSelector((state) => state.agora.rtcToken);
  // const all_users = useSelector((state) => state.agora.all_users);

  const params = useParams();
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  useEffect(() => {}, []);

  // if ( !all_users) return <Loader />;

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
            setInCall={setInCall}
            setCallEnded={setCallEnded}
            channelName={params.callID}
            // token={token}
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
  const { setInCall, channelName, setCallEnded } = props;
  const [users, setUsers] = useState([]);
  const [usersReal, setUsersReal] = useState([]);
  const [showError, setShowError] = useState(false);
  const [start, setStart] = useState(false);
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks({ videoConfig });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const loc = useLocation();
  const isPatient = () => {
    console.log(
      "ispatient called",
      loc.pathname,
      loc.pathname.startsWith("/p/")
    );
    return loc.pathname.startsWith("/p/");
  };

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        console.log("choice", user);
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

      await client
        .join(appId, name, null, isPatient() ? "1" : "2")
        .catch((e) => {
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
        <Videos usersReal={usersReal} users={users} tracks={tracks} />
      ) : (
        <Loader />
      )}
      {ready && tracks && (
        <Controls
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
  const allUsers = useSelector((state) => state.agora.all_users);

  const loc = useLocation();
  const isPatient = () => {
    return loc.pathname.startsWith("/p/");
  };
  const getUserNameViaID = (id) => {
    if (id === "1") return "Patient";
    else if (id === "2") return "Therapist";
    else return "what?";
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
          <p className="videoNameTagPublic">
            {getUserNameViaID(isPatient() ? "1" : "2")}
          </p>
        </div>
        {usersReal &&
          usersReal.length > 0 &&
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
                  <p className="videoNameTagPublic">
                    {getUserNameViaID(user.uid)}
                  </p>
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
                  <p className="videoNameTagPublic">
                    {getUserNameViaID(user.uid)}
                  </p>
                </div>
              );
          })}
        {allUsers && allUsers.length === 0 && (
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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  // const upcomingAppointments = useSelector(
  //   (state) => state.patient.upcomingAppointments
  // );
  // const upcomingAppointmentsTherapist = useSelector(
  //   (state) => state.therapist.upcomingAppointments
  // );

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
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    setCallEnded(true);
  };

  return (
    <div
      className="controlsPublic"
      style={{
        minWidth: props.isMessagesOpen && !isTabletOrMobile ? "65vw" : null,
      }}
    >
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

export default AgoraPublic;

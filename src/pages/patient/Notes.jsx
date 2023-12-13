import { Avatar, Box, Layer, Text } from "grommet";
import { Calendar, FormClose } from "grommet-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { getPatientNotes } from "../../redux/patient/patientThunks";
import noAvatar from "../../assets/noAvatar.jpeg";
import parse from "html-react-parser";
import { getTherapistList } from "../../redux/patient/patientThunks";

const NoteDetail = ({ note, close }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTherapistList());
  }, []);
  const therapists = useSelector((state) => state.patient.therapist_list);

  const getTherapistName = (id) => {
    if (therapists) {
      const thistherapist = therapists.find((x) => x.id === id);
      if (thistherapist)
        return thistherapist.first_name + " " + thistherapist.last_name;
      else return " ";
    } else return " ";
  };
  return (
    <Layer plain style={{ minWidth: "40%", maxHeight: "60%" }}>
      <Box
        background="white"
        pad="medium"
        margin="xsmall"
        style={{
          boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        gap="small"
        justify="between"
      >
        <Box justify="between" direction="row">
          <Text weight="bold">Note Details</Text>
          <Box className="noOutline" onClick={() => close()}>
            <FormClose />
          </Box>
        </Box>
        <Box className="divider" />

        <Text>{getTherapistName(note.therapist)}</Text>
        <Box>
          <Text size="small">
            {moment(note.created).format("ddd DD, MMMM")}
          </Text>
        </Box>
        <Box style={{ overflowY: "scroll" }}>{parse(note.text)}</Box>
      </Box>
    </Layer>
  );
};

const SingleNote = ({ note }) => {
  const [showNoteDetail, setShowNoteDetail] = useState();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  useEffect(() => {
    dispatch(getTherapistList());
  }, []);
  const therapists = useSelector((state) => state.patient.therapist_list);

  const getTherapistName = (id) => {
    if (therapists) {
      const thistherapist = therapists.find((x) => x.id === id);
      if (thistherapist)
        return thistherapist.first_name + " " + thistherapist.last_name;
      else return " ";
    } else return " ";
  };

  return (
    <>
      {showNoteDetail ? (
        <NoteDetail note={note} close={() => setShowNoteDetail(false)} />
      ) : null}
      <Box
        width={isTabletOrMobile ? "100%" : "30%"}
        background="#FFFCF8"
        pad="medium"
        margin="xsmall"
        style={{
          boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        justify="between"
      >
        <Box gap="small">
          <Box direction="row" gap="small">
            <Avatar
              size="small"
              src={
                user.current_therapist.dp ? user.current_therapist.dp : noAvatar
              }
            />
            <Text>{getTherapistName(note.therapist)}</Text>
          </Box>
          <Box className="divider" />
          <Box direction="row" align="center" gap="small">
            <Calendar />
            <Text size="small">
              {moment(note.created).format("ddd DD, MMMM")}
            </Text>
          </Box>
          <Box className="divider" />
          <Box
            size="small"
            style={{
              maxHeight: "100px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {parse(note.text)}
          </Box>
        </Box>
        <Box
          className="noOutline"
          onClick={() => setShowNoteDetail(true)}
          margin={{ top: "medium" }}
          width="100%"
          align="center"
          justify="center"
          background="white"
          style={{
            cursor: "pointer",
            color: "rgba(0, 150, 136, 1)",
            border: "1px solid rgba(0, 0, 0, 0.24)",
            flexShrink: "0",
          }}
          pad="xsmall"
          round="4px"
        >
          <Text size="small">Read More</Text>
        </Box>
      </Box>
    </>
  );
};

export default function Notes() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.patient.notes);
  const user = useSelector((state) => state.app.user);
  useEffect(() => {
    dispatch(getPatientNotes({ patient: user.id }));
  }, []);

  return (
    <Box
      className="w-100 h-100"
      gap="small"
      pad="medium"
      style={{ overflowY: "scroll" }}
    >
      <Text className="ptFont" size="xxlarge" weight="bold">
        Notes
      </Text>
      <Box
        style={{ flexWrap: "wrap" }}
        height="100%"
        gap="small"
        direction="row"
      >
        {notes.map((x) => (
          <SingleNote key={x.id} note={x} />
        ))}
      </Box>
      <Box
        align="center"
        justify="center"
        height="100%"
        gap="small"
        direction="row"
      >
        {notes && notes.length === 0 ? (
          <Text>No notes have been made yet</Text>
        ) : null}
      </Box>
    </Box>
  );
}

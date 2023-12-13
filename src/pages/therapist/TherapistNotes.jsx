import { Avatar, Box, Layer, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
import {
  AddCircle,
  FormClose,
  FormEdit,
  FormPreviousLink,
} from "grommet-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPatientNote,
  getTherapistNotes,
  getTherapistPatients,
  patchPatientNote,
} from "../../redux/therapist/therapistThunks";
import noAvatar from "../../assets/noAvatar.jpeg";
import { useMediaQuery } from "react-responsive";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import parse from "html-react-parser";
import _ from "lodash";

const NoteDetail = ({ note, close }) => {
  const user = useSelector((state) => state.app.user);

  return (
    <Layer
      onClickOutside={close}
      plain
      style={{ minWidth: "40%", maxHeight: "60%" }}
    >
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
        <Text>
          {user.first_name} {user.last_name}
        </Text>
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

const EditNote = ({ note, close }) => {
  const [newNote, setNewNote] = useState(note.text);
  const dispatch = useDispatch();
  const processNotePatch = () => {
    dispatch(
      patchPatientNote({
        id: note.id,
        text: newNote,
      })
    );
  };

  const onClose = () => {
    dispatch(
      getTherapistNotes({
        appointment_therapist: note.therapist,
        patient: note.patient,
      })
    );
    close();
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
          <Text weight="bold">Edit Note</Text>
          <Box className="noOutline" onClick={() => onClose()}>
            <FormClose />
          </Box>
        </Box>
        <Box className="divider" />

        <Box style={{ overflowY: "scroll" }}>
          <ReactQuill theme="snow" value={newNote} onChange={setNewNote} />
        </Box>
        <Box
          className="noOutline"
          onClick={() => processNotePatch()}
          background="rgba(0, 150, 136, 1)"
          round="10px"
          pad="small"
          style={{ width: "fit-content", cursor: "pointer" }}
        >
          <Text size="small">Save</Text>
        </Box>
      </Box>
    </Layer>
  );
};

const SingleNote = ({ note }) => {
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const [editNote, setEditNote] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <>
      {showNoteDetail ? (
        <NoteDetail note={note} close={() => setShowNoteDetail(false)} />
      ) : null}

      {editNote ? (
        <EditNote note={note} close={() => setEditNote(false)} />
      ) : null}
      <Box
        width={isTabletOrMobile ? "100%" : "30%"}
        background="#FFFCF8"
        pad="medium"
        margin={isTabletOrMobile ? "medium" : "xsmall"}
        style={{
          boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.16)",
        }}
        round="8px"
        height="220px"
        justify="between"
      >
        <Box gap="small">
          <Box direction="row" justify="between" align="center">
            <Text size="small">
              {moment(note.created).format("ddd DD, MMMM")}
            </Text>
            <FormEdit className="noOutline" onClick={() => setEditNote(true)} />
          </Box>
          <Box className="divider" />
          <Box
            style={{
              maxHeight: "50px",
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

const PatientBox = ({ selectedPatient, patientID, setPatient, setModal }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
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
        background={selectedPatient === patientID.id ? "white" : "transparent"}
        align="center"
        justify="start"
        gap="small"
        onClick={() => {
          setPatient(patientID.id);
          setModal(true);
        }}
      >
        <Avatar size="medium" src={patientID.dp ? patientID.dp : noAvatar} />

        <Box
          justify={isTabletOrMobile ? "center" : "start"}
          style={{ marginLeft: isTabletOrMobile ? "12px" : null }}
          gap={isTabletOrMobile ? "small" : "xsmall"}
        >
          <Text size="small" weight="bold">
            {patientID.first_name + " " + patientID.last_name}
          </Text>
          {/* <Text size="small">
            <span style={{ color: "#009688" }}>{patientID.credits}&nbsp;</span>
            Sessions Left
          </Text> */}
        </Box>
      </Box>
    </>
  );
};

const PatientProfile = ({ patientID }) => {
  const [addNote, setAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const processNote = () => {
    dispatch(
      addPatientNote({
        text: newNote,
        patient: patientID.id,
        therapist: user.id,
      })
    );

    dispatch(
      getTherapistNotes({
        appointment_therapist: user.id,
        patient: patientID.id,
      })
    );

    setAddNote(false);
  };

  return (
    <>
      {addNote ? (
        <Layer
          plain
          style={{
            minWidth: "40%",
            maxHeight: "100%",
            height: isTabletOrMobile ? "100%" : null,
          }}
        >
          <Box
            background="white"
            pad="medium"
            margin="xsmall"
            style={{
              boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            }}
            round="8px"
            gap="small"
            height="100%"
            justify={isTabletOrMobile ? "start" : "between"}
          >
            <Box justify="between" direction="row">
              <Text weight="bold">Add Note</Text>
              <Box className="noOutline" onClick={() => setAddNote(false)}>
                <FormClose />
              </Box>
            </Box>
            <Box className="divider" />
            <Box></Box>
            {/* <Box gap="small"> */}
            <ReactQuill
              theme="snow"
              style={{ height: "100%", maxHeight: "60vh", overflow: "auto" }}
              onChange={setNewNote}
            />

            {/* </Box> */}
            <Box
              className="noOutline"
              onClick={processNote}
              align="center"
              background="#80808020"
              pad="small"
              style={{ flexShrink: "0" }}
              round="8px"
            >
              <Text size="small">Confirm</Text>
            </Box>
          </Box>
        </Layer>
      ) : null}
      <Box
        direction="row"
        width="100%"
        className="noOutline"
        pad="small"
        gap="small"
        background="white"
        align="center"
        justify={isTabletOrMobile ? "between" : "start"}
      >
        {!isTabletOrMobile && (
          <Avatar size="medium" src={patientID.dp ? patientID.dp : noAvatar} />
        )}

        <Box justify={isTabletOrMobile ? "between" : "start"} width="100%">
          <Text size="small" weight="bold">
            {patientID.first_name + " " + patientID.last_name}
          </Text>
          {/* <Text size="small">
            <span style={{ color: "#009688" }}>{patientID.credits}&nbsp;</span>
            Sessions Left
          </Text> */}
        </Box>
        <Box
          onClick={() => setAddNote(true)}
          className="noOutline"
          direction="row"
          gap="small"
          align="center"
          background="#80808020"
          pad="small"
          round="8px"
          style={{ width: "max-content", flexShrink: "0" }}
        >
          <Text size="small">Add Note</Text>
          <AddCircle />
        </Box>
      </Box>
    </>
  );
};
const PatientSelector = ({ selectedPatient, setPatient, setModal }) => {
  const patients = useSelector((state) => state.therapist.therapistPatients);
  const user = useSelector((state) => state.app.user);
  const [searchVal, setSearchVal] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!patients) dispatch(getTherapistPatients({ therapist: user.id }));
  }, []);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  if (!patients)
    return (
      <Box width={isTabletOrMobile ? "100%" : "25%"}>
        <Box pad="medium">
          <Text className="ptFont" size="xxlarge" weight="bold">
            Notes
          </Text>
        </Box>
      </Box>
    );

  let filteredPatients = _.cloneDeep(patients);

  filteredPatients.reverse();

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

  return (
    <Box
      gap="small"
      style={{ flexShrink: "0", maxHeight: "90vh", overflowY: "auto" }}
      width={isTabletOrMobile ? "100%" : "25%"}
    >
      <Box pad="medium" style={{ flexShrink: "0" }}>
        <Text className="ptFont" size="xxlarge" weight="bold">
          Notes
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
        style={{ flexShrink: "0" }}
        direction="column"
        background={isTabletOrMobile ? "white" : "transparent"}
      >
        {filteredPatients.map((x) =>
          x.is_active ? (
            <PatientBox
              selectedPatient={selectedPatient}
              patientID={x.patient}
              setModal={(value) => setModal(value)}
              setPatient={(value) => setPatient(value)}
              key={x.id}
            />
          ) : null
        )}
      </Box>
    </Box>
  );
};

export default function TherapistNotes() {
  const dispatch = useDispatch();
  const [patient, setPatient] = useState(null);
  const [modal, setModal] = useState(null);
  const notes = useSelector((state) => state.therapist.notes);
  const user = useSelector((state) => state.app.user);
  useEffect(() => {
    if (patient)
      dispatch(
        getTherapistNotes({ appointment_therapist: user.id, patient: patient })
      );
  }, [patient]);

  const patients = useSelector((state) => state.therapist.therapistPatients);

  const selectedPatient = patients
    ? patients.find((x) => x.patient.id === patient)
    : {};
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <Box className="w-100 h-100" gap="small">
      <Box direction={isTabletOrMobile ? "column" : "row"}>
        <PatientSelector
          selectedPatient={patient}
          setPatient={(value) => setPatient(value)}
          setModal={(value) => setModal(value)}
        />

        {!isTabletOrMobile ? (
          !patient ? (
            <Box
              pad="medium"
              background="white"
              align="center"
              justify="center"
              height="90vh"
              width={isTabletOrMobile ? "100%" : "75%"}
              style={{
                flexWrap: "wrap",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                overflowY: "auto",
              }}
              gap="small"
              direction="row"
            >
              <Text size="small">Please select a client to get started</Text>
            </Box>
          ) : (
            <Box
              pad="medium"
              background="white"
              width={isTabletOrMobile ? "100%" : "75%"}
              height="90vh"
              style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}
              gap="small"
            >
              <Box>
                <PatientProfile patientID={selectedPatient.patient} />
              </Box>
              <Box
                pad="medium"
                background="white"
                width="100%"
                style={{ flexWrap: "wrap", overflowY: "auto" }}
                gap="small"
                direction="row"
              >
                {notes.length > 0 ? (
                  notes.map((x) => <SingleNote key={x.id} note={x} />)
                ) : (
                  <Text size="small">No notes for this patient</Text>
                )}
              </Box>
            </Box>
          )
        ) : null}

        {isTabletOrMobile && patient && modal ? (
          <Layer
            style={{ position: "absolute", zIndex: "99999999999999999999" }}
          >
            <Box
              pad="medium"
              background="white"
              width={isTabletOrMobile ? "100%" : "75%"}
              height="100vh"
              style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}
              gap="small"
            >
              <Box
                direction="row"
                align="center"
                width="100%"
                style={{
                  flexShrink: "0",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <FormPreviousLink onClick={() => setModal(false)} width="20%" />
                <PatientProfile
                  patientID={selectedPatient.patient}
                  width="80%"
                />
              </Box>
              <Box
                pad="medium"
                background="white"
                width="100%"
                style={{ flexWrap: "wrap", overflowY: "auto" }}
                gap="small"
                direction="row"
              >
                {notes.length > 0 ? (
                  notes.map((x) => <SingleNote key={x.id} note={x} />)
                ) : (
                  <Text size="small">No notes for this patient</Text>
                )}
              </Box>
            </Box>
          </Layer>
        ) : null}
      </Box>
    </Box>
  );
}

import React from "react";
import { Box, Layer, Text } from "grommet";
import { FormClose } from "grommet-icons";
import GIF from "../../assets/23ss.gif";

const MediaPermission = () => {
  const [show, setShow] = React.useState(true);

  return (
    <>
      {show && (
        <Layer
          plain
          style={{ minWidth: "40%", maxHeight: "80%" }}
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
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
            <FormClose
              style={{ cursor: "pointer", alignSelf: "flex-end" }}
              className="noOutline"
              onClick={() => setShow(false)}
            />
            <Text weight="bold" size="small">
              Please enable the Media (Audio and Video)
            </Text>
            <img src={GIF} alt="gif" width={"100%"} height={"40%"} />

            <Box
              background="#009688"
              style={{ width: "max-content" }}
              className="noOutline"
              onClick={() => setShow(false)}
              pad="small"
              round="8px"
            >
              <Text size="small" weight="bold">
                Dismiss
              </Text>
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default MediaPermission;

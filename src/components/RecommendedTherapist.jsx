import { Avatar, Box, Grommet, Image, Layer, Text, Video } from "grommet";
import React, { useState } from "react";
import noAvatar from "../assets/noAvatar.jpeg";

// import starRating from "../assets/star.svg"
import sheildPopular from "../assets/sheild.svg";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { FormClose } from "grommet-icons";
// import { FormClose } from "grommet-icons";

const RecommendedTherapist = ({ x, goToNextStep }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Grommet key={x.id}>
      {showProfile && (
        <Layer
          plain
          style={{
            minWidth: isTabletOrMobile ? "100%" : "60%",
            maxWidth: isTabletOrMobile ? "100%" : "80%",
            maxHeight: isTabletOrMobile ? "100%" : "95%",
          }}
          onEsc={() => setShowProfile(false)}
          onClickOutside={() => setShowProfile(false)}
        >
          {isTabletOrMobile ? (
            <Box
              style={{ position: "absolute" }}
              onClick={() => setShowProfile(false)}
              className="noOutline"
              pad="small"
              margin="medium"
              background="#00000090"
              round="full"
            >
              <FormClose color="white" />
            </Box>
          ) : null}
          <Box
            background={isTabletOrMobile ? "#EFFFFE" : "white"}
            margin="xsmall"
            style={{
              boxShadow: "0px 1px 6px 100vw rgba(0, 0, 0, 0.16)",
            }}
            round="8px"
            gap={isTabletOrMobile ? null : "small"}
            justify="between"
          >
            <Box
              round="8px 8px 0px 0px"
              background={"#EFFFFE"}
              pad={isTabletOrMobile ? null : "medium"}
              style={{
                flexShrink: "0",
                height: isTabletOrMobile ? "200px" : null,
                borderBottom: isTabletOrMobile ? null : "#009688 2px solid",
              }}
            >
              {isTabletOrMobile ? (
                <Image fit="contain" fill="true" src={x.dp} />
              ) : (
                <FormClose
                  onClick={() => setShowProfile(false)}
                  className="noOutline"
                />
              )}
            </Box>
            <Box
              pad="medium"
              direction="row"
              gap="medium"
              align="center"
              round={isTabletOrMobile ? "20px 20px 0px 0px" : null}
              background="white"
              justify="between"
              style={{
                borderBottom: "1px dashed rgba(0, 150, 136, 1)",
                boxShadow: isTabletOrMobile
                  ? "0 0 100px rgba(0,0,0,0.5)"
                  : null,

                flexShrink: "0",
              }}
            >
              <Box gap="small" direction="row">
                {isTabletOrMobile ? null : (
                  <Avatar
                    size="xlarge"
                    style={{ border: "2px solid #009688" }}
                    src={x.dp ? x.dp : noAvatar}
                  />
                )}

                <Box gap="xsmall">
                  <Text weight="bold">
                    {x.first_name} {x.last_name}
                  </Text>
                  <Text size="small">{x.designation}</Text>
                  <div className="box-row">
                    {/* <div className="ratingtag" style={{ fontSize: "small", padding: "5px" }}> <img src={starRating} /> <div><b>4.5</b> {isTabletOrMobile ? null : "Rating"} </div></div> */}
                    {/* <div className="populartag"> <img src={sheildPopular} /> <div>{isTabletOrMobile ? null : "Most Popular"}</div></div> : null} */}

                    {x.achievement === "MOST_POPULAR" ? (
                      <div
                        className="populartag"
                        style={{ fontSize: "small", padding: "5px" }}
                      >
                        {" "}
                        <img src={sheildPopular} />
                        <Text size="xsmall">Most Popular</Text>
                      </div>
                    ) : null}
                    {x.achievement === "RISING_TALENT" ? (
                      <div className="populartag">
                        {" "}
                        <img src={sheildPopular} />
                        <Text size="xsmall">Rising Talent</Text>
                      </div>
                    ) : null}
                  </div>
                </Box>
              </Box>
              {isTabletOrMobile ? null : (
                <Box
                  direction="row"
                  align="center"
                  justify="center"
                  round="10px"
                  gap="xsmall"
                  style={{ border: "0.5px solid #000000" }}
                  background="#EFFFFE"
                  pad="xsmall"
                >
                  <Box
                    pad="small"
                    align="center"
                    style={{ borderRight: "0.5px solid #00000050" }}
                  >
                    <Text weight="bold">
                      {moment().year() - x.years_of_experience}+
                    </Text>
                    <Text size="small">Years of Experience</Text>
                  </Box>

                  <Box pad="small" align="center">
                    <Text weight="bold">{x.language.length}</Text>
                    <Text size="small">Spoken Languages</Text>
                  </Box>
                </Box>
              )}
            </Box>
            <Box
              background="white"
              round="0px 0px 8px 8px"
              pad="medium"
              direction={isTabletOrMobile ? "column" : "row"}
              gap="medium"
            >
              <Box
                width={isTabletOrMobile ? "100%" : "70%"}
                style={{ overflowY: "auto" }}
                gap="small"
              >
                <Box style={{ flexShrink: "0" }}>
                  <Text size="small" weight="bold">
                    Area of Expertise
                  </Text>
                  {x.category.map((cat) => (
                    <Text key={cat.id} size="xsmall">
                      • {cat.name}
                    </Text>
                  ))}
                </Box>
                <Box style={{ flexShrink: "0" }}>
                  <Text size="small" weight="bold">
                    Overview
                  </Text>
                  <Text size="small">{x.about}</Text>
                </Box>
                <Box style={{ flexShrink: "0" }}>
                  <Text size="small" weight="bold">
                    What I’m excited to bring to Fitcy Health members
                  </Text>
                  <Text size="small">{x.value_to_fitcy}</Text>
                </Box>
              </Box>
              <Box
                pad="small"
                width={isTabletOrMobile ? "100%" : "30%"}
                gap="small"
              >
                {x.dv && !isTabletOrMobile ? (
                  <Box
                    round="small"
                    style={{ border: "2px solid  rgba(0, 150, 136, 1)" }}
                  >
                    <Video
                      fit="cover"
                      style={{ borderRadius: "8px" }}
                      controls={false}
                      autoPlay={true}
                    >
                      <source key="video" src={x.dv} type="video/mp4" />
                    </Video>
                  </Box>
                ) : null}

                <button
                  onClick={() => goToNextStep(x.id)}
                  className="primary-btn"
                >
                  Book now
                </button>
              </Box>
            </Box>
            {/* {JSON.stringify(x)} */}
          </Box>
        </Layer>
      )}
      <Box>
        <div key={x.id} className="box-row therapist-profile">
          <div>
            <img
              src={x.dp ? x.dp : noAvatar}
              style={{
                borderRadius: "8px",
                height: isTabletOrMobile ? "100px" : "180px",
                width: isTabletOrMobile ? "100px" : "180px",

                border: "2px solid #009688",
                objectFit: "cover",
              }}
            />{" "}
          </div>
          <div className="box-column">
            <div
              className="box-row"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div className="box-column-nogap">
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "large",
                    marginBottom: "5px",
                  }}
                >
                  {x.first_name} {x.last_name}
                </div>
                <div>{x.designation}</div>
              </div>
              <div className="box-row">
                {/* <div className="ratingtag"> <img src={starRating} /> <div><b>4.5</b> {isTabletOrMobile ? null : "Rating"} </div></div> */}
                {x.achievement === "MOST_POPULAR" ? (
                  <div className="populartag">
                    {" "}
                    <img src={sheildPopular} />
                    <Text size="xsmall">Most Popular</Text>
                  </div>
                ) : null}
                {x.achievement === "RISING_TALENT" ? (
                  <div className="populartag">
                    {" "}
                    <img src={sheildPopular} />
                    <Text size="xsmall">Rising Talent</Text>
                  </div>
                ) : null}
              </div>
            </div>
            <Box>
              {x.category.map(
                (cat, index) =>
                  `${cat.name}${index + 1 === x.category.length ? "" : ", "}`
              )}
            </Box>
            <div className="box-row">
              <button
                onClick={() => goToNextStep(x.id)}
                className="primary-btn"
              >
                Book now
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="plain-btn"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Grommet>
  );
};

export default RecommendedTherapist;

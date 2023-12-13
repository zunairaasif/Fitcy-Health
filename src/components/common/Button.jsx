import React, { useRef } from "react";
import styled from "styled-components";
import { useButton } from "@react-aria/button";
import { mergeProps } from "@react-aria/utils";

const StyledButton = styled.button`
  appearance: none;
  border: none;
  background: #f8f8f8;
  color: black;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

export function Button(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);
  return (
    <StyledButton {...mergeProps(buttonProps)} ref={ref}>
      {props.children}
    </StyledButton>
  );
}

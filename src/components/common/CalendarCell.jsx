import React, { useRef } from "react";
import styled from "styled-components";
import { useCalendarCell } from "@react-aria/calendar";
import { useDateFormatter } from "@react-aria/i18n";
import { mergeProps } from "@react-aria/utils";
// import { useMediaQuery } from "react-responsive";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 35px;
  width: 35px;
  border-radius: 100%;
  background: ${(props) => (props.isSelected ? "#009688" : "#F8F8F8")};
  color: ${(props) => (props.isSelected ? "white" : "")};
  outline: none;
  pointer-events: ${(props) => (props.disabled ? "none" : null)};
  position: relative;

  &:after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 100%;
  }
`;

export function CalendarCell(props) {
  let ref = useRef();
  let { cellProps, buttonProps } = useCalendarCell(props, props.state, ref);

  let dateFormatter = useDateFormatter({
    day: "numeric",
    timeZone: props.state.timeZone,
    calendar: props.date.calendar.identifier,
  });
  let isSelected = props.state.isSelected(props.date);
  const today = new Date();
  const yesterday = today.setDate(today.getDate() - 1);

  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <td
      {...cellProps}
      style={{
        paddingTop: "15px",
        // paddingLeft: !isTabletOrMobile ? "18px" : "8px",
      }}
    >
      <Button
        ref={ref}
        {...mergeProps(buttonProps)}
        isSelected={isSelected}
        disabled={props.date.toDate() < yesterday}
        defaultValue={props.defaultValue}
        minValue={props.minValue}
        onClick={props.onClick}
      >
        {dateFormatter.format(props.date.toDate(props.state.timeZone))}
      </Button>
    </td>
  );
}

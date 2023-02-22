import React from "react";
import { render, cleanup } from "@testing-library/react";
import CommentBubble from "./CommentBubble";

afterEach(cleanup);

test("renders without crashing", () => {
  const { getByText } = render(
    <CommentBubble text="text" userName="userName" />
  );

  expect(getByText("text")).toBeTruthy();
  expect(getByText("userName")).toBeTruthy();
});

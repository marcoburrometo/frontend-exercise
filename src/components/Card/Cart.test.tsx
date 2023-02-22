import React from "react";
import { render, cleanup } from "@testing-library/react";
import Card from "./Card";

afterEach(cleanup);

test("renders without crashing", () => {
  const { getByText } = render(
    <Card>
      <h1>Test</h1>
    </Card>
  );

  expect(getByText("Test")).toBeTruthy();
});

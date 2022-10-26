import { expect, it } from "vitest";
import Header from "../components/Header";

it("Header JSX", () => {
  const result = Header(Header);
  expect(result).toMatchSnapshot();
});

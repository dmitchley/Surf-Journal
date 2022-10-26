import { expect, test } from "vitest";
import { journals, url } from "../pages/Journal";
// comparing the data and url and if its is equal the api is working.
test("Test API", async () => {
  await url;
  expect(url).toEqual(journals);
});

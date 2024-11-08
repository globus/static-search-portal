import React from "react";
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { render } from "../../../test-utils";

import GlobusEmbedField from "../../../src/components/Fields/GlobusEmbedField";

describe("GlobusEmbedField", () => {
  it("supports basic rendering", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(new Blob()),
      headers: {
        get: jest.fn().mockReturnValue("image/jpeg"),
      },
    });
    global.URL.createObjectURL = jest
      .fn()
      .mockReturnValue("https://example.jpg");
    const { getByText, container } = render(
      <GlobusEmbedField
        field={{
          derivedValue: "https://example.jpg",
          options: {
            collection: "abc",
          },
        }}
      />,
    );
    await waitForElementToBeRemoved(getByText("Loading..."));
    await waitFor(() => {
      const srcdoc = container.querySelector("iframe")?.getAttribute("srcdoc");
      expect(srcdoc).toContain('data="https://example.jpg"');
      expect(srcdoc).toContain('type="image/jpeg"');
    });
  });

  it("supports options", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(new Blob()),
      headers: {
        get: jest.fn().mockReturnValue("image/jpeg"),
      },
    });
    global.URL.createObjectURL = jest
      .fn()
      .mockReturnValue("https://example.jpg");
    const { getByText, container } = render(
      <GlobusEmbedField
        field={{
          derivedValue: "https://example.jpg",
          options: {
            collection: "abc",
            height: "10px",
            width: "10px",
            mime: "image/png",
          },
        }}
      />,
    );
    await waitForElementToBeRemoved(getByText("Loading..."));
    await waitFor(() => {
      const srcdoc = container.querySelector("iframe")?.getAttribute("srcdoc");
      expect(srcdoc).toContain('data="https://example.jpg"');
      expect(srcdoc).toContain('type="image/png"');
      expect(srcdoc).toContain('width="10px"');
      expect(srcdoc).toContain('height="10px"');
    });
  });
});

import React from "react";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { githubDarkTheme } from "@uiw/react-json-view/githubDark";
import { useMantineColorScheme, Code } from "@mantine/core";

export const JSONTree = ({ data }: { data: unknown }) => {
  const { colorScheme } = useMantineColorScheme();
  return typeof data === "object" && data !== null ? (
    <JsonView
      value={data}
      style={colorScheme === "dark" ? githubDarkTheme : githubLightTheme}
    />
  ) : (
    <Code
      maw="100%"
      style={{
        overflow: "scroll",
      }}
      block
    >
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};

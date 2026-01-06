import React from "react";
import { Code, Text, Tooltip } from "@mantine/core";

import { useCollection } from "@/hooks/useGlobusAPI";

export function CollectionName({ id }: { id: string }) {
  const { data } = useCollection(id);
  return (
    <>
      {data?.display_name ?? (
        <Text>
          Collection{" "}
          <Tooltip label={id}>
            <Code
              style={{
                textDecoration: "underline",
                textDecorationStyle: "dashed",
              }}
            >
              {id.slice(0, 8)}
            </Code>
          </Tooltip>
        </Text>
      )}
    </>
  );
}

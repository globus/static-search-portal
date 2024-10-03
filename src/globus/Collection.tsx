import React from "react";
import { Code, Text, Tooltip } from "@chakra-ui/react";

import { useCollection } from "@/hooks/useTransfer";

export function CollectionName({ id }: { id: string }) {
  const { data } = useCollection(id);
  return (
    <>
      {data?.display_name ?? (
        <Text>
          Collection{" "}
          <Tooltip label={id}>
            <Code textDecoration="underline" textDecorationStyle="dashed">
              {id.slice(0, 8)}
            </Code>
          </Tooltip>
        </Text>
      )}
    </>
  );
}

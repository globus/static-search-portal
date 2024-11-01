import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonProps, Link } from "@chakra-ui/react";

import { useGlobusTransferStore } from "@/store/globus-transfer";
import { getTransferDetailsFromResult } from "./Result";

import { getValueFromAttribute, isTransferEnabled } from "../../static";

import type { GMetaResult } from "@globus/sdk/services/search/service/query";
import { useGlobusAuth } from "@globus/react-auth-context";

export default function AddToTransferList({
  result,
  ...rest
}: {
  result: GMetaResult;
} & ButtonProps) {
  const auth = useGlobusAuth();
  const items = useGlobusTransferStore((state) => state.items);
  const addTransferItem = useGlobusTransferStore((state) => state.addItem);
  const removeItemBySubject = useGlobusTransferStore(
    (state) => state.removeItemBySubject,
  );

  const [itemLabel, setItemLabel] = useState<string>();

  const isSelected = useMemo(() => {
    return items.some((item) => item.subject === result.subject);
  }, [result.subject, items]);

  useEffect(() => {
    async function bootstrap() {
      const heading = await getValueFromAttribute<string>(
        result,
        "components.Result.heading",
      );
      setItemLabel(heading);
    }
    bootstrap();
  }, [result]);

  return (
    isTransferEnabled &&
    auth.isAuthenticated && (
      <Button
        as={Link}
        size="sm"
        onClick={
          !isSelected
            ? async () => {
                const { collection, path, type } =
                  await getTransferDetailsFromResult(result);

                addTransferItem({
                  label: itemLabel || result.subject,
                  subject: result.subject,
                  collection,
                  path,
                  type,
                });
              }
            : () => removeItemBySubject(result.subject)
        }
        {...rest}
      >
        {isSelected ? "Remove from Transfer List" : "Add to Transfer List"}
      </Button>
    )
  );
}

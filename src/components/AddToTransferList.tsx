import { useEffect, useMemo, useState } from "react";
import { Button, ButtonProps } from "@mantine/core";

import { useGlobusTransferStore } from "@/store/globus-transfer";
import { getTransferDetailsFromResult } from "./Result";

import { getValueFrom, isTransferEnabled, getStatic } from "../../static-lib";

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
      const heading = await getValueFrom<string>(
        result,
        getStatic().data.attributes.components.Result.heading,
      );
      setItemLabel(heading);
    }
    bootstrap();
  }, [result]);

  return isTransferEnabled() && auth.isAuthenticated ? (
    <Button
      size="xs"
      variant="subtle"
      onClick={
        !isSelected
          ? async () => {
              if (!result.subject) return;

              const { collection, path, type } =
                await getTransferDetailsFromResult(result);

              if (!collection || !path || !type) {
                return;
              }

              addTransferItem({
                label: itemLabel || result.subject,
                subject: result.subject,
                collection,
                path,
                type,
              });
            }
          : () => {
              if (!result.subject) return;
              removeItemBySubject(result.subject);
            }
      }
      {...rest}
    >
      {isSelected ? "Remove from Transfer List" : "Add to Transfer List"}
    </Button>
  ) : null;
}

import React from "react";
import { Alert } from "@mantine/core";
import { JSONTree } from "./JSONTree";

import type { GError } from "@/globus/search";

export const Error = ({ error }: { error: GError }) => {
  return (
    <Alert color="red" title="Error Encountered">
      {error.message}
      {error.error_data && <JSONTree data={error} />}
    </Alert>
  );
};

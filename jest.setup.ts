import "@testing-library/jest-dom";

import { setConfig } from "next/config";
import config from "./next.config.mjs";
setConfig({
  publicRuntimeConfig: config.publicRuntimeConfig,
});

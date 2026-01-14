import _STATIC from "./static.json" with { type: "json" };
import { StaticSchema } from "@from-static/generator-kit/schemas/static";

import type { NextConfig } from "next";

import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.(md|mdx)$/,
});

const STATIC = StaticSchema.parse(_STATIC);

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /**
   * If the `static.json` file contains a `host` object, use the `base_path` value
   * as the `basePath` for the Next.js application.
   */
  basePath: STATIC._static.host?.base_path || undefined,
  images: {
    unoptimized: true,
  },
  env: {
    BASE_PATH: STATIC._static.host?.base_path || "",
  },
};

export default withMDX(nextConfig);

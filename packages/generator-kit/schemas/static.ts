import { z } from "zod";

/**
 * The general schema of `static.json` configuration objects.
 * This can be shared across all generators and then extended by overriding `data` to reflect generator-specific options.
 */
export const StaticSchema = z.object({
  _static: z.object({
    generator: z.object({
      name: z.string(),
    }),
    host: z
      .object({
        base_url: z.string(),
        origin: z.string(),
        host: z.string(),
        base_path: z.string(),
      })
      .optional(),
  }),
  data: z.object({
    /**
     * The version of the `data` object, which is used to determine how
     * the generator will render its `attributes`.
     * @example "1.0.0"
     */
    version: z.string(),
    attributes: z.object(),
  }),
});

export type StaticConfiguration = z.infer<typeof StaticSchema>;

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
    attributes: z.object({
      /**
       * The `features` object is the recommended place to provided feature flags for the generator.
       * @example { "authentication": true }
       */
      features: z.record(z.string(), z.boolean()).optional(),
      /**
       * The `theme` object is the recommended place to provide theme configuration for the generator.
       */
      theme: z.object({}).optional(),
      /**
       * General content that can be used throughout the generator.
       * @example { "title": "My Generator" }
       */
      content: z.record(z.string(), z.any()).optional(),
      /**
       * Component-specific configurations used to customize the behavior of individual components.
       * @example { "Result": { "heading": "subject" }}
       */
      components: z
        .record(z.string(), z.record(z.string(), z.any()))
        .optional(),
    }),
  }),
});

export type StaticConfiguration = z.infer<typeof StaticSchema>;

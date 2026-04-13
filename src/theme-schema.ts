import { z } from "zod";

const ColorsSchema = z.union([
  z.object({
    50: z.string(),
    100: z.string(),
    200: z.string(),
    300: z.string(),
    400: z.string(),
    500: z.string(),
    600: z.string(),
    700: z.string(),
    800: z.string(),
    900: z.string(),
  }),
  z.string(),
]);

export const ThemeSchema = z.object({
  /**
   * Apply a default color scheme to all components.
   * This supports all Chakra UI color schemes and is not provided by default.
   * @see https://v2.chakra-ui.com/docs/styled-system/theme#colors for available color schemes.
   */
  colorScheme: z.string().optional(),
  /**
   * Specific color definitions to use in the theme.
   * The most common use case is to define a `primary` color.
   * @example
   * ```json
   * {
   *   "colors": {
   *     "primary": {
   *      "50": "#E5F2FF",
   *      "100": "#B8DBFF",
   *      "200": "#8AC4FF",
   *      "300": "#5CADFF",
   *      "400": "#2E96FF",
   *      "500": "#007FFF",
   *      "600": "#0066CC",
   *      "700": "#004C99",
   *      "800": "#00264C",
   *      "900": "#001933"
   *   }
   *  }
   * }
   * ```
   * @see https://v2.chakra-ui.com/docs/styled-system/theme#colors
   */
  colors: z.record(z.string(), ColorsSchema).optional(),
  /**
   * Extend the Chakra UI theme.
   * @see https://v2.chakra-ui.com/docs/styled-system/customize-theme#using-theme-extensions
   */
  extendTheme: z.unknown().optional(),
});

export type ThemeSettings = z.infer<typeof ThemeSchema>;

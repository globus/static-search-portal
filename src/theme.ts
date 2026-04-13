import { createTheme, virtualColor } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";
import { getStatic } from "@from-static/generator-kit";

const s = getStatic();

const PRIMARY_COLOR =
  s.data.attributes.theme?.colors?.brand?.[500] ||
  s.data.attributes.theme?.colors?.primary?.[500] ||
  "#007FFF";

const SECONDARY_COLOR =
  s.data.attributes.theme?.colors?.secondary?.[500] || "#718096";

export default createTheme({
  colors: {
    "primary.light": generateColors(PRIMARY_COLOR),
    "primary.dark": generateColors(PRIMARY_COLOR),
    "secondary.light": generateColors(SECONDARY_COLOR),
    "secondary.dark": generateColors(SECONDARY_COLOR),
    primary: virtualColor({
      name: "primary",
      dark: "primary.dark",
      light: "primary.light",
    }),
    secondary: virtualColor({
      name: "secondary",
      dark: "secondary.dark",
      light: "secondary.light",
    }),
  },
});

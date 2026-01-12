import { Group, Box, Code } from "@mantine/core";

type Value = (string | number)[];

function isValidValue(value: unknown): value is Value {
  return Array.isArray(value) && value.length >= 3;
}

/**
 * Render a field as an RGBA color.
 */
export default function RgbaField({
  value,
  size = "sm",
}: {
  value: unknown;
  size?: "sm" | "lg";
}) {
  if (!isValidValue(value)) {
    return;
  }

  const props = {
    h: size === "sm" ? "2.5rem" : "5rem",
    w: size === "sm" ? "2.5rem" : "5rem",
  };

  return (
    <Group>
      <Box bg={`rgba(${value.join(",")})`} {...props} />
      <Code>
        R:{value[0]} G:{value[1]} B:{value[2]} {value[3] && `A: ${value[3]}`}
      </Code>
    </Group>
  );
}

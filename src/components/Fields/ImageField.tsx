import React, { useState } from "react";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Group,
  Text,
  Stack,
  Center,
  Code,
  Loader,
  Alert,
  Paper,
  Button,
  Modal,
  Image as MantineImage,
} from "@mantine/core";
import { AnchorExternal } from "../private/AnchorExternal";

type Value =
  | string
  | {
      src: string;
      alt?: string;
    };

function isValidValue(value: unknown): value is Value {
  return (
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "src" in value)
  );
}

/**
 * Render a field as an image.
 */
export default function ImageField({ value }: { value: unknown }) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  if (!isValidValue(value)) {
    return;
  }

  const config = typeof value === "string" ? { src: value } : value;

  return (
    <>
      <Paper p="sm">
        <Group gap="xs" wrap="nowrap">
          <Box h="6rem" w="12rem" pos="relative">
            {loading && (
              <Center
                style={{
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  height: "100%",
                  width: "100%",
                }}
              >
                <Loader size="xs" />
              </Center>
            )}
            {error && (
              <Alert
                color="red"
                style={{
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  height: "100%",
                  width: "100%",
                }}
              >
                Unable to load image.
              </Alert>
            )}
            {!error && (
              <Image
                fill
                src={config.src}
                alt={config.alt ?? ""}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                style={{ objectFit: "contain" }}
              />
            )}
          </Box>
          <Stack gap="xs">
            <Code
              fz="xs"
              style={{
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-word",
                userSelect: "all",
              }}
            >
              {config.src}
            </Code>
            <Group gap="xs">
              {!error && (
                <Button onClick={open} size="xs" variant="outline">
                  View Image
                </Button>
              )}
              <AnchorExternal href={config.src} size="xs">
                Open in New Tab
              </AnchorExternal>
            </Group>
          </Stack>
        </Group>
      </Paper>
      <Modal opened={opened} onClose={close} centered size="auto">
        <Stack>
          <Paper>
            <Center>
              <MantineImage
                src={config.src}
                alt={config.alt ?? ""}
                w="auto"
                fit="contain"
              />
            </Center>
          </Paper>
        </Stack>
      </Modal>
    </>
  );
}

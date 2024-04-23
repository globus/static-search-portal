import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Image as ChakraImage,
  Code,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  if (!isValidValue(value)) {
    return;
  }

  const config = typeof value === "string" ? { src: value } : value;

  return (
    <>
      <Box>
        {loading && (
          <HStack>
            <Spinner emptyColor="gray.200" color="blue.500" />
            <Text>Loading image...</Text>
          </HStack>
        )}
        {error && (
          <Code fontSize="xs" variant="outline" colorScheme="orange">
            Unable to load image.
          </Code>
        )}
        {!error && (
          <Image
            height={200}
            width={200}
            src={config.src}
            alt={config.alt ?? ""}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onClick={onOpen}
            style={{ cursor: "pointer" }}
          />
        )}
      </Box>
      <Modal onClose={onClose} isOpen={isOpen} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ChakraImage
              src={config.src}
              alt={config.alt ?? ""}
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

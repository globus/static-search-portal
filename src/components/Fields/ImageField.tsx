import React, { useState } from "react";
import Image from "next/image";
import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Image as ChakraImage,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "@chakra-ui/icons";

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
      <Card variant="outline">
        <CardBody>
          <HStack>
            <HStack>
              <Box height="5rem" width="5rem" pos="relative">
                {loading && (
                  <AbsoluteCenter>
                    <Spinner emptyColor="gray.200" color="primary.500" />
                  </AbsoluteCenter>
                )}
                {error && (
                  <AbsoluteCenter>
                    <Text
                      fontSize="xs"
                      backgroundColor="red.100"
                      textColor="red.900"
                      p={2}
                    >
                      Unable to load image.
                    </Text>
                  </AbsoluteCenter>
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
              <Box m={2}>
                <Text
                  fontSize="sm"
                  userSelect="all"
                  sx={{
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {config.src}
                </Text>
                <ButtonGroup>
                  {!error && (
                    <Button onClick={onOpen} size="xs">
                      View Image
                    </Button>
                  )}
                  <Button
                    as={Link}
                    variant="link"
                    size="xs"
                    href={config.src}
                    isExternal
                  >
                    Open in New Tab <ExternalLinkIcon mx="2px" />
                  </Button>
                </ButtonGroup>
              </Box>
            </HStack>
          </HStack>
        </CardBody>
      </Card>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent maxW="90vw">
          <ModalCloseButton />
          <ModalHeader />
          <ModalBody>
            <VStack>
              <Box rounded={8} backgroundColor="gray.50" w="100%" p={4}>
                <Center>
                  <ChakraImage
                    src={config.src}
                    alt={config.alt ?? ""}
                    objectFit="contain"
                  />
                </Center>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

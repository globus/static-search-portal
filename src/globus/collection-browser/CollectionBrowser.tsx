import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  List,
  ListItem,
  Card,
  CardHeader,
  Stack,
  CardBody,
  Text,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { transfer } from "@globus/sdk/cjs";

import { useGlobusAuth } from "../globus-auth-context/useGlobusAuth";

type Endpoint = Record<string, any>;

export function CollectionSearch({
  onSelect = () => {},
}: {
  onSelect: (endpoint: Endpoint) => void;
}) {
  const auth = useGlobusAuth();
  const [results, setResults] = useState<Endpoint[]>([]);
  const [selection, setSelection] = useState<Endpoint | null>(null);

  async function handleSearch(e: React.FormEvent<HTMLInputElement>) {
    const query = e.currentTarget.value;
    if (!query) {
      setResults([]);
      return;
    }

    const response = await transfer.endpointSearch(
      {
        query: {
          filter_fulltext: query,
          limit: 20,
        },
      },
      { manager: auth.authorization },
    );
    if (!response.ok) {
      console.error("Error searching for endpoints:", response);
      return;
    }
    const data = await response.json();
    setResults(data.DATA);
  }

  function handleSelect(endpoint: Endpoint) {
    setSelection(endpoint);
    onSelect(endpoint);
  }

  if (selection) {
    return (
      <InputGroup>
        <Input value={selection.display_name || selection.name} readOnly />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => setSelection(null)}>
            Clear
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  }

  return (
    <Stack>
      <Box position="sticky" top="0" zIndex={1} bgColor="white">
        <InputGroup>
          <Input
            onInput={(e) => handleSearch(e)}
            placeholder="e.g. Globus Tutorial Collection"
          />
          <InputRightAddon>
            <Icon as={MagnifyingGlassIcon} />
          </InputRightAddon>
        </InputGroup>
      </Box>
      <Stack maxH="400px" overflowY="auto">
        {results.map((result) => (
          <Card
            size="sm"
            variant="outline"
            key={result.id}
            onClick={() => handleSelect(result)}
            _hover={{ cursor: "pointer", borderColor: "blue.500" }}
          >
            <CardHeader pb={0}>
              <Text>{result.display_name || result.name}</Text>
              <Text fontSize="xs">{result.entity_type}</Text>
            </CardHeader>
            <CardBody>
              <List>
                <Text fontSize="xs">
                  <ListItem>ID: {result.id}</ListItem>
                  <ListItem>Owner: {result.owner_id}</ListItem>
                  <ListItem>Domain: {result.domain || "\u2014"}</ListItem>
                  <ListItem>
                    <Text noOfLines={1}>
                      Description: {result.description || "\u2014"}
                    </Text>
                  </ListItem>
                </Text>
              </List>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

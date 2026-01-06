import React, { useEffect, useState } from "react";
import {
  Box,
  TextInput,
  Button,
  Text,
  Stack,
  List,
  Paper,
} from "@mantine/core";
import { Search } from "lucide-react";
import { transfer } from "@globus/sdk";

import { useGlobusAuth } from "@globus/react-auth-context";

export type Endpoint = Record<string, any>;

/**
 * @todo REPLACE WITH COLLECTION SEARCH
 */
export function CollectionSearch({
  value = null,
  onSelect = () => {},
}: {
  value?: Endpoint | null;
  onSelect: (endpoint: Endpoint) => void;
}) {
  const auth = useGlobusAuth();
  const [results, setResults] = useState<Endpoint[]>([]);
  const [selection, setSelection] = useState(value);

  useEffect(() => {
    setSelection(value);
    if (value === null) {
      setResults([]);
    }
  }, [value]);

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
      <TextInput
        label="Collection"
        value={selection.display_name || selection.name}
        readOnly
        style={{ flex: 1 }}
        rightSectionWidth={80}
        rightSection={
          <Button size="xs" variant="subtle" onClick={() => setSelection(null)}>
            Clear
          </Button>
        }
      />
    );
  }

  return (
    <Stack>
      <Box
        style={{ position: "sticky", top: 0, zIndex: 1, background: "white" }}
      >
        <TextInput
          label="Collection"
          onInput={(e) => handleSearch(e as React.FormEvent<HTMLInputElement>)}
          placeholder="e.g. Globus Tutorial Collection"
          style={{ flex: 1 }}
          rightSection={<Search width={16} height={16} />}
        />
      </Box>
      <Stack style={{ maxHeight: 400, overflowY: "auto" }}>
        {results.map((result) => (
          <Paper
            key={result.id}
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect(result)}
            p="xs"
          >
            <Stack gap="xs">
              <Text>{result.display_name || result.name}</Text>
              <List listStyleType="none" size="xs">
                <List.Item>ID: {result.id}</List.Item>
                <List.Item>Type: {result.entity_type}</List.Item>
                <List.Item>Owner: {result.owner_id}</List.Item>
                <List.Item>Domain: {result.domain || "\u2014"}</List.Item>
                <List.Item>
                  Description: {result.description || "\u2014"}
                </List.Item>
              </List>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

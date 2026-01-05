import React, { useEffect, useState } from "react";
import {
  Box,
  TextInput,
  Button,
  Card,
  Text,
  Stack,
  Group,
  List,
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
      <Group>
        <TextInput
          value={selection.display_name || selection.name}
          readOnly
          style={{ flex: 1 }}
        />
        <Button size="xs" variant="outline" onClick={() => setSelection(null)}>
          Clear
        </Button>
      </Group>
    );
  }

  return (
    <Stack>
      <Box
        style={{ position: "sticky", top: 0, zIndex: 1, background: "white" }}
      >
        <TextInput
          onInput={(e) => handleSearch(e as React.FormEvent<HTMLInputElement>)}
          placeholder="e.g. Globus Tutorial Collection"
          style={{ flex: 1 }}
          rightSection={<Search width={16} height={16} />}
        />
      </Box>
      <Stack style={{ maxHeight: 400, overflowY: "auto" }}>
        {results.map((result) => (
          <Card
            key={result.id}
            shadow="xs"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect(result)}
          >
            <Group>
              <Text>{result.display_name || result.name}</Text>
              <Text size="xs">{result.entity_type}</Text>
            </Group>
            <List size="xs" style={{ marginTop: 5 }}>
              <li>ID: {result.id}</li>
              <li>Owner: {result.owner_id}</li>
              <li>Domain: {result.domain || "\u2014"}</li>
              <li>
                <Text>Description: {result.description || "\u2014"}</Text>
              </li>
            </List>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

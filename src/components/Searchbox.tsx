import { Group, Button, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";

export function Searchbox() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (
    event: React.FormEvent<
      HTMLFormElement & {
        readonly elements: {
          q: HTMLInputElement;
        };
      }
    >,
  ) => {
    const target = event.currentTarget.elements;
    event.preventDefault();
    router.push({
      pathname: "/search",
      query: { q: target.q.value },
    });
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="sm" align="center">
        <TextInput
          ref={inputRef}
          placeholder="Start your search here..."
          type="search"
          name="q"
          autoFocus
          size="md"
          flex={1}
        />
        <Button size="md" type="submit" my={2}>
          Search
        </Button>
      </Group>
    </form>
  );
}

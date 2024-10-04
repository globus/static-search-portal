import { InputGroup, Input, Button, HStack } from "@chakra-ui/react";
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
      <HStack>
        <InputGroup>
          <Input
            size="lg"
            ref={inputRef}
            placeholder="Start your search here..."
            type="search"
            name="q"
            autoFocus
          />
        </InputGroup>
        <Button size="lg" type="submit" my={2}>
          Search
        </Button>
      </HStack>
    </form>
  );
}

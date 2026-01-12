import { Button, Text, Group, Flex, Select } from "@mantine/core";
import { ChevronRight, ChevronLeft, ChevronsLeft } from "lucide-react";
import { Icon } from "./private/Icon";
import type { GSearchResult } from "@globus/sdk/services/search/service/query";
import { useSearchActions, useSearchContext } from "@/store/search";

export const Pagination = ({ result }: { result?: GSearchResult }) => {
  const search = useSearchContext();
  const actions = useSearchActions();

  if (!result) {
    return null;
  }

  const start = search.offset > 0 ? search.offset : 1;
  const end = Math.min(search.offset + search.limit, result.total);

  return (
    <Flex justify="space-between" align="center">
      <Group gap="xs">
        <Text fz="xs" component="label" htmlFor="limit">
          Results per page:
        </Text>
        <Select
          id="limit"
          size="xs"
          defaultValue={`${search.limit}`}
          onChange={(value) => {
            actions.setLimit(value ? parseInt(value) : 25);
          }}
          data={[
            { value: "10", label: "10" },
            { value: "25", label: "25" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },
          ]}
        />
      </Group>

      <Group>
        {result.total > 0 ? (
          <Text fz="xs">
            <Text fw={700} fz="xs" span>
              {start}-{end}
            </Text>{" "}
            of{" "}
            <Text fw={700} fz="xs" span>
              {result.total}
            </Text>
          </Text>
        ) : null}
        <Button.Group>
          <Button
            variant="default"
            size="xs"
            disabled={search.offset === 0}
            onClick={() => {
              actions.setOffset(0);
            }}
          >
            <Icon component={ChevronsLeft} />
          </Button>
          <Button
            variant="default"
            size="xs"
            disabled={search.offset === 0}
            onClick={() => {
              actions.setOffset(search.offset - search.limit);
            }}
          >
            <Icon component={ChevronLeft} />
          </Button>
          <Button
            variant="default"
            size="xs"
            disabled={
              !result.total || search.offset + search.limit >= result.total
            }
            onClick={() => {
              actions.setOffset(search.offset + search.limit);
            }}
          >
            <Icon component={ChevronRight} />
          </Button>
        </Button.Group>
      </Group>
    </Flex>
  );
};

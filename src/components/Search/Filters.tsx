import { useSearchActions } from "@/store/search";
import { useStatic } from "@from-static/generator-kit/react/StaticProvider";
import {
  RangeSlider as MantineRangeSlider,
  TagsInput,
  Text,
  Stack,
  InputWrapper,
  Group,
} from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useCallback, useMemo, useState } from "react";
import z from "zod";
import { FilterComponentSchema } from "./schemas";

type FilterComponentProps = z.infer<typeof FilterComponentSchema>;

function TagBasedFilter({ ui, field_name, type }: FilterComponentProps) {
  const actions = useSearchActions();
  const onChange = useCallback(
    (values) => {
      actions.setFilter({
        field_name,
        type,
        values,
      });
    },
    [actions, field_name, type],
  );
  return (
    <TagsInput
      label={ui?.label || field_name}
      description={ui?.description}
      onChange={onChange}
    />
  );
}

function RangeSlider({ ui, field_name }: FilterComponentProps) {
  const actions = useSearchActions();
  const { label, description, type: _uiType, ...componentProps } = ui || {};
  const onChange = useCallback(
    ([gte, lte]: [number, number]) => {
      actions.setFilter({
        field_name,
        type: "range",
        values: [
          {
            gte: `${gte}`,
            lte: `${lte}`,
          },
        ],
      });
    },
    [actions, field_name],
  );
  console.log(ui);
  return (
    <InputWrapper label={label ?? field_name} description={description}>
      <MantineRangeSlider {...componentProps} onChangeEnd={onChange} />
    </InputWrapper>
  );
}

function DateRange({ ui, field_name, type }: FilterComponentProps) {
  const actions = useSearchActions();
  const { label, type: _uiType, ...componentProps } = ui || {};
  const onChange = useCallback(
    ([from, to]: [string, string]) => {
      actions.setFilter({
        field_name,
        type: "range",
        values: [
          {
            from,
            to,
          },
        ],
      });
    },
    [actions, field_name],
  );
  return (
    <DatePickerInput
      type="range"
      label={label ?? field_name}
      placeholder="Select date range"
      clearable
      onChange={onChange}
      {...componentProps}
    />
  );
}

function DateTimeRange({ ui, field_name, type }: FilterComponentProps) {
  const actions = useSearchActions();
  const { label, type: _uiType, ...componentProps } = ui || {};

  const onChange = useCallback(
    ([from, to]: [string, string]) => {
      actions.setFilter({
        field_name,
        type: "range",
        values: [
          {
            from,
            to,
          },
        ],
      });
    },
    [actions, field_name],
  );

  return (
    <Group grow>
      <DateTimePicker
        label="From"
        onChange={(value) => onChange([value?.toISOString() || "", ""])}
      />
      <DateTimePicker
        label="To"
        onChange={(value) => onChange(["", value?.toISOString() || ""])}
      />
    </Group>
  );
}

function RangeFilter(props: FilterComponentProps) {
  return props?.ui?.type === "date" ? (
    <DateRange {...props} />
  ) : props?.ui?.type === "datetime" ? (
    <DateTimeRange {...props} />
  ) : (
    <RangeSlider {...props} />
  );
}

function ExistsFilter(props: FilterComponentProps) {
  return <Text>Exists filter for {props.field_name}</Text>;
}

function LikeFilter(props: FilterComponentProps) {
  return <Text>Like filter for {props.field_name}</Text>;
}

const COMPONENTS: Record<
  FilterComponentProps["type"],
  React.ComponentType<FilterComponentProps>
> = {
  match_any: TagBasedFilter,
  match_all: TagBasedFilter,
  range: RangeFilter,
  exists: ExistsFilter,
  like: LikeFilter,
};

/**
 * Render a filter component based on the provided filter configuration.
 */
function Filter(props: FilterComponentProps) {
  const Component = COMPONENTS[props.type];
  if (!Component) {
    return null;
  }
  return <Component {...props} />;
}

export function Filters() {
  const s = useStatic();
  const filters = s.state.config.data.attributes.globus.search.filters || [];

  const children = useMemo(() => {
    return filters.map((filter, index) => <Filter key={index} {...filter} />);
  }, [filters]);

  return children.length > 0 ? children : null;
}

import { useCallback, useEffect, useMemo, useState } from "react";
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
import z from "zod";
import { FilterComponentSchema } from "./schemas";
import dayjs from "dayjs";

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
      presets={[
        {
          value: [
            dayjs().subtract(60, "day").format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD"),
          ],
          label: "Last 60 days",
        },
        {
          value: [
            dayjs().subtract(30, "day").format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD"),
          ],
          label: "Last 30 days",
        },
        {
          value: [
            dayjs().subtract(7, "day").format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD"),
          ],
          label: "Last 7 days",
        },
      ]}
      {...componentProps}
    />
  );
}

function DateTimeRange({ ui, field_name, type }: FilterComponentProps) {
  const actions = useSearchActions();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const { label, type: _uiType, ...componentProps } = ui || {};

  useEffect(() => {
    const values = from || to ? [{ from: from ?? "*", to: to ?? "*" }] : [];

    actions.setFilter({
      field_name,
      type: "range",
      values,
    });
  }, [actions, field_name, from, to]);

  const presets = [
    {
      value: dayjs().subtract(60, "day").format("YYYY-MM-DD HH:mm:ss"),
      label: "60 days ago",
    },
    {
      value: dayjs().subtract(30, "day").format("YYYY-MM-DD HH:mm:ss"),
      label: "30 days ago",
    },
    {
      value: dayjs().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
      label: "Last month",
    },
    {
      value: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
      label: "Yesterday",
    },
    {
      value: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      label: "Now",
    },
  ];

  return (
    <InputWrapper label={label ?? field_name} description={ui?.description}>
      <Group grow mx="xs">
        <DateTimePicker
          valueFormat="YYYY-MM-DD HH:mm:ss"
          size="xs"
          label="From"
          name="from"
          onChange={setFrom}
          maxDate={to ?? undefined}
          defaultDate={to ?? undefined}
          clearable
          presets={presets}
        />
        <DateTimePicker
          valueFormat="YYYY-MM-DD HH:mm:ss"
          size="xs"
          label="To"
          name="to"
          defaultDate={from ?? undefined}
          onChange={setTo}
          minDate={from ?? undefined}
          clearable
          presets={presets}
        />
      </Group>
    </InputWrapper>
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

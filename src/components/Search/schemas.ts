import { file, z } from "zod";

/**
 * Client-side schema for filters, this is used to determine what type of input to render for a given filter.
 */
const ValueTypes = z.enum(["string", "number", "date"]);

const MatchAllFilter = z.object({
  type: z.literal("match_all"),
  field_name: z.string(),
  values: z.array(z.union([z.string(), z.boolean()])),
});

const MatchAnyFilter = z.object({
  type: z.literal("match_any"),
  field_name: z.string(),
  values: z.array(z.union([z.string(), z.number(), z.boolean()])),
});

const GMatchFilter = z.discriminatedUnion("type", [
  MatchAllFilter,
  MatchAnyFilter,
]);

const GRangeFilter = z.object({
  type: z.literal("range"),
  field_name: z.string(),
  values: z.array(
    z.union([
      z.object({
        from: z.union([z.string(), z.number()]),
        to: z.union([z.string(), z.number()]),
      }),
      z
        .object({
          gte: z.string().optional(),
          lte: z.string().optional(),
          lt: z.string().optional(),
          gt: z.string().optional(),
        })
        .refine(
          (data) => {
            const hasGte = "gte" in data;
            const hasLte = "lte" in data;
            const hasLt = "lt" in data;
            const hasGt = "gt" in data;
            if (hasGte && hasGt) {
              return false;
            }
            if (hasLte && hasLt) {
              return false;
            }
            if (!hasGte && !hasGt && !hasLte && !hasLt) {
              return false;
            }
            return true;
          },
          {
            message:
              "Range filter must have either 'from' and 'to' or exactly one of 'gte' or 'gt' and exactly one of 'lte' or 'lt'",
          },
        ),
    ]),
  ),
});

const GFilterGeoBoundingBox = z.object({
  type: z.literal("geo_bounding_box"),
  field_name: z.string(),
  top_left: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  bottom_right: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

// const GFilterGeoShape = z.object({
//   type: z.literal("geo_shape"),
//   field_name: z.string(),
//   shape: z.object({
//     type: z.enum(["Ploygon"]),
//     coordinates: z.array(z.array(z.array(z.number()))),
//   }),
//   relation: z.enum(["intersects", "within"]),
// });

const GExistsFilter = z.object({
  type: z.literal("exists"),
  field_name: z.string(),
});

const GLikeFilter = z.object({
  type: z.literal("like"),
  field_name: z.string(),
  values: z.array(z.string()),
});

const UITypes = z.enum(["date", "datetime", "number", "string"]);

const UIPropsSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  type: UITypes.optional(),
});

export const FilterComponentSchema = z.discriminatedUnion("type", [
  MatchAnyFilter.extend({
    values: MatchAnyFilter.shape.values.optional(),
    ui: UIPropsSchema.optional(),
  }),
  MatchAllFilter.extend({
    values: MatchAllFilter.shape.values.optional(),
    ui: UIPropsSchema.optional(),
  }),
  GRangeFilter.extend({
    values: GRangeFilter.shape.values.optional(),
    ui: UIPropsSchema.optional(),
  }),
  GExistsFilter.extend({
    field_name: GExistsFilter.shape.field_name.optional(),
    ui: UIPropsSchema.optional(),
  }),
  GLikeFilter.extend({
    values: GLikeFilter.shape.values.optional(),
    ui: UIPropsSchema.optional(),
  }),
]);

export const FiltersSchema = z.array(FilterComponentSchema);

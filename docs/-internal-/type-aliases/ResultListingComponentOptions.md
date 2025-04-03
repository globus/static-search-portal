[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: ResultListingComponentOptions

> **ResultListingComponentOptions** = `object`

Defined in: [src/components/ResultListing.tsx:31](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/ResultListing.tsx#L31)

## Properties

### fields?

> `optional` **fields**: [`FieldDefinition`](FieldDefinition.md)[]

Defined in: [src/components/ResultListing.tsx:67](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/ResultListing.tsx#L67)

The fields to display in the result.
A field can be a string, an object with a `label` and `property`, or an object with a `label` and `value`.

#### Examples

```ts
["entries[0].content.purpose", "entries[0].content.tags"]
```

```ts
[
   "entries[0].content.tags",
   { label: "Purpose", "property": "entries[0].content.purpose" },
   { label: "Note", value: "Lorem ipsum dolor sit amet."}
]
```

***

### heading?

> `optional` **heading**: `string`

Defined in: [src/components/ResultListing.tsx:38](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/ResultListing.tsx#L38)

The field to use as the title for the result.

#### Default

```ts
"subject"
```

#### Example

```ts
"entries[0].content.title"
```

#### See

https://docs.globus.org/api/search/reference/get_subject/#gmetaresult

***

### image?

> `optional` **image**: `string` \| \{ `alt`: `string`; `src`: `string`; \}

Defined in: [src/components/ResultListing.tsx:49](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/ResultListing.tsx#L49)

An image to display in the result.

#### Example

```ts
"entries[0].content.image"
```

***

### summary?

> `optional` **summary**: `string`

Defined in: [src/components/ResultListing.tsx:44](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/ResultListing.tsx#L44)

The field to use as the summary for the result.

#### Example

```ts
"entries[0].content.summary"
```

#### See

https://docs.globus.org/api/search/reference/get_subject/#gmetaresult

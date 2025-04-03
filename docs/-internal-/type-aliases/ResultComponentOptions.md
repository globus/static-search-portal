[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: ResultComponentOptions

> **ResultComponentOptions** = `object`

Defined in: [src/components/Result.tsx:82](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L82)

## Properties

### fields?

> `optional` **fields**: [`FieldDefinition`](FieldDefinition.md)[]

Defined in: [src/components/Result.tsx:108](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L108)

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

### globus?

> `optional` **globus**: `object`

Defined in: [src/components/Result.tsx:110](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L110)

#### transfer?

> `optional` **transfer**: [`GlobusTransferOptions`](GlobusTransferOptions.md)

Enables Globus Transfer UI for the result.

***

### heading?

> `optional` **heading**: `string`

Defined in: [src/components/Result.tsx:89](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L89)

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

### links?

> `optional` **links**: [`LinkDefinition`](LinkDefinition.md)[]

Defined in: [src/components/Result.tsx:109](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L109)

***

### summary?

> `optional` **summary**: `string`

Defined in: [src/components/Result.tsx:95](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L95)

The field to use as the summary for the result.

#### Example

```ts
"entries[0].content.summary"
```

#### See

https://docs.globus.org/api/search/reference/get_subject/#gmetaresult

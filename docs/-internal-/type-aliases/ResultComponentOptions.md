[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: ResultComponentOptions

> **ResultComponentOptions**: `object`

Defined in: [src/components/Result.tsx:82](https://github.com/globus/static-search-portal/blob/01d1d33d3d0989c593fada6bb539073cee27ae57/src/components/Result.tsx#L82)

## Type declaration

### fields?

> `optional` **fields**: [`FieldDefinition`](FieldDefinition.md)[]

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

### globus?

> `optional` **globus**: `object`

#### globus.transfer?

> `optional` **transfer**: [`GlobusTransferOptions`](GlobusTransferOptions.md)

Enables Globus Transfer UI for the result.

### heading?

> `optional` **heading**: `string`

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

### links?

> `optional` **links**: [`LinkDefinition`](LinkDefinition.md)[]

### summary?

> `optional` **summary**: `string`

The field to use as the summary for the result.

#### Example

```ts
"entries[0].content.summary"
```

#### See

https://docs.globus.org/api/search/reference/get_subject/#gmetaresult

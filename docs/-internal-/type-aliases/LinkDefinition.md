[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: LinkDefinition

> **LinkDefinition** = `object`

Defined in: [src/components/Result.tsx:30](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L30)

## Properties

### href

> **href**: `string` \| \{ `fallback`: `string`; `property`: `string`; \}

Defined in: [src/components/Result.tsx:38](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L38)

The location that will be used as the `href` for the link.

#### Type declaration

`string`

\{ `fallback`: `string`; `property`: `string`; \}

#### fallback?

> `optional` **fallback**: `string`

A fallback value that will be used if the property is not found.

#### property

> **property**: `string`

***

### label

> **label**: `string` \| \{ `fallback`: `string`; `property`: `string`; \}

Defined in: [src/components/Result.tsx:34](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L34)

The label that will be rendered as the link text.

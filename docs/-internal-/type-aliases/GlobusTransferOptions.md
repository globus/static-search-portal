[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: GlobusTransferOptions

> **GlobusTransferOptions** = `object`

Defined in: [src/components/Result.tsx:49](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L49)

## Properties

### collection

> **collection**: `string` \| \{ `property`: `string`; \}

Defined in: [src/components/Result.tsx:61](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L61)

The collection that will be used as the `source_endpoint` for the transfer.

#### Type declaration

`string`

\{ `property`: `string`; \}

#### property

> **property**: `string`

`property` can be used to reference a value from the result (subject) using JSONata.

***

### path

> **path**: `string` \| \{ `property`: `string`; \}

Defined in: [src/components/Result.tsx:72](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L72)

The path that will be used as the `source_path` for the transfer.

#### Type declaration

`string`

\{ `property`: `string`; \}

#### property

> **property**: `string`

`property` can be used to reference a value from the result (subject) using JSONata.

***

### type?

> `optional` **type**: `string` \| \{ `property`: `string`; \}

Defined in: [src/components/Result.tsx:50](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/src/components/Result.tsx#L50)

#### Type declaration

`string`

\{ `property`: `string`; \}

#### property

> **property**: `string`

`property` can be used to reference a value from the result (subject) using JSONata.

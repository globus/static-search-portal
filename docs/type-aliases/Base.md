[**@globus/static-search-portal**](../README.md)

***

# Type Alias: Base

> **Base** = `object`

Defined in: [static.ts:12](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L12)

The base type for a `static.json` file.

## Properties

### \_static

> **\_static**: `object`

Defined in: [static.ts:13](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L13)

#### generator

> **generator**: `object`

##### generator.name

> **name**: `string`

The name of the generator used to build the `static.json` file.
This should be a reference to the package name of the generator.

###### Example

```ts
"@globus/static-data-portal"
```

#### host?

> `optional` **host**: `object`

GitHub Action-injected environment variables.

##### See

https://github.com/from-static/actions

##### host.base\_path

> **base\_path**: `string`

##### host.base\_url

> **base\_url**: `string`

##### host.host

> **host**: `string`

##### host.origin

> **origin**: `string`

***

### data

> **data**: `object`

Defined in: [static.ts:33](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L33)

#### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### version

> **version**: `string`

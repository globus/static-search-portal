[**@globus/static-search-portal**](../README.md) • **Docs**

***

# Type alias: Base

> **Base**: `object`

The base type for a `static.json` file.

## Type declaration

### \_static

> **\_static**: `object`

### \_static.generator

> **generator**: `object`

### \_static.generator.name

> **name**: `string`

The name of the generator used to build the `static.json` file.
This should be a reference to the package name of the generator.

#### Example

```ts
"@globus/static-data-portal"
```

### \_static.host?

> `optional` **host**: `object`

GitHub Action-injected environment variables.

#### See

https://github.com/from-static/actions

### \_static.host.base\_path

> **base\_path**: `string`

### \_static.host.base\_url

> **base\_url**: `string`

### \_static.host.host

> **host**: `string`

### \_static.host.origin

> **origin**: `string`

### data

> **data**: `object`

### data.attributes

> **attributes**: `Record`\<`string`, `unknown`\>

### data.version

> **version**: `string`

## Source

[static.ts:12](https://github.com/globus/static-search-portal/blob/baa2d7ee8b5271b1d58d6455e5096e077c19aecd/static.ts#L12)

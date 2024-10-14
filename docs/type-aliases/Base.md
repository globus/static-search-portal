[**@globus/static-search-portal**](../README.md)

***

# Type Alias: Base

> **Base**: `object`

Defined in: [static.ts:12](https://github.com/globus/static-search-portal/blob/01d1d33d3d0989c593fada6bb539073cee27ae57/static.ts#L12)

The base type for a `static.json` file.

## Type declaration

### \_static

> **\_static**: `object`

#### \_static.generator

> **generator**: `object`

#### \_static.generator.name

> **name**: `string`

The name of the generator used to build the `static.json` file.
This should be a reference to the package name of the generator.

##### Example

```ts
"@globus/static-data-portal"
```

#### \_static.host?

> `optional` **host**: `object`

GitHub Action-injected environment variables.

##### See

https://github.com/from-static/actions

#### \_static.host.base\_path

> **base\_path**: `string`

#### \_static.host.base\_url

> **base\_url**: `string`

#### \_static.host.host

> **host**: `string`

#### \_static.host.origin

> **origin**: `string`

### data

> **data**: `object`

#### data.attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### data.version

> **version**: `string`

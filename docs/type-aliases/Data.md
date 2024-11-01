[**@globus/static-search-portal**](../README.md) • **Docs**

***

# Type alias: Data

> **Data**: `object`

The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).

## Type declaration

### attributes

> **attributes**: `object`

### attributes.components?

> `optional` **components**: `object`

### attributes.components.Result?

> `optional` **Result**: [`ResultComponentOptions`](../-internal-/type-aliases/ResultComponentOptions.md)

### attributes.components.ResultListing?

> `optional` **ResultListing**: [`ResultListingComponentOptions`](../-internal-/type-aliases/ResultListingComponentOptions.md)

### attributes.content?

> `optional` **content**: `object`

### attributes.content.headline?

> `optional` **headline**: `string`

### attributes.content.logo?

> `optional` **logo**: `object`

### attributes.content.logo.alt?

> `optional` **alt**: `string`

### attributes.content.logo.src

> **src**: `string`

### attributes.content.navigation?

> `optional` **navigation**: [`NavigationOptions`](../-internal-/type-aliases/NavigationOptions.md)

### attributes.features?

> `optional` **features**: `object`

### attributes.features.authentication?

> `optional` **authentication**: `boolean`

Enable the Globus Auth functionality in the portal.

### attributes.features.jsonata?

> `optional` **jsonata**: `boolean`

Enable JSONata support for processing the `static.json` file.

#### See

https://jsonata.org/

### attributes.features.transfer?

> `optional` **transfer**: `boolean`

Enables the Globus Transfer functionality in the portal.

### attributes.features.useLocalStorage?

> `optional` **useLocalStorage**: `boolean`

Whether or not authorization data should be stored in LocalStorage

### attributes.globus

> **globus**: `object`

### attributes.globus.application?

> `optional` **application**: `object`

Information about your registered Globus Auth Application (Client)

#### See

https://docs.globus.org/api/auth/developer-guide/#developing-apps

### attributes.globus.application.client\_id

> **client\_id**: `string`

The UUID of the client application.

### attributes.globus.application.redirect\_uri?

> `optional` **redirect\_uri**: `string`

The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.

#### Example

```ts
"https://example.com/data-portal/authenticate"
```

### attributes.globus.search

> **search**: `object`

Configuration for Search-related functionality in the portal.

### attributes.globus.search.facets?

> `optional` **facets**: `object`[]

### attributes.globus.search.index

> **index**: `string`

The UUID of the Globus Search Index that will be used as the data source.

### attributes.metadata?

> `optional` **metadata**: `object`

### attributes.metadata.description?

> `optional` **description**: `string`

### attributes.metadata.title?

> `optional` **title**: `string`

### attributes.theme?

> `optional` **theme**: [`ThemeSettings`](../-internal-/type-aliases/ThemeSettings.md)

### version

> **version**: `string`

The version of the `data` object, which is used to determine how
the generator will render its `attributes`.

#### Example

```ts
"1.0.0"
```

## Source

[static.ts:42](https://github.com/globus/static-search-portal/blob/427d9e768bedde4f5dc3d367aa2f475355b36dde/static.ts#L42)
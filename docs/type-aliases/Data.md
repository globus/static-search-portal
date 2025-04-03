[**@globus/static-search-portal**](../README.md)

***

# Type Alias: Data

> **Data** = `object`

Defined in: [static.ts:42](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L42)

The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).

## Properties

### attributes

> **attributes**: `object`

Defined in: [static.ts:49](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L49)

#### components?

> `optional` **components**: `object`

##### components.Result?

> `optional` **Result**: [`ResultComponentOptions`](../-internal-/type-aliases/ResultComponentOptions.md)

##### components.ResultListing?

> `optional` **ResultListing**: [`ResultListingComponentOptions`](../-internal-/type-aliases/ResultListingComponentOptions.md)

#### content?

> `optional` **content**: `object`

##### content.headline?

> `optional` **headline**: `string`

##### content.logo?

> `optional` **logo**: `object`

##### content.logo.alt?

> `optional` **alt**: `string`

##### content.logo.src

> **src**: `string`

##### content.navigation?

> `optional` **navigation**: [`NavigationOptions`](../-internal-/type-aliases/NavigationOptions.md)

#### contentSecurityPolicy?

> `optional` **contentSecurityPolicy**: `string` \| `false`

The Content Security Policy (CSP) for the portal that will be included in a `<meta>` tag.
If no value is provided, a default CSP will be used.
If `false` is provided as the value, no CSP `<meta>` tag will be included.

##### See

https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

#### features?

> `optional` **features**: `object`

##### features.authentication?

> `optional` **authentication**: `boolean`

Enable the Globus Auth functionality in the portal.

##### features.jsonata?

> `optional` **jsonata**: `boolean`

Enable JSONata support for processing the `static.json` file.

###### See

https://jsonata.org/

##### features.requireAuthentication?

> `optional` **requireAuthentication**: `boolean`

Force users to authenticate before accessing the portal, regardless of whether or not the
configured Globus Index is private.

##### features.transfer?

> `optional` **transfer**: `boolean`

Enables the Globus Transfer functionality in the portal.

##### features.useLocalStorage?

> `optional` **useLocalStorage**: `boolean`

Whether or not authorization data should be stored in LocalStorage

#### globus

> **globus**: `object`

##### globus.application?

> `optional` **application**: `object`

Information about your registered Globus Auth Application (Client)

###### See

https://docs.globus.org/api/auth/developer-guide/#developing-apps

##### globus.application.client\_id

> **client\_id**: `string`

The UUID of the client application.

##### globus.application.redirect\_uri?

> `optional` **redirect\_uri**: `string`

The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.

###### Example

```ts
"https://example.com/data-portal/authenticate"
```

##### globus.application.scopes?

> `optional` **scopes**: `string`[]

Additional scopes to request from the Globus Auth service when authenticating.

##### globus.search

> **search**: `object`

Configuration for Search-related functionality in the portal.

##### globus.search.facets?

> `optional` **facets**: `object`[]

##### globus.search.index

> **index**: `string`

The UUID of the Globus Search Index that will be used as the data source.

#### metadata?

> `optional` **metadata**: `object`

##### metadata.description?

> `optional` **description**: `string`

##### metadata.title?

> `optional` **title**: `string`

#### theme?

> `optional` **theme**: [`ThemeSettings`](../-internal-/type-aliases/ThemeSettings.md)

***

### version

> **version**: `string`

Defined in: [static.ts:48](https://github.com/globus/static-search-portal/blob/990a456048a4b0fddd1bdca97dfdd497ec165350/static.ts#L48)

The version of the `data` object, which is used to determine how
the generator will render its `attributes`.

#### Example

```ts
"1.0.0"
```

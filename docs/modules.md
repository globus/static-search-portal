# @globus/static-search-portal

## Modules

- [\<internal\>](modules/internal_.md)

## Type Aliases

### Base

Ƭ **Base**: `Object`

The base type for a `static.json` file.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_static` | \{ `generator`: \{ `name`: `string`  } ; `host?`: \{ `base_path`: `string` ; `base_url`: `string` ; `host`: `string` ; `origin`: `string`  }  } |
| `_static.generator` | \{ `name`: `string`  } |
| `_static.generator.name` | `string` |
| `_static.host?` | \{ `base_path`: `string` ; `base_url`: `string` ; `host`: `string` ; `origin`: `string`  } |
| `_static.host.base_path` | `string` |
| `_static.host.base_url` | `string` |
| `_static.host.host` | `string` |
| `_static.host.origin` | `string` |
| `data` | \{ `attributes`: `Record`\<`string`, `unknown`\> ; `version`: `string`  } |
| `data.attributes` | `Record`\<`string`, `unknown`\> |
| `data.version` | `string` |

#### Defined in

[static.ts:9](https://github.com/globus/static-search-portal/blob/d2fbf9e/static.ts#L9)

___

### Data

Ƭ **Data**: `Object`

The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `attributes` | \{ `components?`: \{ `Result?`: [`ResultComponentOptions`](modules/internal_.md#resultcomponentoptions) ; `ResultListing?`: \{ `heading?`: `string` ; `summary?`: `string`  }  } ; `content`: \{ `headline`: `string` ; `logo?`: \{ `alt?`: `string` ; `src`: `string`  }  } ; `globus`: \{ `application?`: \{ `client_id`: `string` ; `redirect_uri?`: `string`  } ; `search`: \{ `index`: `string`  }  } ; `metadata`: \{ `description`: `string` ; `title`: `string`  }  } | - |
| `attributes.components?` | \{ `Result?`: [`ResultComponentOptions`](modules/internal_.md#resultcomponentoptions) ; `ResultListing?`: \{ `heading?`: `string` ; `summary?`: `string`  }  } | - |
| `attributes.components.Result?` | [`ResultComponentOptions`](modules/internal_.md#resultcomponentoptions) | - |
| `attributes.components.ResultListing?` | \{ `heading?`: `string` ; `summary?`: `string`  } | - |
| `attributes.components.ResultListing.heading?` | `string` | The field to use as the title for the result. **`Default`** ```ts "subject" ``` **`Example`** ```ts "entries[0].content.title" ``` **`See`** https://docs.globus.org/api/search/reference/get_subject/#gmetaresult |
| `attributes.components.ResultListing.summary?` | `string` | The field to use as the summary for the result. **`Example`** ```ts "entries[0].content.summary" ``` **`See`** https://docs.globus.org/api/search/reference/get_subject/#gmetaresult |
| `attributes.content` | \{ `headline`: `string` ; `logo?`: \{ `alt?`: `string` ; `src`: `string`  }  } | - |
| `attributes.content.headline` | `string` | - |
| `attributes.content.logo?` | \{ `alt?`: `string` ; `src`: `string`  } | - |
| `attributes.content.logo.alt?` | `string` | - |
| `attributes.content.logo.src` | `string` | - |
| `attributes.globus` | \{ `application?`: \{ `client_id`: `string` ; `redirect_uri?`: `string`  } ; `search`: \{ `index`: `string`  }  } | - |
| `attributes.globus.application?` | \{ `client_id`: `string` ; `redirect_uri?`: `string`  } | Information about your registered Globus Auth Application (Client) **`See`** https://docs.globus.org/api/auth/developer-guide/#developing-apps |
| `attributes.globus.application.client_id` | `string` | The UUID of the client application. |
| `attributes.globus.application.redirect_uri?` | `string` | The redirect URI for the Globus Auth login page to complete the OAuth2 flow. The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback. To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host. **`Example`** ```ts "https://example.com/data-portal/authenticate" ``` |
| `attributes.globus.search` | \{ `index`: `string`  } | Configuration for Search-related functionality in the portal. |
| `attributes.globus.search.index` | `string` | The UUID of the Globus Search Index that will be used as the data source. |
| `attributes.metadata` | \{ `description`: `string` ; `title`: `string`  } | - |
| `attributes.metadata.description` | `string` | - |
| `attributes.metadata.title` | `string` | - |
| `version` | `string` | The version of the `data` object, which is used to determine how the generator will render its `attributes`. **`Example`** ```ts "1.0.0" ``` |

#### Defined in

[static.ts:39](https://github.com/globus/static-search-portal/blob/d2fbf9e/static.ts#L39)

___

### Static

Ƭ **Static**: [`Base`](modules.md#base) & \{ `data`: [`Data`](modules.md#data)  }

#### Defined in

[static.ts:110](https://github.com/globus/static-search-portal/blob/d2fbf9e/static.ts#L110)

## Functions

### getAttribute

▸ **getAttribute**(`key`, `defaultValue?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `defaultValue?` | `any` |

#### Returns

`any`

#### Defined in

[static.ts:174](https://github.com/globus/static-search-portal/blob/d2fbf9e/static.ts#L174)

___

### getAttributeFrom

▸ **getAttributeFrom**\<`T`\>(`obj`, `key`, `defaultValue?`): `T` \| `undefined`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Record`\<`string`, `any`\> |
| `key` | `string` |
| `defaultValue?` | `T` |

#### Returns

`T` \| `undefined`

#### Defined in

[static.ts:178](https://github.com/globus/static-search-portal/blob/d2fbf9e/static.ts#L178)

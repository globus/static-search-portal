# Module: \<internal\>

## Type Aliases

### FieldDefinition

Ƭ **FieldDefinition**: `string` \| \{ `label`: `string` ; `property`: `string`  } \| \{ `label`: `string` ; `value`: `unknown`  }

#### Defined in

[src/components/Result.tsx:31](https://github.com/globus/static-search-portal/blob/d69c034/src/components/Result.tsx#L31)

___

### ResultComponentOptions

Ƭ **ResultComponentOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `fields?` | [`FieldDefinition`](internal_.md#fielddefinition)[] | The fields to display in the result. A field can be a string, an object with a `label` and `property`, or an object with a `label` and `value`. **`Example`** ```ts ["entries[0].content.purpose", "entries[0].content.tags"] ``` **`Example`** ```ts [ "entries[0].content.tags", { label: "Purpose", "property": "entries[0].content.purpose" }, { label: "Note", value: "Lorem ipsum dolor sit amet."} ] ``` |
| `heading?` | `string` | The field to use as the title for the result. **`Default`** ```ts "subject" ``` **`Example`** ```ts "entries[0].content.title" ``` **`See`** https://docs.globus.org/api/search/reference/get_subject/#gmetaresult |
| `summary?` | `string` | The field to use as the summary for the result. **`Example`** ```ts "entries[0].content.summary" ``` **`See`** https://docs.globus.org/api/search/reference/get_subject/#gmetaresult |

#### Defined in

[src/components/Result.tsx:42](https://github.com/globus/static-search-portal/blob/d69c034/src/components/Result.tsx#L42)

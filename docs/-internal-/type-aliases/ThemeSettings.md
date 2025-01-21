[**@globus/static-search-portal**](../../README.md)

***

# Type Alias: ThemeSettings

> **ThemeSettings**: `object`

Defined in: [src/theme.ts:27](https://github.com/globus/static-search-portal/blob/01d1d33d3d0989c593fada6bb539073cee27ae57/src/theme.ts#L27)

## Type declaration

### colors?

> `optional` **colors**: `Record`\<`string`, [`ColorDefinition`](ColorDefinition.md)\>

Specific color definitions to use in the theme.
The most common use case is to define a `primary` color.

#### Example

```json
{
  "colors": {
    "primary": {
     "50": "#E5F2FF",
     "100": "#B8DBFF",
     "200": "#8AC4FF",
     "300": "#5CADFF",
     "400": "#2E96FF",
     "500": "#007FFF",
     "600": "#0066CC",
     "700": "#004C99",
     "800": "#00264c",
     "900": "#001933"
  }
 }
}
```

#### See

https://v2.chakra-ui.com/docs/styled-system/theme#colors

### colorScheme?

> `optional` **colorScheme**: `string`

Apply a default color scheme to all components.
This supports all Chakra UI color schemes and is not provided by default.

#### See

https://v2.chakra-ui.com/docs/styled-system/theme#colors for available color schemes.

### extendTheme?

> `optional` **extendTheme**: `Parameters`\<*typeof* `extendTheme`\>\[`0`\]

Extend the Chakra UI theme.

#### See

https://v2.chakra-ui.com/docs/styled-system/customize-theme#using-theme-extensions

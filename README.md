# @quartz-community/content-meta

Displays content metadata such as creation date, modification date, and reading time.

## Installation

```bash
npx quartz plugin add github:quartz-community/content-meta
```

## Usage

```yaml title="quartz.config.yaml"
plugins:
  - source: github:quartz-community/content-meta
    enabled: true
    options:
      delimiter: " | "
      items:
        - type: created
          prefix: "Created on "
        - type: modified
          prefix: "Updated on "
        - type: readingTime
          prefix: "("
          suffix: ")"
    layout:
      position: beforeBody
      priority: 20
```

By default, the plugin displays the date selected by Quartz's `defaultDateType` and the estimated reading time, separated by a comma. Use `items` to select and order metadata, and `delimiter` to change the text between items.

For advanced use cases, you can override in TypeScript:

```ts title="quartz.ts (override)"
import * as ExternalPlugin from "./.quartz/plugins";

ExternalPlugin.ContentMeta({
  delimiter: " | ",
  items: [
    { type: "created", prefix: "Created on " },
    { type: "modified", prefix: "Updated on " },
    { type: "readingTime", prefix: "(", suffix: ")" },
  ],
});
```

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ContentMetaItem[]` | `[{ type: "defaultDate" }, { type: "readingTime" }]` | Metadata items to display, in order. An empty array displays nothing. |
| `delimiter` | `string` | `", "` | Text between metadata items. An empty string disables the delimiter. |
| `showReadingTime` | `boolean` | `true` | Deprecated. Whether to display reading time when `items` is omitted. |
| `showComma` | `boolean` | `true` | Deprecated. Whether to display a comma when `delimiter` is omitted. |

### Metadata items

Each item accepts the following options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `ContentMetaItemType` | Required | The metadata value to display. See the supported types below. |
| `prefix` | `string` | `""` | Text before the value, including any desired spacing. |
| `suffix` | `string` | `""` | Text after the value, including any desired spacing. |

The following item types are supported:

| Type | Description |
| --- | --- |
| `defaultDate` | The date selected by `defaultDateType`. The page's setting takes precedence over the global configuration. |
| `created` | The creation date. |
| `modified` | The modification date. |
| `published` | The publication date. |
| `readingTime` | The estimated reading time. |

Dates are provided by the CreatedModifiedDate plugin. Dates and reading time use the site's locale. Prefixes, suffixes, and delimiters are displayed as plain text and are not translated.

Items with unavailable dates are omitted, including their prefixes and suffixes. Delimiters are only displayed between available items. Pages without text content display no metadata.

### Legacy options

`showReadingTime` and `showComma` remain supported for existing configurations. When `items` is supplied, it takes precedence over `showReadingTime`. When `delimiter` is supplied, it takes precedence over `showComma`, including an empty string.

For example, to display only the selected date:

```yaml
options:
  items:
    - type: defaultDate
```

Use `delimiter: ""` instead of `showComma: false` to display items without a separator.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/plugins/ContentMeta) for more information.

## License

MIT

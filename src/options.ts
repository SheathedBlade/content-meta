export type ContentMetaItemType =
  | "defaultDate"
  | "created"
  | "modified"
  | "published"
  | "readingTime";

export interface ContentMetaItem {
  type: ContentMetaItemType;
  prefix?: string;
  suffix?: string;
}

export interface ContentMetaOptions {
  /**
   * Metadata to display in order.
   * When omitted, will display defaultDate and readingTime
   * Empty array will display nothing
   */
  items?: ContentMetaItem[];

  /**
   * Text to display between items.
   * Defaults to ", ".
   * Empty string disables the delimiter entirely.
   */
  delimiter?: string;

  /** @deprecated Use items instead. Ignored when items is supplied */
  showReadingTime?: boolean;

  /** @deprecated Use delimiter instead. Ignored when delimiter is supplied */
  showComma?: boolean;
}

export interface ResolvedContentMetaOptions {
  items: ContentMetaItem[];
  delimiter: string;
}

export function resolveOptions(options: ContentMetaOptions = {}): ResolvedContentMetaOptions {
  const defaultItems: ContentMetaItem[] = [{ type: "defaultDate" }];
  if (options.showReadingTime !== false) {
    defaultItems.push({ type: "readingTime" });
  }

  return {
    items: options.items ?? defaultItems,
    delimiter: options.delimiter ?? (options.showComma === false ? "" : ", "),
  };
}

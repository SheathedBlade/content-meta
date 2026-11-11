import type { QuartzComponentConstructor, QuartzComponentProps } from "@quartz-community/types";
import { Fragment, type JSX } from "preact";
import readingTime from "reading-time";
import { i18n } from "../i18n";
import type { ContentMetaItemType, ContentMetaOptions } from "../options";
import { resolveOptions } from "../options";
import { DateComponent } from "../util/date";
import { classNames } from "../util/lang";
import style from "./styles/contentMeta.scss";

export type { ContentMetaOptions } from "../options";

const dateFields = {
  created: "created",
  modified: "modified",
  published: "published",
} as const;

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options = resolveOptions(opts);

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text;
    const locale = cfg.locale || "en-US";

    function resolveDate(type: ContentMetaItemType): Date | undefined {
      if (!fileData.dates) return undefined;

      if (type === "defaultDate") {
        const dateType = fileData.defaultDateType ?? cfg.defaultDateType;
        if (dateType !== "created" && dateType !== "modified" && dateType !== "published") {
          return undefined;
        }

        const date = fileData.dates[dateType];
        return isValidDate(date) ? date : undefined;
      }

      if (type === "readingTime") {
        return undefined;
      }

      const date = fileData.dates[dateFields[type]];
      return isValidDate(date) ? date : undefined;
    }

    function resolveValue(type: ContentMetaItemType): string | JSX.Element | undefined {
      if (type === "readingTime") {
        if (!text) return undefined;
        const { minutes } = readingTime(text as string);
        const i18nData = i18n(locale);
        return i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        });
      }

      const date = resolveDate(type);
      if (!date) return undefined;

      return <DateComponent date={date} locale={locale} />;
    }

    const segments = options.items.flatMap((item, index) => {
      const value = resolveValue(item.type);
      if (value === undefined) return [];

      return [
        <span key={`${item.type}-${index}`} class={`content-meta-item content-meta-${item.type}`}>
          {item.prefix ?? ""}
          {value}
          {item.suffix ?? ""}
        </span>,
      ];
    });

    if (segments.length === 0) return null;

    return (
      <p class={classNames(displayClass, "content-meta")}>
        {segments.map((segment, index) => (
          <Fragment key={segment.key}>
            {index > 0 ? options.delimiter : null}
            {segment}
          </Fragment>
        ))}
      </p>
    );
  }

  ContentMetadata.css = style;

  return ContentMetadata;
}) satisfies QuartzComponentConstructor;

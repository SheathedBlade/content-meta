import type { QuartzComponentConstructor, QuartzComponentProps } from "@quartz-community/types";
import type { JSX } from "preact";
import readingTime from "reading-time";
import { i18n } from "../i18n";
import { DateComponent } from "../util/date";
import { classNames } from "../util/lang";
import style from "./styles/contentMeta.scss";

export interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean;
  showComma: boolean;
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
};

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts };

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text;

    if (text) {
      const segments: (string | JSX.Element)[] = [];

      if (fileData.dates) {
        const locale = cfg.locale || "en-US";
        // const defaultDateType =
        //   (fileData.defaultDateType as ValidDateType | undefined) ??
        //   (cfg.defaultDateType as ValidDateType | undefined);
        // if (defaultDateType) {
        //   const dataWithDefaultDateType: QuartzPluginData = {
        //     ...(fileData as QuartzPluginData),
        //     defaultDateType,
        //   };
        //   const date = getDate(dataWithDefaultDateType);
        //   if (date) {
        //     segments.push(<DateComponent date={date} locale={locale} />);
        //   }
        // }
        if (fileData.dates.created) {
          segments.push(
            <span>
              Created on <DateComponent date={fileData.dates.created!} locale={locale} />
            </span>,
          );
          segments.push(<span>|</span>);
        }

        if (fileData.dates.modified) {
          segments.push(
            <span>
              Updated on <DateComponent date={fileData.dates.modified!} locale={locale} />
            </span>,
          );
          segments.push(<span>|</span>);
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text as string);
        const locale = cfg.locale || "en-US";
        const i18nData = i18n(locale);
        const displayedTime = i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        });
        segments.push(<span>{displayedTime}</span>);
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      );
    } else {
      return null;
    }
  }

  ContentMetadata.css = style;

  return ContentMetadata;
}) satisfies QuartzComponentConstructor;

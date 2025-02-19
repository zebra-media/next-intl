import { ReactElement } from 'react';
import DateTimeFormatOptions from './DateTimeFormatOptions';
import Formats from './Formats';
import IntlError from './IntlError';
import NumberFormatOptions from './NumberFormatOptions';
import RelativeTimeFormatOptions from './RelativeTimeFormatOptions';
import TimeZone from './TimeZone';
type Props = {
    locale: string;
    timeZone?: TimeZone;
    onError?(error: IntlError): void;
    formats?: Partial<Formats>;
    now?: Date;
};
export default function createFormatter({ formats, locale, now: globalNow, onError, timeZone: globalTimeZone }: Props): {
    dateTime: (value: Date | number, formatOrOptions?: string | DateTimeFormatOptions) => string;
    number: (value: number | bigint, formatOrOptions?: string | NumberFormatOptions) => string;
    relativeTime: (date: number | Date, nowOrOptions?: RelativeTimeFormatOptions['now'] | RelativeTimeFormatOptions) => string;
    list: <Value extends string | ReactElement<any, string | import("react").JSXElementConstructor<any>>>(value: Iterable<Value>, formatOrOptions?: string | Intl.ListFormatOptions) => Value extends string ? string : Iterable<ReactElement<any, string | import("react").JSXElementConstructor<any>>>;
    dateTimeRange: (start: Date | number, end: Date | number, formatOrOptions?: string | DateTimeFormatOptions) => string;
};
export {};

/// <reference types="react" />
export default function useFormatter(): {
    dateTime: (value: number | Date, formatOrOptions?: string | import("../core/DateTimeFormatOptions").default | undefined) => string;
    number: (value: number | bigint, formatOrOptions?: string | import("@formatjs/ecma402-abstract/types/number").NumberFormatOptions | undefined) => string;
    relativeTime: (date: number | Date, nowOrOptions?: number | Date | import("../core/RelativeTimeFormatOptions").default | undefined) => string;
    list: <Value extends string | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>>(value: Iterable<Value>, formatOrOptions?: string | Intl.ListFormatOptions | undefined) => Value extends string ? string : Iterable<import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>>;
    dateTimeRange: (start: number | Date, end: number | Date, formatOrOptions?: string | import("../core/DateTimeFormatOptions").default | undefined) => string;
};

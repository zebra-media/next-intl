import IntlConfig from './IntlConfig';
/**
 * Enhances the incoming props with defaults.
 */
export default function initializeConfig<Props extends IntlConfig>({ getMessageFallback, messages, onError, ...rest }: Props): Omit<Props, "onError" | "getMessageFallback" | "messages"> & {
    messages: import("./AbstractIntlMessages").default | undefined;
    onError: (error: import("./IntlError").default) => void;
    getMessageFallback: (info: {
        error: import("./IntlError").default;
        key: string;
        namespace?: string | undefined;
    }) => string;
};

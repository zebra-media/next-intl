import { ReactElement, ReactNodeArray } from 'react';
import Formats from './Formats';
import IntlConfig from './IntlConfig';
import MessageFormatCache from './MessageFormatCache';
import TranslationValues, { MarkupTranslationValues, RichTranslationValues } from './TranslationValues';
import MessageKeys from './utils/MessageKeys';
import NamespaceKeys from './utils/NamespaceKeys';
import NestedKeyOf from './utils/NestedKeyOf';
import NestedValueOf from './utils/NestedValueOf';
/**
 * Translates messages from the given namespace by using the ICU syntax.
 * See https://formatjs.io/docs/core-concepts/icu-syntax.
 *
 * If no namespace is provided, all available messages are returned.
 * The namespace can also indicate nesting by using a dot
 * (e.g. `namespace.Component`).
 */
export default function createTranslator<NestedKey extends NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>> = never>({ getMessageFallback, messages, namespace, onError, ...rest }: Omit<IntlConfig<IntlMessages>, 'defaultTranslationValues' | 'messages'> & {
    messages?: IntlConfig<IntlMessages>['messages'];
    namespace?: NestedKey;
    /** @private */
    messageFormatCache?: MessageFormatCache;
}): {
    <TargetKey extends MessageKeys<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>, NestedKeyOf<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>>>>(key: TargetKey, values?: TranslationValues, formats?: Partial<Formats>): string;
    rich<TargetKey extends MessageKeys<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>, NestedKeyOf<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>>>>(key: TargetKey, values?: RichTranslationValues, formats?: Partial<Formats>): string | ReactElement | ReactNodeArray;
    markup<TargetKey extends MessageKeys<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>, NestedKeyOf<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>>>>(key: TargetKey, values?: MarkupTranslationValues, formats?: Partial<Formats>): string;
    raw<TargetKey extends MessageKeys<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>, NestedKeyOf<NestedValueOf<{
        '!': IntlMessages;
    }, [
        NestedKey
    ] extends [never] ? '!' : `!.${NestedKey}`>>>>(key: TargetKey): any;
};

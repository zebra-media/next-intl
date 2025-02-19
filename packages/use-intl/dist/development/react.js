'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _IntlProvider = require('./_IntlProvider.js');
var _useLocale = require('./_useLocale-321e619f.js');
var React = require('react');
var createFormatter = require('./createFormatter-81d7e598.js');
var initializeConfig = require('./initializeConfig-c503e215.js');
require('./IntlContext-b5cc6be8.js');
require('intl-messageformat');

let hasWarnedForMissingTimezone = false;
const isServer = typeof window === 'undefined';
function useTranslationsImpl(allMessages, namespace, namespacePrefix) {
  const {
    defaultTranslationValues,
    formats: globalFormats,
    getMessageFallback,
    locale,
    messageFormatCache,
    onError,
    timeZone
  } = _useLocale.useIntlContext();

  // The `namespacePrefix` is part of the type system.
  // See the comment in the hook invocation.
  allMessages = allMessages[namespacePrefix];
  namespace = createFormatter.resolveNamespace(namespace, namespacePrefix);
  if (!timeZone && !hasWarnedForMissingTimezone && isServer) {
    hasWarnedForMissingTimezone = true;
    onError(new initializeConfig.IntlError(initializeConfig.IntlErrorCode.ENVIRONMENT_FALLBACK, "There is no `timeZone` configured, this can lead to markup mismatches caused by environment differences. Consider adding a global default: https://next-intl-docs.vercel.app/docs/configuration#time-zone" ));
  }
  const translate = React.useMemo(() => createFormatter.createBaseTranslator({
    messageFormatCache,
    getMessageFallback,
    messages: allMessages,
    defaultTranslationValues,
    namespace,
    onError,
    formats: globalFormats,
    locale,
    timeZone
  }), [messageFormatCache, getMessageFallback, allMessages, namespace, onError, defaultTranslationValues, globalFormats, locale, timeZone]);
  return translate;
}

/**
 * Translates messages from the given namespace by using the ICU syntax.
 * See https://formatjs.io/docs/core-concepts/icu-syntax.
 *
 * If no namespace is provided, all available messages are returned.
 * The namespace can also indicate nesting by using a dot
 * (e.g. `namespace.Component`).
 */
function useTranslations(namespace) {
  const context = _useLocale.useIntlContext();
  const messages = context.messages;

  // We have to wrap the actual hook so the type inference for the optional
  // namespace works correctly. See https://stackoverflow.com/a/71529575/343045
  // The prefix ("!") is arbitrary.
  return useTranslationsImpl({
    '!': messages
  },
  // @ts-expect-error
  namespace ? "!.".concat(namespace) : '!', '!');
}

function getNow() {
  return new Date();
}

/**
 * Reading the current date via `new Date()` in components should be avoided, as
 * it causes components to be impure and can lead to flaky tests. Instead, this
 * hook can be used.
 *
 * By default, it returns the time when the component mounts. If `updateInterval`
 * is specified, the value will be updated based on the interval.
 *
 * You can however also return a static value from this hook, if you
 * configure the `now` parameter on the context provider. Note however,
 * that if `updateInterval` is configured in this case, the component
 * will initialize with the global value, but will afterwards update
 * continuously based on the interval.
 *
 * For unit tests, this can be mocked to a constant value. For end-to-end
 * testing, an environment parameter can be passed to the `now` parameter
 * of the provider to mock this to a static value.
 */
function useNow(options) {
  const updateInterval = options === null || options === void 0 ? void 0 : options.updateInterval;
  const {
    now: globalNow
  } = _useLocale.useIntlContext();
  const [now, setNow] = React.useState(globalNow || getNow());
  React.useEffect(() => {
    if (!updateInterval) return;
    const intervalId = setInterval(() => {
      setNow(getNow());
    }, updateInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [globalNow, updateInterval]);
  return updateInterval == null && globalNow ? globalNow : now;
}

function useTimeZone() {
  return _useLocale.useIntlContext().timeZone;
}

function useMessages() {
  const context = _useLocale.useIntlContext();
  if (!context.messages) {
    throw new Error('No messages found. Have you configured them correctly? See https://next-intl-docs.vercel.app/docs/configuration#messages' );
  }
  return context.messages;
}

function useFormatter() {
  const {
    formats,
    locale,
    now: globalNow,
    onError,
    timeZone
  } = _useLocale.useIntlContext();
  return React.useMemo(() => createFormatter.createFormatter({
    formats,
    locale,
    now: globalNow,
    onError,
    timeZone
  }), [formats, globalNow, locale, onError, timeZone]);
}

exports.IntlProvider = _IntlProvider.IntlProvider;
exports.useLocale = _useLocale.useLocale;
exports.useFormatter = useFormatter;
exports.useMessages = useMessages;
exports.useNow = useNow;
exports.useTimeZone = useTimeZone;
exports.useTranslations = useTranslations;

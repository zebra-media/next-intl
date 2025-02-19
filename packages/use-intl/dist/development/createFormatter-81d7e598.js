'use strict';

var IntlMessageFormat = require('intl-messageformat');
var React = require('react');
var initializeConfig = require('./initializeConfig-c503e215.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var IntlMessageFormat__default = /*#__PURE__*/_interopDefault(IntlMessageFormat);

// eslint-disable-next-line import/no-named-as-default -- False positive
function setTimeZoneInFormats(formats, timeZone) {
  if (!formats) return formats;

  // The only way to set a time zone with `intl-messageformat` is to merge it into the formats
  // https://github.com/formatjs/formatjs/blob/8256c5271505cf2606e48e3c97ecdd16ede4f1b5/packages/intl/src/message.ts#L15
  return Object.keys(formats).reduce((acc, key) => {
    acc[key] = {
      timeZone,
      ...formats[key]
    };
    return acc;
  }, {});
}

/**
 * `intl-messageformat` uses separate keys for `date` and `time`, but there's
 * only one native API: `Intl.DateTimeFormat`. Additionally you might want to
 * include both a time and a date in a value, therefore the separation doesn't
 * seem so useful. We offer a single `dateTime` namespace instead, but we have
 * to convert the format before `intl-messageformat` can be used.
 */
function convertFormatsToIntlMessageFormat(formats, timeZone) {
  const formatsWithTimeZone = timeZone ? {
    ...formats,
    dateTime: setTimeZoneInFormats(formats.dateTime, timeZone)
  } : formats;
  const mfDateDefaults = IntlMessageFormat__default.default.formats.date;
  const defaultDateFormats = timeZone ? setTimeZoneInFormats(mfDateDefaults, timeZone) : mfDateDefaults;
  const mfTimeDefaults = IntlMessageFormat__default.default.formats.time;
  const defaultTimeFormats = timeZone ? setTimeZoneInFormats(mfTimeDefaults, timeZone) : mfTimeDefaults;
  return {
    ...formatsWithTimeZone,
    date: {
      ...defaultDateFormats,
      ...(formatsWithTimeZone === null || formatsWithTimeZone === void 0 ? void 0 : formatsWithTimeZone.dateTime)
    },
    time: {
      ...defaultTimeFormats,
      ...(formatsWithTimeZone === null || formatsWithTimeZone === void 0 ? void 0 : formatsWithTimeZone.dateTime)
    }
  };
}

// eslint-disable-next-line import/no-named-as-default -- False positive
function resolvePath(locale, messages, key, namespace) {
  const fullKey = initializeConfig.joinPath(namespace, key);
  if (!messages) {
    throw new Error("No messages available at `".concat(namespace, "`.") );
  }
  let message = messages;
  key.split('.').forEach(part => {
    const next = message[part];
    if (part == null || next == null) {
      throw new Error("Could not resolve `".concat(fullKey, "` in messages for locale `").concat(locale, "`.") );
    }
    message = next;
  });
  return message;
}
function prepareTranslationValues(values) {
  if (Object.keys(values).length === 0) return undefined;

  // Workaround for https://github.com/formatjs/formatjs/issues/1467
  const transformedValues = {};
  Object.keys(values).forEach(key => {
    let index = 0;
    const value = values[key];
    let transformed;
    if (typeof value === 'function') {
      transformed = chunks => {
        const result = value(chunks);
        return /*#__PURE__*/React.isValidElement(result) ? /*#__PURE__*/React.cloneElement(result, {
          key: key + index++
        }) : result;
      };
    } else {
      transformed = value;
    }
    transformedValues[key] = transformed;
  });
  return transformedValues;
}
function getMessagesOrError(locale, messages, namespace) {
  let onError = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : initializeConfig.defaultOnError;
  try {
    if (!messages) {
      throw new Error("No messages were configured on the provider." );
    }
    const retrievedMessages = namespace ? resolvePath(locale, messages, namespace) : messages;
    if (!retrievedMessages) {
      throw new Error("No messages for namespace `".concat(namespace, "` found.") );
    }
    return retrievedMessages;
  } catch (error) {
    const intlError = new initializeConfig.IntlError(initializeConfig.IntlErrorCode.MISSING_MESSAGE, error.message);
    onError(intlError);
    return intlError;
  }
}
function getPlainMessage(candidate, values) {
  if (values) return undefined;
  const unescapedMessage = candidate.replace(/'([{}])/gi, '$1');

  // Placeholders can be in the message if there are default values,
  // or if the user has forgotten to provide values. In the latter
  // case we need to compile the message to receive an error.
  const hasPlaceholders = /<|{/.test(unescapedMessage);
  if (!hasPlaceholders) {
    return unescapedMessage;
  }
  return undefined;
}
function createBaseTranslator(config) {
  const messagesOrError = getMessagesOrError(config.locale, config.messages, config.namespace, config.onError);
  return createBaseTranslatorImpl({
    ...config,
    messagesOrError
  });
}
function createBaseTranslatorImpl(_ref) {
  let {
    defaultTranslationValues,
    formats: globalFormats,
    getMessageFallback = initializeConfig.defaultGetMessageFallback,
    locale,
    messageFormatCache,
    messagesOrError,
    namespace,
    onError,
    timeZone
  } = _ref;
  function getFallbackFromErrorAndNotify(key, code, message) {
    const error = new initializeConfig.IntlError(code, message);
    onError(error);
    return getMessageFallback({
      error,
      key,
      namespace
    });
  }
  function translateBaseFn( /** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */
  key, /** Key value pairs for values to interpolate into the message. */
  values, /** Provide custom formats for numbers, dates and times. */
  formats) {
    if (messagesOrError instanceof initializeConfig.IntlError) {
      // We have already warned about this during render
      return getMessageFallback({
        error: messagesOrError,
        key,
        namespace
      });
    }
    const messages = messagesOrError;
    let message;
    try {
      message = resolvePath(locale, messages, key, namespace);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, initializeConfig.IntlErrorCode.MISSING_MESSAGE, error.message);
    }
    const cacheKey = initializeConfig.joinPath(locale, namespace, key, String(message));
    let messageFormat;
    if (messageFormatCache !== null && messageFormatCache !== void 0 && messageFormatCache.has(cacheKey)) {
      messageFormat = messageFormatCache.get(cacheKey);
    } else {
      if (typeof message === 'object') {
        let code, errorMessage;
        if (Array.isArray(message)) {
          code = initializeConfig.IntlErrorCode.INVALID_MESSAGE;
          {
            errorMessage = "Message at `".concat(initializeConfig.joinPath(namespace, key), "` resolved to an array, but only strings are supported. See https://next-intl-docs.vercel.app/docs/usage/messages#arrays-of-messages");
          }
        } else {
          code = initializeConfig.IntlErrorCode.INSUFFICIENT_PATH;
          {
            errorMessage = "Message at `".concat(initializeConfig.joinPath(namespace, key), "` resolved to an object, but only strings are supported. Use a `.` to retrieve nested messages. See https://next-intl-docs.vercel.app/docs/usage/messages#structuring-messages");
          }
        }
        return getFallbackFromErrorAndNotify(key, code, errorMessage);
      }

      // Hot path that avoids creating an `IntlMessageFormat` instance
      const plainMessage = getPlainMessage(message, values);
      if (plainMessage) return plainMessage;
      try {
        messageFormat = new IntlMessageFormat__default.default(message, locale, convertFormatsToIntlMessageFormat({
          ...globalFormats,
          ...formats
        }, timeZone), {
          formatters: {
            getNumberFormat(locales, options) {
              return new Intl.NumberFormat(locales, options);
            },
            getDateTimeFormat(locales, options) {
              // Workaround for https://github.com/formatjs/formatjs/issues/4279
              return new Intl.DateTimeFormat(locales, {
                timeZone,
                ...options
              });
            },
            getPluralRules(locales, options) {
              return new Intl.PluralRules(locales, options);
            }
          }
        });
      } catch (error) {
        const thrownError = error;
        return getFallbackFromErrorAndNotify(key, initializeConfig.IntlErrorCode.INVALID_MESSAGE, thrownError.message + ('originalMessage' in thrownError ? " (".concat(thrownError.originalMessage, ")") : '') );
      }
      messageFormatCache === null || messageFormatCache === void 0 || messageFormatCache.set(cacheKey, messageFormat);
    }
    try {
      const formattedMessage = messageFormat.format(
      // @ts-expect-error `intl-messageformat` expects a different format
      // for rich text elements since a recent minor update. This
      // needs to be evaluated in detail, possibly also in regards
      // to be able to format to parts.
      prepareTranslationValues({
        ...defaultTranslationValues,
        ...values
      }));
      if (formattedMessage == null) {
        throw new Error("Unable to format `".concat(key, "` in ").concat(namespace ? "namespace `".concat(namespace, "`") : 'messages') );
      }

      // Limit the function signature to return strings or React elements
      return /*#__PURE__*/React.isValidElement(formattedMessage) ||
      // Arrays of React elements
      Array.isArray(formattedMessage) || typeof formattedMessage === 'string' ? formattedMessage : String(formattedMessage);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, initializeConfig.IntlErrorCode.FORMATTING_ERROR, error.message);
    }
  }
  function translateFn( /** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */
  key, /** Key value pairs for values to interpolate into the message. */
  values, /** Provide custom formats for numbers, dates and times. */
  formats) {
    const result = translateBaseFn(key, values, formats);
    if (typeof result !== 'string') {
      return getFallbackFromErrorAndNotify(key, initializeConfig.IntlErrorCode.INVALID_MESSAGE, "The message `".concat(key, "` in ").concat(namespace ? "namespace `".concat(namespace, "`") : 'messages', " didn't resolve to a string. If you want to format rich text, use `t.rich` instead.") );
    }
    return result;
  }
  translateFn.rich = translateBaseFn;

  // Augment `translateBaseFn` to return plain strings
  translateFn.markup = (key, values, formats) => {
    const result = translateBaseFn(key,
    // @ts-expect-error -- `MarkupTranslationValues` is practically a sub type
    // of `RichTranslationValues` but TypeScript isn't smart enough here.
    values, formats);

    // When only string chunks are provided to the parser, only
    // strings should be returned here. Note that we need a runtime
    // check for this since rich text values could be accidentally
    // inherited from `defaultTranslationValues`.
    if (typeof result !== 'string') {
      const error = new initializeConfig.IntlError(initializeConfig.IntlErrorCode.FORMATTING_ERROR, "`t.markup` only accepts functions for formatting that receive and return strings.\n\nE.g. t.markup('markup', {b: (chunks) => `<b>${chunks}</b>`})" );
      onError(error);
      return getMessageFallback({
        error,
        key,
        namespace
      });
    }
    return result;
  };
  translateFn.raw = key => {
    if (messagesOrError instanceof initializeConfig.IntlError) {
      // We have already warned about this during render
      return getMessageFallback({
        error: messagesOrError,
        key,
        namespace
      });
    }
    const messages = messagesOrError;
    try {
      return resolvePath(locale, messages, key, namespace);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, initializeConfig.IntlErrorCode.MISSING_MESSAGE, error.message);
    }
  };
  return translateFn;
}

/**
 * For the strictly typed messages to work we have to wrap the namespace into
 * a mandatory prefix. See https://stackoverflow.com/a/71529575/343045
 */
function resolveNamespace(namespace, namespacePrefix) {
  return namespace === namespacePrefix ? undefined : namespace.slice((namespacePrefix + '.').length);
}

const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * (365 / 12); // Approximation
const QUARTER = MONTH * 3;
const YEAR = DAY * 365;
const UNIT_SECONDS = {
  second: SECOND,
  seconds: SECOND,
  minute: MINUTE,
  minutes: MINUTE,
  hour: HOUR,
  hours: HOUR,
  day: DAY,
  days: DAY,
  week: WEEK,
  weeks: WEEK,
  month: MONTH,
  months: MONTH,
  quarter: QUARTER,
  quarters: QUARTER,
  year: YEAR,
  years: YEAR
};
function resolveRelativeTimeUnit(seconds) {
  const absValue = Math.abs(seconds);
  if (absValue < MINUTE) {
    return 'second';
  } else if (absValue < HOUR) {
    return 'minute';
  } else if (absValue < DAY) {
    return 'hour';
  } else if (absValue < WEEK) {
    return 'day';
  } else if (absValue < MONTH) {
    return 'week';
  } else if (absValue < YEAR) {
    return 'month';
  }
  return 'year';
}
function calculateRelativeTimeValue(seconds, unit) {
  // We have to round the resulting values, as `Intl.RelativeTimeFormat`
  // will include fractions like '2.1 hours ago'.
  return Math.round(seconds / UNIT_SECONDS[unit]);
}
function createFormatter(_ref) {
  let {
    formats,
    locale,
    now: globalNow,
    onError = initializeConfig.defaultOnError,
    timeZone: globalTimeZone
  } = _ref;
  function applyTimeZone(options) {
    var _options;
    if (!((_options = options) !== null && _options !== void 0 && _options.timeZone)) {
      if (globalTimeZone) {
        options = {
          ...options,
          timeZone: globalTimeZone
        };
      } else {
        onError(new initializeConfig.IntlError(initializeConfig.IntlErrorCode.ENVIRONMENT_FALLBACK, "The `timeZone` parameter wasn't provided and there is no global default configured. Consider adding a global default to avoid markup mismatches caused by environment differences. Learn more: https://next-intl-docs.vercel.app/docs/configuration#time-zone" ));
      }
    }
    return options;
  }
  function resolveFormatOrOptions(typeFormats, formatOrOptions) {
    let options;
    if (typeof formatOrOptions === 'string') {
      const formatName = formatOrOptions;
      options = typeFormats === null || typeFormats === void 0 ? void 0 : typeFormats[formatName];
      if (!options) {
        const error = new initializeConfig.IntlError(initializeConfig.IntlErrorCode.MISSING_FORMAT, "Format `".concat(formatName, "` is not available. You can configure it on the provider or provide custom options.") );
        onError(error);
        throw error;
      }
    } else {
      options = formatOrOptions;
    }
    return options;
  }
  function getFormattedValue(formatOrOptions, typeFormats, formatter, getFallback) {
    let options;
    try {
      options = resolveFormatOrOptions(typeFormats, formatOrOptions);
    } catch (error) {
      return getFallback();
    }
    try {
      return formatter(options);
    } catch (error) {
      onError(new initializeConfig.IntlError(initializeConfig.IntlErrorCode.FORMATTING_ERROR, error.message));
      return getFallback();
    }
  }
  function dateTime( /** If a number is supplied, this is interpreted as a UTC timestamp. */
  value,
  /** If a time zone is supplied, the `value` is converted to that time zone.
   * Otherwise the user time zone will be used. */
  formatOrOptions) {
    return getFormattedValue(formatOrOptions, formats === null || formats === void 0 ? void 0 : formats.dateTime, options => {
      options = applyTimeZone(options);
      return new Intl.DateTimeFormat(locale, options).format(value);
    }, () => String(value));
  }
  function dateTimeRange( /** If a number is supplied, this is interpreted as a UTC timestamp. */
  start, /** If a number is supplied, this is interpreted as a UTC timestamp. */
  end,
  /** If a time zone is supplied, the values are converted to that time zone.
   * Otherwise the user time zone will be used. */
  formatOrOptions) {
    return getFormattedValue(formatOrOptions, formats === null || formats === void 0 ? void 0 : formats.dateTime, options => {
      options = applyTimeZone(options);
      return new Intl.DateTimeFormat(locale, options).formatRange(start, end);
    }, () => [dateTime(start), dateTime(end)].join(' – '));
  }
  function number(value, formatOrOptions) {
    return getFormattedValue(formatOrOptions, formats === null || formats === void 0 ? void 0 : formats.number, options => new Intl.NumberFormat(locale, options).format(value), () => String(value));
  }
  function getGlobalNow() {
    if (globalNow) {
      return globalNow;
    } else {
      onError(new initializeConfig.IntlError(initializeConfig.IntlErrorCode.ENVIRONMENT_FALLBACK, "The `now` parameter wasn't provided and there is no global default configured. Consider adding a global default to avoid markup mismatches caused by environment differences. Learn more: https://next-intl-docs.vercel.app/docs/configuration#now" ));
      return new Date();
    }
  }
  function extractNowDate(nowOrOptions) {
    if (nowOrOptions instanceof Date || typeof nowOrOptions === 'number') {
      return new Date(nowOrOptions);
    }
    if ((nowOrOptions === null || nowOrOptions === void 0 ? void 0 : nowOrOptions.now) !== undefined) {
      return new Date(nowOrOptions.now);
    }
    return getGlobalNow();
  }
  function relativeTime( /** The date time that needs to be formatted. */
  date, /** The reference point in time to which `date` will be formatted in relation to.  */
  nowOrOptions) {
    try {
      const dateDate = new Date(date);
      const nowDate = extractNowDate(nowOrOptions);
      const seconds = (dateDate.getTime() - nowDate.getTime()) / 1000;
      const unit = typeof nowOrOptions === 'number' || nowOrOptions instanceof Date || (nowOrOptions === null || nowOrOptions === void 0 ? void 0 : nowOrOptions.unit) === undefined ? resolveRelativeTimeUnit(seconds) : nowOrOptions.unit;
      const value = calculateRelativeTimeValue(seconds, unit);
      return new Intl.RelativeTimeFormat(locale, {
        // `numeric: 'auto'` can theoretically produce output like "yesterday",
        // but it only works with integers. E.g. -1 day will produce "yesterday",
        // but -1.1 days will produce "-1.1 days". Rounding before formatting is
        // not desired, as the given dates might cross a threshold were the
        // output isn't correct anymore. Example: 2024-01-08T23:00:00.000Z and
        // 2024-01-08T01:00:00.000Z would produce "yesterday", which is not the
        // case. By using `always` we can ensure correct output. The only exception
        // is the formatting of times <1 second as "now".
        numeric: unit === 'second' ? 'auto' : 'always'
      }).format(value, unit);
    } catch (error) {
      onError(new initializeConfig.IntlError(initializeConfig.IntlErrorCode.FORMATTING_ERROR, error.message));
      return String(date);
    }
  }
  function list(value, formatOrOptions) {
    const serializedValue = [];
    const richValues = new Map();

    // `formatToParts` only accepts strings, therefore we have to temporarily
    // replace React elements with a placeholder ID that can be used to retrieve
    // the original value afterwards.
    let index = 0;
    for (const item of value) {
      let serializedItem;
      if (typeof item === 'object') {
        serializedItem = String(index);
        richValues.set(serializedItem, item);
      } else {
        serializedItem = String(item);
      }
      serializedValue.push(serializedItem);
      index++;
    }
    return getFormattedValue(formatOrOptions, formats === null || formats === void 0 ? void 0 : formats.list,
    // @ts-expect-error -- `richValues.size` is used to determine the return type, but TypeScript can't infer the meaning of this correctly
    options => {
      const result = new Intl.ListFormat(locale, options).formatToParts(serializedValue).map(part => part.type === 'literal' ? part.value : richValues.get(part.value) || part.value);
      if (richValues.size > 0) {
        return result;
      } else {
        return result.join('');
      }
    }, () => String(value));
  }
  return {
    dateTime,
    number,
    relativeTime,
    list,
    dateTimeRange
  };
}

exports.createBaseTranslator = createBaseTranslator;
exports.createFormatter = createFormatter;
exports.resolveNamespace = resolveNamespace;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var initializeConfig = require('./initializeConfig-c503e215.js');
var IntlContext = require('./IntlContext-b5cc6be8.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function IntlProvider(_ref) {
  let {
    children,
    defaultTranslationValues,
    formats,
    getMessageFallback,
    locale,
    messages,
    now,
    onError,
    timeZone
  } = _ref;
  const [messageFormatCache] = React.useState(() => new Map());

  // Memoizing this value helps to avoid triggering a re-render of all
  // context consumers in case the configuration didn't change. However,
  // if some of the non-primitive values change, a re-render will still
  // be triggered. Note that there's no need to put `memo` on `IntlProvider`
  // itself, because the `children` typically change on every render.
  // There's some burden on the consumer side if it's important to reduce
  // re-renders, put that's how React works.
  // See: https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#context-updates-and-render-optimizations
  const value = React.useMemo(() => ({
    ...initializeConfig.initializeConfig({
      locale,
      defaultTranslationValues,
      formats,
      getMessageFallback,
      messages,
      now,
      onError,
      timeZone
    }),
    messageFormatCache
  }), [defaultTranslationValues, formats, getMessageFallback, locale, messageFormatCache, messages, now, onError, timeZone]);
  return /*#__PURE__*/React__default.default.createElement(IntlContext.IntlContext.Provider, {
    value: value
  }, children);
}

exports.IntlProvider = IntlProvider;

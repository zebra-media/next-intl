'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var initializeConfig = require('./initializeConfig-c503e215.js');
var createFormatter = require('./createFormatter-81d7e598.js');
require('intl-messageformat');
require('react');

function createTranslatorImpl(_ref, namespacePrefix) {
  let {
    getMessageFallback,
    messages,
    namespace,
    onError,
    ...rest
  } = _ref;
  // The `namespacePrefix` is part of the type system.
  // See the comment in the function invocation.
  messages = messages[namespacePrefix];
  namespace = createFormatter.resolveNamespace(namespace, namespacePrefix);
  return createFormatter.createBaseTranslator({
    ...rest,
    onError,
    getMessageFallback,
    messages,
    namespace
  });
}

/**
 * Translates messages from the given namespace by using the ICU syntax.
 * See https://formatjs.io/docs/core-concepts/icu-syntax.
 *
 * If no namespace is provided, all available messages are returned.
 * The namespace can also indicate nesting by using a dot
 * (e.g. `namespace.Component`).
 */
function createTranslator(_ref) {
  let {
    getMessageFallback = initializeConfig.defaultGetMessageFallback,
    messages,
    namespace,
    onError = initializeConfig.defaultOnError,
    ...rest
  } = _ref;
  // We have to wrap the actual function so the type inference for the optional
  // namespace works correctly. See https://stackoverflow.com/a/71529575/343045
  // The prefix ("!") is arbitrary.
  return createTranslatorImpl({
    ...rest,
    onError,
    getMessageFallback,
    // @ts-expect-error `messages` is allowed to be `undefined` here and will be handled internally
    messages: {
      '!': messages
    },
    namespace: namespace ? "!.".concat(namespace) : '!'
  }, '!');
}

exports.IntlError = initializeConfig.IntlError;
exports.IntlErrorCode = initializeConfig.IntlErrorCode;
exports.initializeConfig = initializeConfig.initializeConfig;
exports.createFormatter = createFormatter.createFormatter;
exports.createTranslator = createTranslator;

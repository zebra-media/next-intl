'use strict';

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

let IntlErrorCode = /*#__PURE__*/function (IntlErrorCode) {
  IntlErrorCode["MISSING_MESSAGE"] = "MISSING_MESSAGE";
  IntlErrorCode["MISSING_FORMAT"] = "MISSING_FORMAT";
  IntlErrorCode["ENVIRONMENT_FALLBACK"] = "ENVIRONMENT_FALLBACK";
  IntlErrorCode["INSUFFICIENT_PATH"] = "INSUFFICIENT_PATH";
  IntlErrorCode["INVALID_MESSAGE"] = "INVALID_MESSAGE";
  IntlErrorCode["INVALID_KEY"] = "INVALID_KEY";
  IntlErrorCode["FORMATTING_ERROR"] = "FORMATTING_ERROR";
  return IntlErrorCode;
}({});
class IntlError extends Error {
  constructor(code, originalMessage) {
    let message = code;
    if (originalMessage) {
      message += ': ' + originalMessage;
    }
    super(message);
    _defineProperty(this, "code", void 0);
    _defineProperty(this, "originalMessage", void 0);
    this.code = code;
    if (originalMessage) {
      this.originalMessage = originalMessage;
    }
  }
}

function joinPath() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  return parts.filter(Boolean).join('.');
}

/**
 * Contains defaults that are used for all entry points into the core.
 * See also `InitializedIntlConfiguration`.
 */

function defaultGetMessageFallback(props) {
  return joinPath(props.namespace, props.key);
}
function defaultOnError(error) {
  console.error(error);
}

function validateMessagesSegment(messages, invalidKeyLabels, parentPath) {
  Object.entries(messages).forEach(_ref => {
    let [key, messageOrMessages] = _ref;
    if (key.includes('.')) {
      let keyLabel = key;
      if (parentPath) keyLabel += " (at ".concat(parentPath, ")");
      invalidKeyLabels.push(keyLabel);
    }
    if (messageOrMessages != null && typeof messageOrMessages === 'object') {
      validateMessagesSegment(messageOrMessages, invalidKeyLabels, joinPath(parentPath, key));
    }
  });
}
function validateMessages(messages, onError) {
  const invalidKeyLabels = [];
  validateMessagesSegment(messages, invalidKeyLabels);
  if (invalidKeyLabels.length > 0) {
    onError(new IntlError(IntlErrorCode.INVALID_KEY, "Namespace keys can not contain the character \".\" as this is used to express nesting. Please remove it or replace it with another character.\n\nInvalid ".concat(invalidKeyLabels.length === 1 ? 'key' : 'keys', ": ").concat(invalidKeyLabels.join(', '), "\n\nIf you're migrating from a flat structure, you can convert your messages as follows:\n\nimport {set} from \"lodash\";\n\nconst input = {\n  \"one.one\": \"1.1\",\n  \"one.two\": \"1.2\",\n  \"two.one.one\": \"2.1.1\"\n};\n\nconst output = Object.entries(input).reduce(\n  (acc, [key, value]) => set(acc, key, value),\n  {}\n);\n\n// Output:\n//\n// {\n//   \"one\": {\n//     \"one\": \"1.1\",\n//     \"two\": \"1.2\"\n//   },\n//   \"two\": {\n//     \"one\": {\n//       \"one\": \"2.1.1\"\n//     }\n//   }\n// }\n") ));
  }
}

/**
 * Enhances the incoming props with defaults.
 */
function initializeConfig(_ref) {
  let {
    getMessageFallback,
    messages,
    onError,
    ...rest
  } = _ref;
  const finalOnError = onError || defaultOnError;
  const finalGetMessageFallback = getMessageFallback || defaultGetMessageFallback;
  {
    if (messages) {
      validateMessages(messages, finalOnError);
    }
  }
  return {
    ...rest,
    messages,
    onError: finalOnError,
    getMessageFallback: finalGetMessageFallback
  };
}

exports.IntlError = IntlError;
exports.IntlErrorCode = IntlErrorCode;
exports.defaultGetMessageFallback = defaultGetMessageFallback;
exports.defaultOnError = defaultOnError;
exports.initializeConfig = initializeConfig;
exports.joinPath = joinPath;

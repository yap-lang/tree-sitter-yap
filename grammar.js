/**
 * @file YAP! grammer for tree-sitter
 * @author Valaphee <iam@valaphee.com>
 * @license Apache-2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "yap",

  rules: {
    source_file: ($) => $.record,

    expression: ($) =>
      choice(
        $.abstraction,
        $.application,
        $.access,
        $.number,
        $.string,
        $.record,
      ),
    abstraction: ($) =>
      prec.right(
        seq(
          "\\",
          field("parameter", $.identifier),
          field("body", $.expression),
        ),
      ),
    application: ($) =>
      prec.left(
        seq(field("function", $.expression), field("argument", $.expression)),
      ),

    access: ($) =>
      seq($.identifier, repeat(seq(".", field("field", $.identifier)))),
    number: (_) => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    string: ($) => seq('"', $.string_content, '"'),
    string_content: ($) => /[^"]*/,
    record: ($) => seq($._indent, repeat($.record_field), $._dedent),
    record_field: ($) =>
      seq(
        field("field", $.identifier),
        ":",
        field("value", $.expression),
        $._newline,
      ),

    comment: (_) => token(seq("#", /.*/)),
    identifier: (_) => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
  },

  externals: ($) => [$._indent, $._dedent, $._newline],

  extras: ($) => [$.comment, /[\s]/],

  inline: ($) => [$.expression],

  supertypes: ($) => [$.expression],

  word: ($) => $.identifier,
});

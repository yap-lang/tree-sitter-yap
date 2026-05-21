/**
 * @file Yap grammer for tree-sitter
 * @author Valaphee <iam@valaphee.com>
 * @license Apache-2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: 'yap',

  rules: {
    source_file: ($) => $.record,

    _expression: ($) =>
      choice(
        $.abstraction,
        $.application,
        $.reference,
        $.number,
        $.string,
        $.record,
      ),
    _expression_primary: ($) =>
      choice(
        $.reference,
        $.number,
        $.string,
        $.record,
        seq('(', $._expression, ')'),
      ),

    abstraction: ($) =>
      prec.right(
        seq(
          '\\',
          field('parameter', $.identifier),
          field('body', $._expression),
        ),
      ),
    application: ($) =>
      prec.left(
        seq(
          field('function', $._expression),
          field('argument', $._expression_primary),
        ),
      ),

    reference: ($) =>
      choice(
        seq(
          field('variable', $.identifier),
          repeat(seq(token.immediate('.'), field('property', $.identifier))),
        ),
        seq(
          '.',
          field('property', $.identifier),
          repeat(seq(token.immediate('.'), field('property', $.identifier))),
        ),
      ),

    number: (_) => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    string: (_) => /"([^"\r\n]|\\.)*"/,
    record: ($) => seq($._indent, repeat($.record_field), $._dedent),
    record_field: ($) =>
      seq(
        field('field', $.identifier),
        ':',
        field('value', $._expression),
        $._newline,
      ),

    comment: (_) => token(seq('#', /.*/)),

    identifier: (_) => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
  },

  externals: ($) => [$._indent, $._dedent, $._newline],

  extras: ($) => [$.comment, /[\s]/],

  word: ($) => $.identifier,
});

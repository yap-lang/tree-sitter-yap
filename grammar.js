/**
 * @file YAP! grammar for tree-sitter
 * @author Valaphee <valaphee@valaphee.com>
 * @license Apache-2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'yap',

  extras: $ => [
    $.comment,
    /[\r\n\t ]/,
  ],

  conflicts: $ => [
    [$.array, $.array_associative],
  ],

  externals: $ => [
    $._indent,
    $._dedent,
    $._newline,
  ],

  word: $ => $.identifier,

  supertypes: $ => [
    $._expression,
  ],

  rules: {
    file: $ => repeat($._statement),
    body: $ => seq(
      $._indent,
      repeat($._statement),
      $._dedent,
    ),
    _statement: $ => choice(
      seq(
        choice(
          $._expression,
          $.assignment,
        ),
        $._newline,
      ),
      $.if,
    ),

    assignment: $ => prec(-1, seq(
      field('name', $.variable),
      optional(field('type', $._expression)),
      ':',
      field('body', $._expression),
    )),

    if: $ => seq(
      'if',
      field('condition', $._expression),
      ':',
      field('body', $.body),
      repeat($.elif),
      optional($.else),
    ),
    elif: $ => seq(
      'elif',
      field('condition', $._expression),
      ':',
      field('body', $.body),
    ),
    else: $ => seq(
      'else',
      ':',
      field('body', $.body),
    ),

    _expression: $ => choice(
      $.variable,
      $.number, // TODO: always invalid as type
      $.string, // TODO: always invalid as type
      $.array, // TODO: always invalid as condition
      $.array_associative, // TODO: always invalid as condition
      $.call,
      $.body,
    ),
    identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
    variable: $ => seq($.identifier, repeat(seq('.', field('property', $.identifier)))),
    number: _ => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    string: $ => seq('"', '"'),
    array: $ => seq('(', optional(sep1(',', $._expression)), ')'),
    array_associative: $ => seq(
      '(',
      optional(sep1(',', seq(
        field('name', $.identifier),
        ':',
        field('body', $._expression),
      ))),
      ')',
    ),
    call: $ => prec.left(seq(
      field('argument', $._expression),
      field('function', $.identifier),
      optional(field('argument', $._expression)),
    )),

    comment: _ => token(seq('#', /.*/)),
  },
});

/**
 * Creates a rule that matches one-or-more occurences of a given rule separated by the separator.
 *
 * @param {RuleOrLiteral} separator - separator by which the rules are separated
 * @param {RuleOrLiteral} rule - rule to repeat, one or more times
 *
 * @returns {SeqRule}
 */
function sep1(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)));
}

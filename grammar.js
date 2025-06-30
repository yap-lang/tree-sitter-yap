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
    [$.expression_array, $.expression_array_associative],
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
    statements: $ => seq(
      $._indent,
      repeat($._statement),
      $._dedent,
    ),
    _statement: $ => choice(
      seq(
        choice(
          $.assignment,
          $._expression,
        ),
        $._newline,
      ),
      $.statement_if,
    ),

    assignment: $ => prec(-1, seq(
      field('name', $.variable),
      optional(field('type', $._expression)),
      ':',
      field('body', $._expression),
    )),

    statement_if: $ => seq(
      'if',
      field('cond', $._expression),
      ':',
      field('body', $.statements),
      repeat($.clause_elif),
      optional($.clause_else),
    ),
    clause_elif: $ => seq(
      'elif',
      field('cond', $._expression),
      ':',
      field('body', $.statements),
    ),
    clause_else: $ => seq(
      'else',
      ':',
      field('body', $.statements),
    ),

    _expression: $ => choice(
      $.variable,
      $.literal_number,
      $.literal_string,
      $.expression_array,
      $.expression_array_associative,
      $.expression_call,
      $.statements,
    ),
    variable: $ => seq($.identifier, repeat(seq('.', field('property', $.identifier)))),
    literal_number: _ => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    literal_string: $ => seq('"', '"'),
    expression_array: $ => seq('(', optional(sep1(',', $._expression)), ')'),
    expression_array_associative: $ => seq(
      '(',
      optional(sep1(',', seq(
        field('name', $.identifier),
        ':',
        field('body', $._expression),
      ))),
      ')',
    ),
    expression_call: $ => prec.left(seq(
      field('argument', $._expression),
      field('function', $.identifier),
      optional(field('argument', $._expression)),
    )),

    identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
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

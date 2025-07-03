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
    /[\s]/,
  ],

  externals: $ => [
    $._indent,
    $._dedent,
    $._newline,
  ],

  word: $ => $.word,

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
          $.statement_return,
        ),
        $._newline,
      ),
      $.statement_if,
      $.statement_while,
    ),

    assignment: $ => seq(
      field('name', $.name),
      optional(field('type', $._expression)),
      ':',
      field('body', choice($._expression, $.statements)),
    ),
    statement_return: $ => seq(
      'return',
      field('body', $._expression),
    ),

    statement_if: $ => seq(
      'if',
      field('cond', $._expression),
      ':',
      field('body', $.statements),
      repeat($.statement_elif),
      optional($.statement_else),
    ),
    statement_elif: $ => seq(
      'elif',
      field('cond', $._expression),
      ':',
      field('body', $.statements),
    ),
    statement_else: $ => seq(
      'else',
      ':',
      field('body', $.statements),
    ),
    statement_while: $ => seq(
      'while',
      field('cond', $._expression),
      ':',
      field('body', $.statements),
    ),

    _expression: $ => choice(
      $.literal_number,
      $.literal_string,
      $.expression_unit,
      $.expression_array,
      $.expression_array_associative,
      $.expression_call,
    ),
    literal_number: _ => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    literal_string: $ => seq('"', $.string_content, '"'),
    string_content: $ => /[^"]*/,
    expression_unit: $ => '()',
    expression_array: $ => seq('(', sep1(',', $._expression), ')'),
    expression_array_associative: $ => seq(
      '(',
      sep1(',', seq(
        field('name', $.name),
        ':',
        field('body', $._expression),
      )),
      ')',
    ),
    expression_call: $ => prec.left(seq(
      optional(field('args', $._expression)),
      field('name', $.name),
      optional(field('args', $._expression)),
    )),

    comment: _ => token(seq('#', /.*/)),
    word: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
    name: $ => seq($.word, repeat(seq('.', field('field', $.word)))),
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

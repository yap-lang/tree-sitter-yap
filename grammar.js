/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'yap',

  extras: $ => [
    $.comment,
    /[\r\n\t ]/,
  ],

  externals: $ => [
    $._indent,
    $._dedent,
    $._newline,
  ],

  conflicts: $ => [
    [$.array, $.array_associative],
  ],

  word: $ => $.identifier,

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
      ')'
    ),
    call: $ => prec.left(seq(
      field('argument', $._expression),
      field('function', $.identifier),
      optional(field('argument', $._expression)),
    )),

    identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,

    comment: _ => token(seq('#', /.*/)),
  },
});

function sep1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'yap',

  externals: $ => [$._indent, $._dedent, $._newline],

  conflicts: $ => [
    [$.array, $.array_associative],
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
          $.expression,
          $.assign,
          $.return,
        ),
        $._newline,
      ),
      $.if,
    ),

    assign: $ => seq(
      field('name', $.identifier),
      optional(field('type', $.array_associative)),
      ':',
      field('body', $.expression),
    ),

    if: $ => seq(
      'if',
      field('condition', $.expression),
      ':',
      field('body', $.body),
      repeat($.elif),
      optional($.else),
    ),
    elif: $ => seq(
      'elif',
      field('condition', $.expression),
      ':',
      field('body', $.body),
    ),
    else: $ => seq(
      'else',
      ':',
      field('body', $.body),
    ),

    return: $ => seq(
      'return',
      optional($.expression),
    ),

    expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.array,
      $.array_associative,
      $.call,
      $.body,
    ),
    identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
    number: _ => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    string: $ => seq('"', '"'),
    array: $ => seq('(', optional(sep1(',', $.expression)), ')'),
    array_associative: $ => seq('(', optional(sep1(',', seq($.identifier, ':', $.expression))), ')'),
    call: $ => prec.left(seq(
      field('argument', $.expression),
      field('function', $.identifier),
      optional(field('argument', $.expression)),
    )),
  },
});

function sep1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

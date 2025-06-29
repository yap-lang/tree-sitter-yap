/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'yap',

  externals: $ => [$._indent, $._dedent, $._newline],

  rules: {
    file: $ => repeat($._statement),
    body: $ => seq(
      $._indent,
      repeat($._statement),
      $._dedent
    ),
    _statement: $ => choice(
      seq(
        choice(
          $.expression,
          $.assign_statement,
          $.return_statement,
        ),
        $._newline,
      ),
      $.if_statement,
    ),

    assign_statement: $ => seq(
      field('variable', $.identifier),
      ':',
      field('value', $.expression),
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $.expression),
      ':',
      field('body', $.body),
      repeat($.elif_clause),
      optional($.else_clause),
    ),
    elif_clause: $ => seq(
      'elif',
      field('condition', $.expression),
      ':',
      field('body', $.body),
    ),
    else_clause: $ => seq(
      'else',
      ':',
      field('body', $.body),
    ),

    return_statement: $ => seq(
      'return',
      optional($.expression),
    ),

    expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.call,
      $.body,
    ),
    identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
    number: _ => /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
    string: $ => seq('"', $.string_content, '"'),
    string_content: _ => token(prec(-1, /(?:[^"\\]|\\.)*/)),
    call: $ => prec.left(seq(
      field('argument', $.expression),
      field('function', $.identifier),
      optional(field('argument', $.expression)),
    )),
  },
});

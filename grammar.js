/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'yap',

  externals: $ => [$._indent, $._dedent, $._newline],

  rules: {
    module: $ => repeat($._statement),

    statements: $ => seq($._indent, repeat($._statement), $._dedent),
    _statement: $ => choice(
      seq(
        choice(
          $.assign_statement,
          $.return_statement,
        ),
        $._newline,
      ),
      $.if_statement,
    ),

    assign_statement: $ => seq(
      field('lhs', $.identifier),
      '=',
      field('rhs', $.expression),
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $.expression),
      ':',
      field('then', $.statements),
      repeat(field('otherwise', $.elif_clause)),
      optional(field('otherwise', $.else_clause)),
    ),
    elif_clause: $ => seq(
      'elif',
      field('condition', $.expression),
      ':',
      field('then', $.statements),
    ),
    else_clause: $ => seq(
      'else',
      ':',
      field('then', $.statements),
    ),

    return_statement: $ => seq(
      'return',
      optional($.expression),
    ),

    expression: $ => choice($.identifier),
    identifier: (_) => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
  },
});

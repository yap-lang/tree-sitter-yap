/**
 * @file YAP! Programming language
 * @author Valaphee <valaphee@valaphee.com>
 * @license Apache-2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "yap",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});

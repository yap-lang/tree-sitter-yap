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
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});

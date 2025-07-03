(name field: (_)? @property) @variable

(assignment name: (_) @function.definition type: (expression_unit))
(assignment name: (_) @function.definition type: (expression_array_associative))
(expression_call args: (_) name: (_) @function)

((name) @type (#match? @type "^[A-Z]"))
((name) @type.builtin (#match? @type.builtin "^(?:[ui](?:64|32|16|8)|f(?:64|32)|any)$"))

(literal_number) @number
(literal_string) @string

[
  "return"
  "if"
  "elif"
  "else"
  "while"
] @keyword

[
  ":"
] @operator

[
  "."
  ","
] @punctuation.delimiter

[
  "("
  ")"
] @punctuation.bracket

(comment) @comment

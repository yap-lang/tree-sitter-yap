(variable property: (_)? @property) @variable
((variable) @type (#match? @type "^_*[A-Z][A-Za-z0-9_]*$"))
(literal_number) @number
(literal_string) @string
(expression_call function: (_) @function.call)

[
  "if"
  "elif"
  "else"
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

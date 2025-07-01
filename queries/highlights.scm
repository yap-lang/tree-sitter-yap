(identifier property: (_)? @property) @variable
((identifier) @type (#match? @type "^_*[A-Z][A-Za-z0-9_]*$"))
(literal_number) @number
(literal_string) @string
(expression_call function: (_) @function.call)

[
  "if"
  "elif"
  "else"
  "for"
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

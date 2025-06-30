(variable property: (_)? @property) @variable
((variable) @constant (#match? @constant "^_*[A-Z][A-Z\\d_]*$"))
((variable) @type (#match? @type "^_*[A-Z][A-Za-z0-9_]*$"))
(number) @number
(string) @string
(call function: (_) @function.call)

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

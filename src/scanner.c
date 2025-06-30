#include "tree_sitter/parser.h"
#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"

enum TokenType {
  INDENT,
  DEDENT,
  NEWLINE,
};

typedef struct {
    Array(uint16_t) indents;
} Scanner;

void * tree_sitter_yap_external_scanner_create() {
    Scanner *scanner = ts_calloc(1, sizeof(Scanner));
    array_push(&scanner->indents, 0);
    return scanner;
}

void tree_sitter_yap_external_scanner_destroy(void *payload) {
    Scanner *scanner = (Scanner *)payload;
    array_delete(&scanner->indents);
    ts_free(scanner);
}

unsigned tree_sitter_yap_external_scanner_serialize(void *payload, char *buffer) {
    Scanner *scanner = (Scanner *)payload;
    size_t size = 0;

    for (uint32_t i = 1; i < scanner->indents.size && size < TREE_SITTER_SERIALIZATION_BUFFER_SIZE; i++) {
        uint16_t indent = *array_get(&scanner->indents, i);
        buffer[size++] = (char)(indent & 0xFF);
        buffer[size++] = (char)((indent >> 8) & 0xFF);
    }

    return size;
}

void tree_sitter_yap_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
    Scanner *scanner = (Scanner *)payload;
    array_delete(&scanner->indents);
    array_push(&scanner->indents, 0);

    if (length > 0) {
        size_t size = 0;

        for (; size + 1 < length; size += 2) {
            uint16_t indent = (unsigned char)buffer[size] | ((unsigned char)buffer[size + 1] << 8);
            array_push(&scanner->indents, indent);
        }
    }
}

bool tree_sitter_yap_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    Scanner *scanner = (Scanner *)payload;

    lexer->mark_end(lexer);

    bool eol = false;
    uint16_t indent = 0;
    for (;;) {
        if (lexer->lookahead == ' ') {
            indent += 1;
            lexer->advance(lexer, true);
        } else if (lexer->lookahead == '\t') {
            indent += 4;
            lexer->advance(lexer, true);
        } else if (lexer->lookahead == '\r' || lexer->lookahead == '\n') {
            eol = true;
            indent = 0;
            lexer->advance(lexer, true);
        } else if (lexer->eof(lexer)) {
            indent = 0;
            eol = true;
            break;
        } else {
            break;
        }
    }

    if (eol) {
        uint16_t current_indent = *array_back(&scanner->indents);
        if (valid_symbols[INDENT] && indent > current_indent) {
            array_push(&scanner->indents, indent);
            lexer->result_symbol = INDENT;
            return true;
        }
        if (valid_symbols[DEDENT] && indent < current_indent) {
            array_pop(&scanner->indents);
            lexer->result_symbol = DEDENT;
            return true;
        }
        if (valid_symbols[NEWLINE]) {
            lexer->result_symbol = NEWLINE;
            return true;
        }
    }

    return false;
}

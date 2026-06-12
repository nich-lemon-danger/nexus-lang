class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}
class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }
  peek(offset = 0) { return this.input[this.position + offset] || null; }
  advance() {
    const char = this.input[this.position];
    this.position++;
    if (char === '\n') { this.line++; this.column = 1; } else { this.column++; }
    return char;
  }
  skipWhitespace() { while (this.peek() && /\s/.test(this.peek())) this.advance(); }
  readString(quote) {
    this.advance();
    let value = '';
    while (this.peek() && this.peek() !== quote) value += this.advance();
    this.advance();
    return value;
  }
  readNumber() {
    let value = '';
    while (this.peek() && /[0-9.]/.test(this.peek())) value += this.advance();
    return value;
  }
  readIdentifier() {
    let value = '';
    while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek())) value += this.advance();
    return value;
  }
  tokenize() {
    const keywords = { 'fn':'FUNCTION','let':'LET','const':'CONST','if':'IF','else':'ELSE','while':'WHILE','for':'FOR','return':'RETURN','true':'TRUE','false':'FALSE','null':'NULL','async':'ASYNC','await':'AWAIT','int':'INT','string':'STRING','bool':'BOOL' };
    while (this.position < this.input.length) {
      this.skipWhitespace();
      if (this.position >= this.input.length) break;
      const char = this.peek();
      if (char === '"' || char === "'") {
        this.tokens.push(new Token('STRING', this.readString(char), this.line, this.column));
      } else if (/[0-9]/.test(char)) {
        this.tokens.push(new Token('NUMBER', this.readNumber(), this.line, this.column));
      } else if (/[a-zA-Z_]/.test(char)) {
        const value = this.readIdentifier();
        this.tokens.push(new Token(keywords[value] || 'IDENTIFIER', value, this.line, this.column));
      } else {
        const symbols = { '{':'LBRACE','}':'RBRACE','(':'LPAREN',')':'RPAREN',';':'SEMICOLON',':':'COLON',',':'COMMA','+':'PLUS','-':'MINUS','*':'STAR','/':'SLASH','=':'EQUALS','<':'LT','>':'GT' };
        if (symbols[char]) this.tokens.push(new Token(symbols[char], char, this.line, this.column));
        this.advance();
      }
    }
    return this.tokens;
  }
}
module.exports = Lexer;

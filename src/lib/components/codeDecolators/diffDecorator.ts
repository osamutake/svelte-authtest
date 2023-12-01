import { type Decolator, type CodeBlock, callDecolatorChain, escapeHtml } from '../codeRenderer';
import { decolatorsInfo } from './codeDecolatorInfo';

export function diffDecorator(chain: Decolator[], block: CodeBlock) {
  if (!block.info.includes('diff')) {
    return callDecolatorChain(chain, block);
  }

  // remove "diff"
  const i = block.info.indexOf('diff');
  block.info.splice(i, 1);

  // 先頭文字を marks に切り出す
  const lines = block.code.split(/\r\n?|\n/);
  const marks = lines.map((line) => line.substring(0, 1));
  block.code = lines.map((line) => line.substring(1)).join('\n');

  // 後続のデコレータがあれば呼び出す
  block = callDecolatorChain(chain, block);

  // マークを付ける
  block.codeClasses.push('diff-lines');
  block.code = block.code
    .split('\n')
    .map((line, i) => `<span class="diff-line" data-mark="${escapeHtml(marks[i])}">${line}</span>`)
    .join('\n');

  return block;
}

decolatorsInfo.push({
  name: 'diff',

  description: `diff を指定すると各行の先頭文字が +/- の場合にその行に色が付く。`,

  css: `/* diff */
.article code.line-numbered {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(1fr);
  position: relative;
}
.article span.diff-line::before {
  content: attr(data-mark);
  position: absolute;
  margin-left: -2em;
  text-weight: bold;
}
.article span.diff-line {
  padding-left: 3em;
  margin-left: -1em;
  margin-right: -1em;
  display: block;
  min-height: 1lh;
}
.article span.diff-line:not([data-mark=" "])::before {
  color: #ff0;
}
.article span.diff-line[data-mark="+"]::before {
  color: #0f0;
}
.article span.diff-line[data-mark="-"]::before {
  color: #f00;
}
.article span.diff-line:not([data-mark=" "]) {
  background-color: rgba(100,100,0,0.2);
}
.article span.diff-line[data-mark="+"] {
  background-color: rgba(0,100,0,0.2);
}
.article span.diff-line[data-mark="-"] {
  background-color: rgba(100,0,0,0.2);
}
`,
});

import { type Decolator, type CodeBlock, callDecolatorChain } from '../codeRenderer';
import { decolatorsInfo } from './codeDecolatorInfo';

const regex = /^(?:line)?num(?:ber)?(?:\((.+)\))?$/;

export function numDecorator(chain: Decolator[], block: CodeBlock) {
  if (!block.info.find((elem) => elem.match(regex))) {
    return callDecolatorChain(chain, block);
  }

  // remove "num(...)"
  const i = block.info.findIndex((elem) => elem.match(regex));
  const params = block.info[i].match(regex)![1].split(/\s*,\s*/);
  block.info.splice(i, 1);

  const marks: [number, number][] = [];
  params.forEach((param) => {
    const m = param.match(/^(\d+)(?:-(\d+))?/);
    if (m) marks.push([Number(m[1]), Number(m[2] || m[1])]);
  });
  marks.sort(([a], [b]) => a - b);

  let number = 1;

  // 後続のデコレータがあれば呼び出す
  block = callDecolatorChain(chain, block);

  // マークを付ける
  block.codeClasses.push('line-numbered');
  block.code = block.code
    .split('\n')
    .map((line) => {
      let mark = false;
      while (marks[0] && marks[0][0] <= number) {
        mark = number <= marks[0][1];
        if (mark) {
          break;
        } else {
          marks.shift();
        }
      }
      return `<span class="line-number${
        mark ? ' line-number-marked' : ''
      }" data-number="${number++}">${line}</span>`;
    })
    .join('\n');

  return block;
}

decolatorsInfo.push({
  name: 'num',

  description: `num を指定すると各行に行番号が入る。num(1,10-15) のように行番号や行番号の範囲をカンマ区切りで指定すると指定行が強調表示される。`,

  css: `/* num */
.article code.line-numbered {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(1fr);
  position: relative;
}
.article span.line-number::before {
  content: attr(data-number)":";
  margin-left: -3.6em;
  display: block;
  width: 2.5em;
  height: auto;

  text-align: right;
  position: absolute;
  color:cadetblue;
}
.article span.line-number {
  padding-left: 3.5em;
  display: block;
  min-height: 1lh;
  margin-left: -1em;
  margin-right: -1em;
}
.article span.line-number-marked {
  background-color: rgba(60,60,0);
}
`,
});

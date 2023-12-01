import { type Decolator, type CodeBlock, callDecolatorChain } from '../codeRenderer';
import { decolatorsInfo } from './codeDecolatorInfo';

// rows(行数) を処理して block.maxRows を設定する

export function rowsDecorator(chain: Decolator[], block: CodeBlock) {
  const i = block.info.findIndex((item) => item.match(/^rows\((\d+)\)$/));
  if (i >= 0) {
    const m = block.info[i].match(/^rows\((\d+)\)$/)!;
    if (m) {
      block.maxRows = Number(m[1]);
    }
    block.info.splice(i, 1);
  }
  return callDecolatorChain(chain, block);
}

decolatorsInfo.push({
  name: 'rows',

  description: `rows(40) とすると最大表示行数が40行になる。標準は30行。`,

  css: ``,
});

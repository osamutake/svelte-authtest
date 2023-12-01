import { rowsDecorator } from './codeDecolators/rowsDecorator';
import { numDecorator } from './codeDecolators/numDecorator';
import { diffDecorator } from './codeDecolators/diffDecorator';
import { splitterDecorator } from './codeDecolators/splitterDecorator';
import { highlightDecorator } from './codeDecolators/highlightDecorator';

// HTML の特殊文字をエスケープ
// https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
export function escapeHtml(text: string) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (c) => map[c as keyof typeof map]);
}

function unescapeHtml(text: string) {
  const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'" };
  return text.replace(/&(?:amp|lt|gt|quot|#039);/g, (code) => map[code as keyof typeof map]);
}

//====================
// CodeBlockDecolator

export declare type CodeBlock = {
  code: string;
  info: string[];
  params: string[];
  tags: string[];
  codeClasses: string[];
  maxRows?: number;
  rawHtml?: string; // ここに代入されればそのままそれを出力する
};

// デコレータ鎖は先頭から実行される
export declare type Decolator = (chain: Decolator[], block: CodeBlock) => CodeBlock;

const decolators: Decolator[] = [
  rowsDecorator,
  numDecorator,
  diffDecorator,
  splitterDecorator, // 行ごとに分けられるようにするため改行の前後でタグを閉じる・開く
  highlightDecorator, // highlight.js を呼び出す
];

export function callDecolatorChain(chain: Decolator[], block: CodeBlock) {
  const first = chain[0];
  return first ? first(chain.slice(1), block) : block;
}

//====================
// code ブロックをレンダリングする

export const codeRenderer = {
  renderer: {
    code: (code: string, infoString = '', escaped: boolean) => {
      if (escaped) {
        code = unescapeHtml(code);
      }

      // infoString は info param0 param1 param2
      // info は some:some:some
      const params = infoString.split(' ');
      const info = params.length ? params.shift()!.split(':') : [];
      const block = callDecolatorChain(decolators, {
        code,
        info,
        params,
        tags: [],
        codeClasses: [],
      });

      return block.rawHtml
        ? block.rawHtml
        : `<pre class="marked-code">` +
            (block.tags.length ? `<span class="tags">${block.tags.join(' ')}</span>` : '') +
            `<code class="${block.codeClasses.join(' ')}" style="max-height:${
              block.maxRows || 30
            }lh">${block.code}</code>` +
            `</pre>`;
    },
  },
};

import { type Decolator, type CodeBlock, callDecolatorChain, escapeHtml } from '../codeRenderer';
import { decolatorsInfo } from './codeDecolatorInfo';
import hljs from 'highlight.js';
import hljs_svelte from 'highlightjs-svelte';

// hljs にプラグインを追加
hljs_svelte(hljs);

// highlight.js の言語名あるいはエイリアス名から正式な言語名を調べる
const aliasToLang: { [alias: string]: string } = {};
hljs.listLanguages().forEach((name) => {
  const lang = hljs.getLanguage(name);
  aliasToLang[name] = name;
  lang?.aliases?.forEach((alias) => {
    aliasToLang[alias] = name;
  });
});

// デコレータ本体
export function highlightDecorator(chain: Decolator[], block: CodeBlock) {
  // 後続のデコレータがもしあれば呼び出す
  block = callDecolatorChain(chain, block);

  // 言語名やファイル名を探す
  let i = block.info.findIndex((item) => aliasToLang[item]);
  let lang = '';
  let file = '';
  if (i >= 0) {
    lang = aliasToLang[block.info[i]];
    block.info.splice(i, 1);
    file = block.info.shift() || '';
  } else if ((i = block.info.findIndex((item) => aliasToLang[item.replace(/.*\./, '')])) >= 0) {
    file = block.info[i];
    lang = aliasToLang[file.replace(/.*\./, '')];
  }

  // ハイライトする
  const result = lang
    ? hljs.highlight(block.code, { language: lang, ignoreIllegals: true })
    : hljs.highlightAuto(block.code);

  // 言語名は定まったか？
  lang = lang || result.language || '';

  // 情報を返す
  block.codeClasses.push('hljs');
  if (lang) {
    block.codeClasses.push(`language-${escapeHtml(lang)}`);
    block.tags.push(`<span class="language">${escapeHtml(lang)}</span>`);
  }
  if (file) {
    block.tags.push(`<span class="filename">${escapeHtml(file)}</span>`);
  }

  // 必要に応じてエンコードする
  if (result.value && result.value !== block.code) {
    block.code = result.value;
  } else {
    block.code = escapeHtml(block.code);
  }

  return block;
}

decolatorsInfo.push({
  name: 'highlight',

  description: `js や basic のように言語名を指定すると、その言語として解釈してハイライト表示する。
example.c のようにファイル名を指定すると冒頭にファイル名を表示する。ファイルの拡張子は言語名を類推にも使われる。`,

  css: `/* highlight */
.article .tags span.language {
  background-color: #ccc;
  color: black;
  border-radius: 16px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: small;
  margin-right: 0.5em;
  float: right;
}

/* language specific */

/* コマンド行以外をグレーにする */

.hljs.language-shell {
  color: #aaa;
}
.hljs.language-shell .language-bash {
  color: #fff;
}
`,
});

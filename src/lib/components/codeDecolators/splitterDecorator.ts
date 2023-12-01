import { type Decolator, type CodeBlock, callDecolatorChain } from '../codeRenderer';

// 改行をまたいだ <span> があると困るので改行の前後でタグを開きなおすよう書き換える

const uptoTagRegexp =
  /^((?:[^<]|[\n\r])*?)(<([A-Za-z]+)(?:[\n\r\s](?:[\n\r]|[^>"']|"[^"]*"|'[^']*')*?)?(\/?)>|<\/([A-Za-z]+)>)/;

function closeTagsBeforeBreak(str: string) {
  let result = '';
  const openTags = [] as { name: string; tag: string }[];
  let m: RegExpMatchArray | null = null;
  while ((m = str.match(uptoTagRegexp))) {
    const [whole, text, tag, name, closed, name2] = m;

    if (text.match(/\r\n?|(?<!\r)\n/)) {
      // 改行があれば閉じタグ改行開きタグに置き換える
      const close = openTags
        .reverse()
        .map((item) => `</${item.name}>`)
        .join('');
      const open = openTags
        .reverse()
        .map((item) => item.tag)
        .join('');
      result += text.replaceAll(/\r\n?|\n/g, close + '\n' + open);
    } else {
      result += text;
    }

    result += tag;
    if (name) {
      // 開きタグ
      if (!closed) {
        // 自己完結していない
        openTags.push({ name, tag });
      }
    } else if (name2) {
      // 閉じタグ
      const last = openTags.pop();
      if (last?.name != name2) {
        throw new Error(`開き括弧と閉じ括弧が一致していません: '${last?.name}' のはずが '${name2}' でした
${str}`);
      }
    }
    // result += `[${openTags.length}]`; // for debug
    str = str.substring(whole.length); // 切り詰める
  }
  if (openTags.length) {
    throw new Error(
      `開き括弧と閉じ括弧が一致していません: 閉じ括弧が ${openTags.length} 個足りません\n` +
        openTags.map((item) => item.tag).join('\n')
    );
  }
  return result + str;
}

// デコレータ本体
export function splitterDecorator(chain: Decolator[], block: CodeBlock) {
  // 後続のデコレータがもしあれば呼び出す
  block = callDecolatorChain(chain, block);

  // 行ごとにタグを閉じる
  block.code = closeTagsBeforeBreak(block.code);

  return block;
}

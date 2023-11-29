import { createTransport, type SentMessageInfo, type SendMailOptions } from 'nodemailer';
import { env } from '$env/dynamic/private';
import * as fs from 'fs';

export const transporter = createTransport({
  host: 'localhost',
  port: 25,
});

// 開発環境やテスト環境なら実際にはメールを送らずに
// コンソールへ表示 ＆ test-results/mail-sent.txt へ保存
if (env.DATABASE_URL.match(/\b(dev|test)\.db$/)) {
  transporter.sendMail = async (mailOptions: SendMailOptions) => {
    console.log(mailOptions);
    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results', { mode: 0o755 });
    }
    fs.writeFileSync('test-results/mailOptions.txt', JSON.stringify(mailOptions));
    return null as SentMessageInfo;
  };
}

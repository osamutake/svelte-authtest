import { expect, test, type Page, type TestInfo } from '@playwright/test';
import type { SendMailOptions } from 'nodemailer';
import * as fs from 'fs';
import { db } from '../src/lib/server/db.js';

test.setTimeout(5000);

let testId = 0;
let screenshotId = 0;
let screenshotTitle = '';
async function screenshot(page: Page, info: TestInfo) {
  if (screenshotTitle != info.title) {
    testId++;
    screenshotTitle = info.title;
    screenshotId = 0;
  }
  await page.screenshot({
    path: `test-results/ss${testId.toString().padStart(4, '0')}-${info.title.replaceAll(
      '/',
      '_'
    )}${++screenshotId}.png`,
  });
}

test('データベースをクリアする', async () => {
  await db.emailVerification.deleteMany();
  await db.user.deleteMany();

  expect(await db.emailVerification.count()).toBe(0);
  expect(await db.user.count()).toBe(0);
});

test('インデックスページを表示できる', async ({ page }, info) => {
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.getByRole('heading', { name: 'Welcome to Svelte' })).toBeVisible();
  await screenshot(page, info);
});

test('/account/new のメールアドレスの検証', async ({ page }, info) => {
  await page.goto('/account/new', { waitUntil: 'load' });

  await page.locator('input[name="email"]').fill('');
  await page.locator('input[name="email"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText(
    'メールアドレスが不正です'
  );

  await page.locator('input[name="email"]').fill('abcd@');
  await page.locator('input[name="email"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText(
    'メールアドレスが不正です'
  );

  await page.locator('input[name="email"]').fill('@abcc');
  await page.locator('input[name="email"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText(
    'メールアドレスが不正です'
  );

  await screenshot(page, info);
});

test('メールアドレスを入力する /account/new', async ({ page }, info) => {
  await page.goto('/account/new', { waitUntil: 'load' });

  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="email"]').press('Enter');

  await expect(page.locator('form button')).not.toBeVisible();
  await page.waitForLoadState('load');
  await expect(page.url()).toBe('http://localhost:4173/');

  await expect(page.locator('.toaster .message')).toHaveText('メールを送信しました');
  await page.waitForTimeout(200);

  await screenshot(page, info);
});

test('連続して送ろうとするとエラーになる', async ({ page }, info) => {
  await page.goto('/account/new', { waitUntil: 'load' });

  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="email"]').press('Enter');

  await expect(page.locator('.toaster .message').nth(0)).toHaveText(
    '先ほどメールを送信しましたのでしばらく経ってから試してください'
  );
  await screenshot(page, info);
});

test('サインアップを続ける', async ({ page }, info) => {
  const mailOptions = JSON.parse(
    fs.readFileSync('test-results/mailOptions.txt', 'utf-8')
  ) as SendMailOptions;
  await expect(mailOptions.text).toContain('http');
  await page.goto((mailOptions.text as string).split(/\n/)[1], { waitUntil: 'load' });
  await screenshot(page, info);

  await page.click('form button');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="name"]+label>.text-error')).toContainText('文字');

  await page.locator('input[name="name"]').fill('First Family');
  await page.locator('input[name="name"]').fill('First Family'); // 1回だと失敗することがある？？？
  await page.locator('input[name="name"]').press('Enter');
  await screenshot(page, info);
  await page.locator('form button').isEnabled();
  await screenshot(page, info);
  await expect(page.locator('input[name="name"]+label>.text-error')).not.toBeVisible();
  await expect(page.locator('input[name="password"]+label>.text-error')).toContainText('文字');

  await page.fill('input[name="password"]', 'aaaaaaaa');
  await page.click('form button');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="password"]+label>.text-error')).toContainText('文字');

  await page.fill('input[name="password"]', 'Aa1aaaaa');
  await page.click('form button');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="password"]+label>.text-error')).not.toBeVisible();
  await expect(page.locator('input[name="confirm"]+label>.text-error')).toContainText(
    '一致しません'
  );

  await page.fill('input[name="confirm"]', 'Aa1aaaaa');
  await screenshot(page, info);

  await page.click('form button');

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toHaveText(
    'サインアップ＆ログインしました'
  );
  await page.waitForTimeout(200);
  await screenshot(page, info);

  // ログアウトする
  await logout(page, info);

  await page.waitForTimeout(200);
  await screenshot(page, info);
});

async function logout(page: Page, info: TestInfo) {
  Promise.all([
    page.goto('/session/delete', { waitUntil: 'load' }),
    page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' }),
  ]);
  await expect(page.locator('.toaster .message').nth(0)).toHaveText('ログアウトしました');
  await page.waitForTimeout(200);
  await screenshot(page, info);
}

async function login(page: Page, email = 'test@example.com', password = 'Aa1aaaaa') {
  await page.goto('/session/new', { waitUntil: 'load' });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.locator('input[name="password"]').press('Enter'),
    page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' }),
  ]);

  await expect(page.locator('.toaster .message').nth(0)).toHaveText('ログインしました');
}

test('ログインしていないのにログアウトする', async ({ page }, info) => {
  await page.goto('/session/delete', { waitUntil: 'load' });

  await page.waitForNavigation({ url: 'http://localhost:4173/session/new', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toHaveText(
    'ログインユーザーのみアクセスできます'
  );
  await page.waitForTimeout(200);
  await screenshot(page, info);
});

test('ログインする', async ({ page }, info) => {
  // ログインする

  await page.goto('/session/new', { waitUntil: 'load' });
  await screenshot(page, info);

  await page.locator('input[name="email"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText(
    '入力して下さい'
  );

  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="email"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="password"]+label>.text-error')).toContainText(
    '入力して下さい'
  );

  await page.locator('input[name="password"]').fill('Aa1aaaaa');
  await screenshot(page, info);
  await page.locator('input[name="password"]').press('Enter');
  await screenshot(page, info);
  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toHaveText('ログインしました');
  await page.waitForTimeout(200);
  await screenshot(page, info);
});

test('名前やパスワードを変更する', async ({ page }, info) => {
  // ログイン
  await login(page);

  // 名前・パスワードを変更する（実際にはしない）
  await page.goto('/account/edit', { waitUntil: 'load' });
  await screenshot(page, info);

  await page.locator('input[name="name"]').press('Enter');
  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText('変更されませんでした');
  await page.waitForTimeout(200);
  await screenshot(page, info);

  // 名前を変更する
  await page.goto('/account/edit', { waitUntil: 'load' });

  await page.locator('input[name="name"]').fill('First Middle Family');
  await page.locator('input[name="name"]').fill('First Middle Family');
  await page.locator('input[name="name"]').press('Enter');
  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText('名前が変更されました');
  await page.waitForTimeout(200);
  await screenshot(page, info);

  // パスワードを変更する
  await page.goto('/account/edit', { waitUntil: 'load' });
  await screenshot(page, info);

  await page.locator('input[name="password"]').fill('Aa1aaaa');
  await page.locator('input[name="password"]').fill('Aa1aaaa');
  await page.locator('input[name="password"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="password"]+label>.text-error')).toContainText('文字');

  await page.locator('input[name="password"]').fill('Aa1aaaab');
  await page.locator('input[name="password"]').fill('Aa1aaaab');
  await page.locator('input[name="password"]').press('Enter');
  await page.locator('form button').isEnabled();
  await expect(page.locator('input[name="confirm"]+label>.text-error')).toContainText(
    '一致しません'
  );

  await page.locator('input[name="confirm"]').fill('Aa1aaaab');
  await page.locator('input[name="confirm"]').fill('Aa1aaaab');
  await page.locator('input[name="confirm"]').press('Enter');

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText(
    'パスワードが変更されました'
  );
  await page.waitForTimeout(200);
  await screenshot(page, info);

  // 名前とパスワードを変更する
  await page.goto('/account/edit', { waitUntil: 'load' });
  await screenshot(page, info);
  await expect(page.locator('input[name="name"]')).toHaveValue('First Middle Family');

  await page.locator('input[name="name"]').fill('First Family');
  await page.locator('input[name="name"]').fill('First Family');

  await page.locator('input[name="password"]').fill('Aa1aaaaa');
  await page.locator('input[name="password"]').fill('Aa1aaaaa');

  await page.locator('input[name="confirm"]').fill('Aa1aaaaa');
  await page.locator('input[name="confirm"]').fill('Aa1aaaaa');
  await screenshot(page, info);

  await page.locator('input[name="confirm"]').press('Enter');

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText(
    '名前とパスワードが変更されました'
  );
  await page.waitForTimeout(200);
  await screenshot(page, info);

  await logout(page, info);
});

test('メールアドレスを変更する', async ({ page }, info) => {
  // ログイン
  await login(page);

  await page.goto('/account/email', { waitUntil: 'load' });
  await screenshot(page, info);

  await page.locator('input[name="email"]').press('Enter');
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText('不正です');

  await page.locator('input[name="email"]').fill('changed@example.com');
  await page.locator('input[name="email"]').press('Enter');

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText('送信しました');
  await page.waitForTimeout(200);
  await screenshot(page, info);

  const mailOptions = JSON.parse(
    fs.readFileSync('test-results/mailOptions.txt', 'utf-8')
  ) as SendMailOptions;
  await expect(mailOptions.text).toContain('http');
  await page.goto((mailOptions.text as string).split(/\n/)[1], { waitUntil: 'load' });
  await screenshot(page, info);

  await expect(page.locator('input[name="name"]')).toHaveValue('First Family');
  await expect(page.locator('input[name="email-old"]')).toHaveValue('test@example.com');
  await expect(page.locator('input[name="email-new"]')).toHaveValue('changed@example.com');

  Promise.all([
    page.locator('form button').click(),
    page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' }),
  ]);

  await expect(page.locator('.toaster .message').nth(0)).toContainText('変更しました');
  await page.waitForTimeout(200);
  await screenshot(page, info);

  // ログアウト
  await logout(page, info);
});

test('新しいメールアドレスでログインしてから元に戻す', async ({ page }, info) => {
  await login(page, 'changed@example.com');

  await page.goto('/account/email', { waitUntil: 'load' });
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="email"]').fill('test@example.com');
  await Promise.all([
    page.locator('input[name="email"]').press('Enter'),
    page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' }),
  ]);
  await expect(page.locator('.toaster .message').nth(0)).toContainText('送信しました');

  const mailOptions2 = JSON.parse(
    fs.readFileSync('test-results/mailOptions.txt', 'utf-8')
  ) as SendMailOptions;
  await expect(mailOptions2.text).toContain('http');
  await page.goto((mailOptions2.text as string).split(/\n/)[1], { waitUntil: 'load' });
  await page.locator('form button').click();

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText('変更しました');

  await logout(page, info);
});

test('パスワードのリセットを行う', async ({ page }, info) => {
  await page.goto('/account/reset', { waitUntil: 'load' });
  await screenshot(page, info);

  await page.locator('input[name="email"]').press('Enter');
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText('不正です');

  await page.locator('input[name="email"]').fill('notfound@example.com');
  await page.locator('input[name="email"]').press('Enter');
  await expect(page.locator('input[name="email"]+label>.text-error')).toContainText(
    '登録されていません'
  );

  await page.locator('input[name="email"]').fill('test@example.com');
  Promise.all([
    page.locator('input[name="email"]').press('Enter'),
    page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' }),
  ]);

  await expect(page.locator('.toaster .message').nth(0)).toContainText('送信しました');
  await page.waitForTimeout(200);
  await screenshot(page, info);

  const mailOptions = JSON.parse(
    fs.readFileSync('test-results/mailOptions.txt', 'utf-8')
  ) as SendMailOptions;
  await expect(mailOptions.text).toContain('http');
  await page.goto((mailOptions.text as string).split(/\n/)[1], { waitUntil: 'load' });
  await screenshot(page, info);

  await expect(page.locator('input[name="name"]')).toHaveValue('First Family');
  await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');

  await page.locator('input[name="password"]').press('Enter');
  await expect(page.locator('input[name="password"]+label>.text-error')).toContainText('文字');

  await page.locator('input[name="password"]').fill('Aa1aaaaa');
  await page.locator('input[name="confirm"]').fill('Aa1aaaaa');
  await screenshot(page, info);
  await page.locator('input[name="confirm"]').press('Enter');

  await page.waitForNavigation({ url: 'http://localhost:4173/', waitUntil: 'load' });
  await expect(page.locator('.toaster .message').nth(0)).toContainText(
    'パスワードを変更してログインしました'
  );
  await page.waitForTimeout(200);
  await screenshot(page, info);
});

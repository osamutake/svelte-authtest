<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };
</script>

<div>
  <h1>サインアップ</h1>
  {#if $message}<span class="invalid">{$message}</span>{/if}
  <form method="POST" use:enhance>
    <label for="name">ユーザー名</label>
    <input type="text" name="name" bind:value={$form.name} disabled={$submitting} />
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

    <label for="email">メールアドレス</label>
    <input type="text" name="email" bind:value={$form.email} disabled={$submitting} />
    {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

    <label for="password">パスワード</label>
    <input type="password" name="password" bind:value={$form.password} disabled={$submitting} />
    {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

    <label for="confirm">パスワード（確認）</label>
    <input type="password" name="confirm" bind:value={$form.confirm} disabled={$submitting} />
    {#if $errors.confirm}<span class="invalid">{$errors.confirm}</span>{/if}

    <div><button disabled={$submitting}>サインアップ</button></div>
  </form>
</div>

<style>
  input {
    display: block;
    margin-bottom: 10px;
  }
  .invalid {
    color: red;
    display: block;
  }
</style>

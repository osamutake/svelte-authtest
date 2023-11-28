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
  <h1>ログイン</h1>
  {#if $message}<span class="invalid">{$message}</span>{/if}
  <form method="POST" use:enhance>
    <label for="email">ユーザー名</label>
    <input type="text" name="email" bind:value={$form.email} disabled={$submitting} />
    {#if $errors.email}<span class="invalid">{$errors.email[0]}</span>{/if}

    <label for="password">パスワード</label>
    <input type="password" name="password" bind:value={$form.password} disabled={$submitting} />
    {#if $errors.password}<span class="invalid">{$errors.password[0]}</span>{/if}

    <div><button disabled={$submitting}>ログイン</button></div>
  </form>
</div>

<style>
  input {
    display: block;
    margin-bottom: 10px;
  }
  .invalid {
    display: block;
    color: red;
  }
</style>

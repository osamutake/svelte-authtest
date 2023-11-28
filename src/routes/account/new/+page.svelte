<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<div>
  <h1>サインアップ</h1>

  {#if form?.message}<span class="invalid">{form.message}</span>{/if}

  <form method="POST">
    <label for="name">ユーザー名</label>
    <input type="text" name="name" />

    <label for="email">メールアドレス</label>
    <input type="text" name="email" />

    <label for="password">パスワード</label>
    <input type="password" name="password" />

    <label for="confirmPassword">パスワード（確認）</label>
    <input type="password" name="confirm" />

    <div><button>サインアップ</button></div>
  </form>
</div>

<style>
  input {
    display: block;
    margin-bottom: 10px;
  }
  .invalid {
    color: red;
  }
</style>

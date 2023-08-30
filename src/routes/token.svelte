<script lang="ts">
  import { onMount } from "svelte";
  import { gitlabClient } from "../store";
  import type { GitlabApi } from "$lib/gitlab.api";
  import Card from "./card.svelte";

  export let gitlabApi: GitlabApi
  let clientLoading = false;

  onMount(() => {
    gitlabApi.token = localStorage.getItem("g-t") ?? "";
    onCheckToken();
  });

  async function onCheckToken() {
    clientLoading = true;
    await gitlabApi.createClient();
    clientLoading = false;
  }
</script>

<Card>
  <div class="form-control">
    <label class="label" for="tes">
      <div class="font-bold">
        Enter Gitlab
        <a
          href="https://gitlab.webix.de/-/profile/personal_access_tokens"
          target="_blank"
        >
          <span class="badge badge-sm badge-accent whitespace-nowrap"
            >token</span
          >
        </a>
      </div>
    </label>

    <label class="input-group">
      <input
        type="text"
        id="token"
        placeholder="Gitlab token"
        class="input input-bordered input-sm w-96"
        bind:value={gitlabApi.token}
      />
      <button
        class="btn btn-sm"
        on:click={onCheckToken}
        class:btn-success={!!$gitlabClient}
      >
        {#if clientLoading}
          <span class="loading loading-ring loading-xs" />
        {:else}
          Check
        {/if}
      </button>
    </label>
  </div>
</Card>
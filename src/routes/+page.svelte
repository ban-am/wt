<script lang="ts">
  
  import { onMount } from 'svelte';
  import { clientStore } from '../store';
  import { GitlabApi } from '$lib/gitlab.api';

  let gitlabApi = new GitlabApi();
  let clientLoading = false;

  onMount(() => {
    gitlabApi.token = localStorage.getItem('g-t') ?? "";
    onCheckToken();
  })

  async function onCheckToken() {
    clientLoading = true;
    await gitlabApi.createClient();
    clientLoading = false;
  }

</script>

  <div class="card w-full bg-base-100 shadow-md">
    <div class="card-body">
      <div class="form-control">
        <label class="label" for="tes">
          <div class="font-bold">
            Enter Gitlab 
            <a href="https://gitlab.webix.de/-/profile/personal_access_tokens" target="_blank">
              <span class="badge badge-sm badge-accent whitespace-nowrap">token</span>
            </a>
          </div>
        </label>
      
      <label class="input-group">
        <input type="text" 
          id="token"
          placeholder="Gitlab token" 
          class="input input-bordered input-sm w-96"
          bind:value={gitlabApi.token}/>
          <slot name="buttons" />
          
      <button class="btn btn-sm" on:click={onCheckToken} class:btn-success={!!$clientStore}>
        {#if clientLoading}
          <span class="loading loading-ring loading-xs"></span>
        {:else}
          Check
        {/if}
      </button>
      </label>
      </div>
    </div>
  </div>


  
<!-- 
<div class="pb-4"></div>

<Card>

</Card> -->
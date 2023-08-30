<script lang="ts">
  import { eventFilter, eventSotre, gitlabClient } from "../store";
  import type { GitlabApi } from "$lib/gitlab.api";
    import { onMount } from "svelte";

  export let gitlabApi: GitlabApi;

  let filter =  $eventFilter;

  onMount(() => {
    gitlabClient.subscribe(() => {
      onSearch();
    });
  })

  let loadingEvents = false;

  async function onSearch() {
    eventFilter.set(filter);
    loadingEvents = true;
    var days = await gitlabApi.loadEvents();
    loadingEvents = false;

    if (days != null) {
      eventSotre.set(days)
    }
  }
</script>

<div class="card card-compact w-full bg-base-100 shadow-md">
  <div class="card-body">
    <label class="label" for="">
      <div class="font-bold">
        Gitlab event
        <a
          href="https://docs.gitlab.com/ee/api/events.html#list-currently-authenticated-users-events"
          target="_blank"
        >
          <span
            class="badge badge-sm badge-accent whitespace-nowrap"
            data-svelte-h="svelte-os5pxw">filters</span
          >
        </a>
      </div>
    </label>
    <div class="form-control">
      {#each Object.keys(filter) as key, i}
        <div class="pb-2">
          <label class="input-group">
            <input
              type="text"
              placeholder="Filter key"
              class="input input-bordered input-sm w-40"
              bind:value={key}
              disabled
            />
            <input
              type="text"
              placeholder="Filter value"
              class="input input-bordered input-sm w-40"
              bind:value={filter[key]}
            />
            <button class="btn btn-sm" on:click={() => {filter[key] = undefined;}}>
              clear
            </button>
          
          </label>
        </div>
      {/each}
    </div>
  </div>
</div>


<div class="pb-4"></div>

<div>
  <button class="btn btn-sm" on:click={onSearch}>
    {#if loadingEvents}
      <span class="loading loading-ring loading-xs" />
    {:else}
      Search
    {/if}
  </button>
</div>
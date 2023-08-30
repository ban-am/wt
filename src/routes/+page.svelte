<script lang="ts">
  import { GitlabApi } from "$lib/gitlab.api";
    import { gitlabClient } from "../store";
  import Filter from "./filter.svelte";
  import Token from "./token.svelte";
    import Events from "./events.svelte";

  let gitlabApi = new GitlabApi();
  

</script>

<Token gitlabApi={gitlabApi}></Token>

{#if !!$gitlabClient }
    
  <div class="pb-4"></div>

  <Filter gitlabApi={gitlabApi}></Filter>
 
  <div class="pb-4"></div>

  <Events/>

{/if}

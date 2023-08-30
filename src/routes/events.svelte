
<script lang="ts">
    import dayjs from "dayjs";
    import weekOfYear from "dayjs/plugin/weekOfYear";
    import { eventSotre } from "../store";
    import Icon from "@iconify/svelte";

dayjs.extend(weekOfYear);

  function getTime(dateStr: string) {
    var date = new Date(dateStr);
    var newDate = date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return dayjs(newDate).add(2, 'h')
  }

  async function copy(txt: string) {
    try {
      txt = txt.replaceAll("_", ' ');
      await navigator.clipboard.writeText(txt);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  let iconSize = "13px";

</script>

{#each $eventSotre as day}
    
<div class="card card-compact w-full bg-base-100 shadow-md mb-4 hover:shadow-xl ease-in-out duration-300">
  <div class="weekOfYear">
    week n. <strong>{dayjs(day.dateStr).week()}</strong>
  </div>
  <div class="card-body">
    <label class="label" for="tes">
      <div class="font-bold">
        <!-- <Icon icon="pajamas:calendar" /> -->
        <span class="badge badge-sm badge-accent whitespace-nowrap" style="border: none;">
          {dayjs(day.dateStr).format('DD. MM. YYYY (ddd)')}
        </span>
      </div>
    </label>

    {#each day.events as evn }
      <div class="flex pb-2" style="gap: 10px;">
        <div>
          <kbd class="kbd kbd-sm" style="background: white;">
            <Icon icon="{evn.icon.value}" width={iconSize} height={iconSize} color="{evn.icon.color}" />
          </kbd>
        </div>

        <div class="flex flex-col" style="font-size: 1rem">
          <div class="flex items-center"  style="gap: 10px">
            <div class="badge badge-ghost badge-sm">{evn.action}</div>
            <span class="countdown font-mono text-xs">
              <span style="--value:{getTime(evn.dateStr).format('H')};"></span>:
              <span style="--value:{getTime(evn.dateStr).format('m')};"></span>
            </span>
          </div>
          
          <div class="flex items-center" style="gap: 10px">
            <div class="font-mono">
              {#if evn.task}
                <a href="https://mysmartdigital.atlassian.net/browse/SMAR-{evn.task}" target="_blank" class="link">{evn.ref}</a>
              {:else}
                {evn.ref}
              {/if}
            </div>
            
            <button class="btn btn-xs" on:click={() => copy(evn.ref)}>
              <Icon icon="pajamas:issues" />
            </button>
          </div>
          
        </div>
      </div>
      
    {/each} 

  </div>
</div>

{/each}


<style>
  .weekOfYear {
    position: absolute;
    top: 26px;
    right: 20px;
    font-size: 14px;
  }
</style>
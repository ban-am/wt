import { writable } from "svelte/store";
import type Resources from "@gitbeaker/core";
import type { AllEventOptions } from "@gitbeaker/rest";
import dayjs from "dayjs";
import type { DayModel } from "$lib/gitlab.api";

export const gitlabClient = writable<Resources.Gitlab | undefined>(undefined);
export const eventFilter = writable<AllEventOptions>({
  sort: 'desc',
  after: getLastDayOfMonth(),
  before: undefined,
  action: undefined,
  scope: undefined,
  targetType: undefined
});

export const eventSotre = writable<DayModel[]>([]);

function getLastDayOfMonth(): string {
  var d = new Date();
  var newMonth = d.getMonth() - 1;
  if(newMonth < 0){
      newMonth += 12;
      d.setFullYear(d.getFullYear() - 1);
  }
  d.setMonth(newMonth);

  let date = dayjs(d);

  return date.format('YYYY-MM') + '-' + date.daysInMonth();
}


/*

 action?: 'created' | 'updated' | 'closed' | 'reopened' | 'pushed' | 'commented' | 'merged' | 'joined' | 'left' | 'destroyed' | 'expired';
    targetType?: 'issue' | 'milestone' | 'merge_request' | 'note' | 'project' | 'snippet' | 'user';
    before?: string;
    after?: string;
    scope?: string;
    sort?: 'asc' | 'desc';*/


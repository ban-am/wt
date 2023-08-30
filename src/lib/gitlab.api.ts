import { Gitlab } from "@gitbeaker/rest";
import type Resources from "@gitbeaker/core";
import { eventFilter, gitlabClient } from "../store";
import { get } from "svelte/store";


export class GitlabApi {
  client?: Resources.Gitlab;
  user?: Resources.ExpandedUserSchema;
  token?: string;
  conected: boolean = false;

  clientLoading = false;

  async createClient() {
    this.token = this.token?.trim();
    if (!this.token) return;

    let client =  new Gitlab({
      host: "https://gitlab.webix.de",
      token: this.token
    });

    this.clientLoading = true;

    try {
      this.user = await client.Users.showCurrentUser()
      this.client = client;
      localStorage.setItem("g-t", this.token);
      gitlabClient.set(this.client);
      this.conected = true;

    } catch(e) {
      console.log(e);
      this.client = undefined;
      this.conected = false
      gitlabClient.set(undefined);
    }
    
    this.clientLoading = false;
  }

  async loadEvents() {
    if (!this.client || !this.user) return null;

    var params = get(eventFilter);
    
    try {
      
    var events = await this.client.Users.allEvents(this.user.id, {
      ...params,
    });

    return this.processEvents(events);
    } catch (error) {
      return null;
    }
  }

  processEvents(events: Resources.EventSchema[]): DayModel[] {
    let eventModels: EventModel[] = [];
    
    for (let event of events) {
      let icon = this.getIcon(event.action_name);
      if (!icon) continue;

      let ref: string = "";
      if (event.action_name == "commented on") {
        ref = event.target_title;
      } else {
        let pushData = event['push_data'] as any;
        if (!pushData) continue;
        
        ref = pushData.ref
      }

      eventModels.push({
        icon: icon,
        dateStr: event.created_at,
        createdAt: new Date(event.created_at),
        ref: ref,
        action: event.action_name,
        task: this.getTaskNumber(ref)
      })
    }

    let days: DayModel[] = [];

    for (let event of eventModels){
      const date = event.dateStr.split('T')[0]
      let day = days.find(i => i.dateStr == date);

      if (!day) {
        day = {
          date: new Date(date),
          dateStr: date,
          events: []
        };
        days.push(day)
      }

      day.events.push(event);
    }

    return days;
  }

  getIcon(action:string): IconModel | undefined {
    switch(action) {
      case 'pushed to':
        return { value: 'pajamas:commit', color: "#1890ff" };

      case 'deleted':
        return { value: 'pajamas:remove', color: "#ff4d4f" };

      case 'opened':
        return { value: 'pajamas:merge-request-open', color: "green" };

      case 'pushed new':
        return { value: 'pajamas:plus-square-o', color: "green" };

      case 'closed':
        return { value: 'pajamas:branch-deleted', color: "#ff4d4f" };

      case 'commented on':
        return { value: 'pajamas:comment-lines', color: "#1890ff" };
    }
    return undefined;
  }
  
  pattern = /SMAR.(?<number>\d+)/g;

  getTaskNumber(text: string) {
    const matches = text.matchAll(this.pattern);
    for (const match of matches) {
      const number = match.groups?.number;
      if (number) {
        return number;
      }
    }
    return null;
  }
}

export interface DayModel {
  date: Date;
  dateStr: string;
  events: EventModel[];
}
export interface EventModel {
  icon: IconModel;
  url?: string;
  dateStr: string;
  createdAt: Date;
  ref: string;
  action: string;
  task: string | null;
}

export interface IconModel {
  value: string;
  color?: string;
}
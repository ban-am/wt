import { Gitlab } from "@gitbeaker/rest";
import type Resources from "@gitbeaker/core";


export class GitlabApi {
  client?: Resources.Gitlab;
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
      await client.Users.showCurrentUser()
      this.client = client;
      localStorage.setItem("g-t", this.token);
      this.conected = true;

    } catch(e) {
      console.log(e);
      this.client = undefined;
      this.conected = false
    }
    
    this.clientLoading = false;

  }
}
import { writable } from "svelte/store";
import type Resources from "@gitbeaker/core";


export const clientStore = writable<Resources.Gitlab | undefined>(undefined);
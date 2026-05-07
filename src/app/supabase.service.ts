import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './environment/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private clientInstance: SupabaseClient;
  constructor() {
    this.clientInstance = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  get client() {
    return this.clientInstance;
  }
}

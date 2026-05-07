import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import type { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.user$.pipe(map((u) => !!u));

  constructor(private supabase: SupabaseService) {
    this.init();
  }

  private async init() {
    try {
      const { data } = await this.supabase.client.auth.getUser();
      this.userSubject.next(data.user ?? null);
    } catch (err) {
      this.userSubject.next(null);
    }

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.userSubject.next(data.user ?? null);
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.client.auth.signOut();
    this.userSubject.next(null);
    if (error) throw error;
  }

  getUser() {
    return this.userSubject.value;
  }
}

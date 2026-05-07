import { Injectable } from '@angular/core';
import { SupabaseService } from '@/app/supabase.service';
import { AuthService } from '@/app/auth.service';

export interface Adventure {
    id: string;
    title: string;
    description: string | null;
    mood: string | null;
    duration_minutes: string | null;
    updated_at: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdventureService {
    constructor(private supabase: SupabaseService, private authService: AuthService) {}

    async getMyAdventures(): Promise<Adventure[]> {
        const user = this.authService.getUser();

        const query = this.supabase.client
            .from('adventures')
            .select('id,title,description,mood,duration_minutes,updated_at')
            .order('updated_at', { ascending: false });

        if (user?.id) {
            query.eq('creator_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return data ?? [];
    }

    async getAdventureById(id: string): Promise<Adventure | null> {
        const { data, error } = await this.supabase.client
            .from('adventures')
            .select('id,title,description,mood,duration_minutes,updated_at')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async deleteAdventure(id: string): Promise<void> {
        const { error } = await this.supabase.client
            .from('adventures')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    }

    async createAdventure(adventure: Partial<Adventure>): Promise<Adventure> {
        const user = this.authService.getUser();

        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await this.supabase.client
            .from('adventures')
            .insert({
                ...adventure,
                creator_id: user.id
            })
            .select('id,title,description,mood,duration_minutes,updated_at')
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

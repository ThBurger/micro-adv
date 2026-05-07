import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Adventure, AdventureService } from '@/app/pages/service/adventure.service';

@Component({
    selector: 'app-adventure-detail',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <div class="surface-card p-6 shadow-2 max-w-2xl">
            <div class="flex align-items-center justify-content-between mb-6">
                <button pButton type="button" icon="pi pi-arrow-left" class="p-button-text" (click)="goBack()"></button>
                <h1 class="text-2xl font-bold">{{ adventure()?.title || 'Loading...' }}</h1>
                <div></div>
            </div>

            <div *ngIf="adventure()" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-700 mb-2">Description</label>
                    <p class="text-base">{{ adventure()?.description || '—' }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-700 mb-2">Mood</label>
                        <p class="text-base">{{ adventure()?.mood || '—' }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-700 mb-2">Duration</label>
                        <p class="text-base">{{ adventure()?.duration_minutes || '—' }} minutes</p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-700 mb-2">Last Modified</label>
                    <p class="text-base">{{ adventure()?.updated_at ? (adventure()?.updated_at | date:'medium') : '—' }}</p>
                </div>
            </div>

            <div *ngIf="loading()" class="text-center text-blue-500 mt-6">
                Loading adventure details...
            </div>
            <div *ngIf="error()" class="text-danger mt-6">{{ error() }}</div>

            <div class="flex gap-3 mt-8">
                <button pButton type="button" label="Back" icon="pi pi-arrow-left" class="p-button-outlined" (click)="goBack()"></button>
                <button pButton type="button" label="Edit" icon="pi pi-pencil" (click)="edit()"></button>
                <button pButton type="button" label="Delete" icon="pi pi-trash" severity="danger" (click)="delete()"></button>
            </div>
        </div>
    `
})
export class AdventureDetail {
    adventure = signal<Adventure | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    private adventureService = inject(AdventureService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.loadAdventure(params['id']);
            }
        });
    }

    private async loadAdventure(id: string) {
        this.loading.set(true);
        this.error.set(null);

        try {
            const data = await this.adventureService.getAdventureById(id);
            this.adventure.set(data);
        } catch (err) {
            this.error.set('Unable to load adventure details.');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/dashboard/my-adventures']);
    }

    edit() {
        // TODO: Implement edit functionality
        alert('Edit feature coming soon');
    }

    async delete() {
        if (confirm('Are you sure you want to delete this adventure?')) {
            try {
                const adventureId = this.adventure()?.id;
                if (adventureId) {
                    await this.adventureService.deleteAdventure(adventureId);
                    this.router.navigate(['/dashboard/my-adventures']);
                }
            } catch (err) {
                this.error.set('Failed to delete adventure.');
                console.error(err);
            }
        }
    }
}

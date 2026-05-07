import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Adventure, AdventureService } from '@/app/pages/service/adventure.service';
import { CreateAdventureForm } from './create-adventure-form';

@Component({
    selector: 'app-my-adventures',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule, CreateAdventureForm],
    template: `
        <div class="surface-card p-4 shadow-2">
            <div class="flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 class="text-2xl font-bold mb-1">My Adventures</h1>
                    <p class="text-base text-700">Your created adventures</p>
                </div>
                <div class="flex align-items-center gap-4">
                    <span *ngIf="loading()" class="text-sm text-blue-500">Loading adventures...</span>
                    <button pButton type="button" icon="pi pi-plus" label="Create" (click)="openCreateDialog()"></button>
                </div>
            </div>

            <p-table [value]="adventures()" [paginator]="true" [rows]="10" responsiveLayout="scroll">
                <ng-template #header>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Mood</th>
                        <th>Duration</th>
                        <th>Modified At</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template #body let-adventure>
                    <tr>
                        <td>{{ adventure.title }}</td>
                        <td>{{ adventure.description ? (adventure.description | slice:0:50) : '' }}{{ adventure.description?.length > 50 ? '...' : '' }}</td>
                        <td>{{ adventure.mood || '—' }}</td>
                        <td>{{ adventure.duration_minutes || '—' }}</td>
                        <td>{{ adventure.updated_at ? (adventure.updated_at | date:'medium') : '—' }}</td>
                        <td>
                            <button pButton pRipple type="button" icon="pi pi-pencil" class="p-button-rounded p-button-text" (click)="editAdventure(adventure.id)" pTooltip="Edit" tooltipPosition="top"></button>
                            <button pButton pRipple type="button" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" (click)="deleteAdventure(adventure.id)" pTooltip="Delete" tooltipPosition="top"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <div *ngIf="!loading() && adventures().length === 0" class="text-center text-700 mt-4">
                No adventures found yet.
            </div>
            <div *ngIf="error()" class="text-danger mt-4">{{ error() }}</div>
        </div>

        <p-dialog [visible]="showCreateDialog()" (visibleChange)="showCreateDialog.set($event)" [header]="'Create New Adventure'" [modal]="true" [style]="{width: '500px'}">
            <app-create-adventure-form
                (adventureCreated)="onAdventureCreated()"
                (cancelled)="showCreateDialog.set(false)"
            ></app-create-adventure-form>
        </p-dialog>
    `
})
export class MyAdventures {
    adventures = signal<Adventure[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    showCreateDialog = signal(false);

    private adventureService = inject(AdventureService);
    private router = inject(Router);

    ngOnInit() {
        this.loadAdventures();
    }

    private async loadAdventures() {
        this.loading.set(true);
        this.error.set(null);

        try {
            const data = await this.adventureService.getMyAdventures();
            this.adventures.set(data);
        } catch (err) {
            this.error.set('Unable to load adventures from Supabase.');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    editAdventure(id: string) {
        this.router.navigate(['/dashboard/my-adventures', id]);
    }

    async deleteAdventure(id: string) {
        if (confirm('Are you sure you want to delete this adventure?')) {
            try {
                await this.adventureService.deleteAdventure(id);
                // Reload the list after deletion
                this.loadAdventures();
            } catch (err) {
                this.error.set('Failed to delete adventure.');
                console.error(err);
            }
        }
    }

    openCreateDialog() {
        this.showCreateDialog.set(true);
    }

    onAdventureCreated() {
        this.showCreateDialog.set(false);
        this.loadAdventures();
    }
}

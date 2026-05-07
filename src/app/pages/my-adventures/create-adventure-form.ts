import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AdventureService } from '@/app/pages/service/adventure.service';

@Component({
    selector: 'app-create-adventure-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule
    ],
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-4">
                <label for="title" class="block text-sm font-semibold mb-2">Title *</label>
                <input
                    pInputText
                    id="title"
                    formControlName="title"
                    class="w-full"
                    placeholder="Adventure title"
                />
                <small class="text-danger" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
                    Title is required
                </small>
            </div>

            <div class="mb-4">
                <label for="description" class="block text-sm font-semibold mb-2">Description</label>
                <textarea
                    id="description"
                    formControlName="description"
                    rows="4"
                    class="w-full p-2 border-1 surface-border rounded"
                    placeholder="Describe your adventure..."
                ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="mood" class="block text-sm font-semibold mb-2">Mood</label>
                    <input
                        pInputText
                        id="mood"
                        formControlName="mood"
                        class="w-full"
                        placeholder="e.g., Adventurous, Relaxing"
                    />
                </div>
                <div>
                    <label for="duration" class="block text-sm font-semibold mb-2">Duration (minutes) *</label>
                    <input
                        pInputText
                        id="duration"
                        formControlName="duration_minutes"
                        type="number"
                        class="w-full"
                        placeholder="e.g., 60"
                    />
                    <small class="text-danger" *ngIf="form.get('duration_minutes')?.invalid && form.get('duration_minutes')?.touched">
                        Duration is required
                    </small>
                </div>
            </div>

            <div class="flex gap-2">
                <button pButton type="submit" label="Create" [disabled]="form.invalid || submitting()"></button>
                <button pButton type="button" label="Cancel" class="p-button-secondary" (click)="cancel()"></button>
            </div>

            <div *ngIf="error()" class="text-danger mt-4">{{ error() }}</div>
        </form>
    `
})
export class CreateAdventureForm {
    @Output() adventureCreated = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    form: FormGroup;
    submitting = signal(false);
    error = signal<string | null>(null);

    private fb = inject(FormBuilder);
    private adventureService = inject(AdventureService);

    constructor() {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            description: [''],
            mood: [''],
            duration_minutes: ['', [Validators.required]]
        });
    }

    async submit() {
        if (this.form.invalid) {
            return;
        }

        this.submitting.set(true);
        this.error.set(null);

        try {
            await this.adventureService.createAdventure(this.form.value);
            this.adventureCreated.emit();
        } catch (err) {
            this.error.set('Failed to create adventure. Please try again.');
            console.error(err);
        } finally {
            this.submitting.set(false);
        }
    }

    cancel() {
        this.cancelled.emit();
    }
}

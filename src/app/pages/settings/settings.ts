import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="surface-card p-4 shadow-2">
            <h1 class="text-2xl font-bold mb-3">Einstellungen</h1>
            <p class="text-base text-700">
                Minimal settings page placeholder for app settings.
            </p>
        </div>
    `
})
export class Settings {}

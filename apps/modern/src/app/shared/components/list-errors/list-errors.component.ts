import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-errors.component.html',
})
export class ListErrorsComponent {
  readonly errors = input<Record<string, string[]> | null>(null);

  protected get errorList(): string[] {
    const errorMap = this.errors();
    if (!errorMap) return [];
    return Object.entries(errorMap).map(([field, messages]) =>
      messages.map((message) => `${field} ${message}`).join(', ')
    );
  }
}

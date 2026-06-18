import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-list-pagination',
  standalone: true,
  imports: [],
  templateUrl: './list-pagination.component.html',
})
export class ListPaginationComponent {
  readonly totalPages = input.required<number>();
  readonly currentPage = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pageRange = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1)
  );

  protected changePage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }
}

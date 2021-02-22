import {HttpParams} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component} from '@angular/core';

@Component({
  template: ''
})
export abstract class TableManagementComponent {
  pageSize: number;
  pageIndex: number;
  // Http URL params
  params = new HttpParams();
  length: number;
  previousPageIndex: number;
  organization: string;
  filterTerm: string;
  selected: string;
  timeForm: FormGroup;
  searchForm: FormGroup;

  protected constructor(fb: FormBuilder) {
    this.length = 0;
    this.pageSize = 25;
    this.pageIndex = 1;
    this.previousPageIndex = 0;
    this.organization = '';
    this.filterTerm = '';
    this.selected = 'All';
    this.timeForm = fb.group({
      time: ['', Validators.required],
    });
    this.searchForm = fb.group(this.getSearchForm());
  }

  paginatorAction(event: object): void {
    // page index starts at 1

    const pageIndex = 'pageIndex';
    const pageSize = 'pageSize';
    // @ts-ignore
    this.pageIndex = 1 + event[pageIndex];
    // @ts-ignore
    this.pageSize = event[pageSize];

    this.params = this.params.set('page', String(this.pageIndex));
    this.params = this.params.set('page_size', String(this.pageSize));

    this.updatePage();
  }

  searchItem(): void {

    this.pageIndex = 1;
    this.params = this.params.set('page', String(this.pageIndex));

    for (const value in this.searchForm.value) {
      if (this.searchForm.value[value] === '') {
        this.params = this.params.delete(value);
      } else {
        this.params = this.params.set(value, this.searchForm.value[value]);
      }
    }
    this.updatePage();
  }

  abstract getSearchForm(): any;

  abstract updatePage(): void;
}

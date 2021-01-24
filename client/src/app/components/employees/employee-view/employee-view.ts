
export abstract class EmployeeView {

  title: string;
  loaded = false;
  isEdit: boolean;

  protected constructor() {
    this.title = this.getTitle();
    this.isEdit = this.getIsEdit();
  }

  abstract getTitle(): string;
  abstract getIsEdit(): boolean;

  // Needs to be called to load up the component and display the form
  isLoaded(): void {
    this.loaded = true;
  }

}

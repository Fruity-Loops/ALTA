
export abstract class EmployeeView {

  title: string;
  loaded = false;

  protected constructor() {
    this.title = this.getTitle();
  }

  abstract getTitle(): string;

  // Needs to be called to load up the component and display the form
  isLoaded(): void {
    this.loaded = true;
  }

}

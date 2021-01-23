
export abstract class EmployeeView {

  title: string;

  protected constructor() {
    this.title = this.getTitle();
  }

  abstract getTitle(): string;

}

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-progression-metrics-popover',
  templateUrl: './progression-metrics-popover.component.html',
  styleUrls: ['./progression-metrics-popover.component.scss'],
})
export class ProgressionMetricsPopoverComponent implements OnInit {

  constructor(
    public popoverController: PopoverController
    ) { }

  ngOnInit() { }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

}

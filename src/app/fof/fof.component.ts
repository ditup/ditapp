import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fof',
  templateUrl: './fof.component.html',
  styleUrls: ['./fof.component.scss']
})
export class FofComponent implements OnInit {

  @Input()
  public message: string = 'not found';

  constructor() { }

  ngOnInit() {
  }

}

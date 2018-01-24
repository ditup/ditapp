import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-navigation',
  templateUrl: './welcome-navigation.component.html',
  styleUrls: ['./welcome-navigation.component.scss']
})
export class WelcomeNavigationComponent implements OnInit {

  // current step in navigation
  @Input() step: number;
  // total steps in navigation
  @Input() steps = 3;
  // is the "next" button disabled
  @Input() disabled = true;

  public get nextStep(): string {
    // is this the last step or not?
    return (this.step < this.steps) ? String(this.step + 1) : 'done';
  }

  constructor() { }

  ngOnInit() {
  }

}

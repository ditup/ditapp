import { Component, Input } from '@angular/core';

@Component({ selector: 'app-welcome-navigation', template: '' })
export class WelcomeNavigationStubComponent {
  @Input() step;
  @Input() steps;
  @Input() disabled;
  constructor() { }
}

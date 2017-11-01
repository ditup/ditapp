import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss']
})
export class LoggedComponent implements OnInit {

  public exploreOptions: any[] = [
    {
      link: '/profile/edit',
      icon: 'person',
      title: 'about me'
    },
    {
      link: '/profile/edit/tags',
      icon: 'favorite',
      title: 'i care about...'
    },
    {
      link: '/people',
      icon: 'people',
      title: 'people alike'
    },
    {
      link: '/map',
      icon: 'person_pin_circle',
      title: 'people around'
    },
    {
      todo: true,
      link: '/ideas',
      icon: 'lightbulb_outline',
      title: 'ideas'
    },
    {
      todo: true,
      link: '/challenges',
      icon: 'extension',
      title: 'challenges'
    },
    {
      todo: true,
      link: '/projects',
      icon: 'build',
      title: 'projects'
    },
    {
      todo: true,
      link: '/discussions',
      icon: 'forum',
      title: 'discussions'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

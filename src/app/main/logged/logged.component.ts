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
      title: 'tell about me'
    },
    {
      link: '/people',
      icon: 'people',
      title: 'find people alike'
    },
    {
      link: '/map',
      icon: 'person_pin_circle',
      title: 'find people around'
    }
  ];
  public todoOptions: any[] = [
    {
      todo: true,
      link: '/challenges',
      icon: 'extension',
      title: 'challenges'
    },
    {
      link: '/ideas',
      icon: 'lightbulb_outline',
      title: 'ideas'
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

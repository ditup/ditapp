import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Votes } from 'app/shared/types';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  @Input() votes: Votes;
  @Output() vote = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  get voteSum() {
    return this.votes.up - this.votes.down;
  }

  public onClickUp() {
    this.vote.emit(1);
  }

  public onClickDown() {
    this.vote.emit(-1);
  }
}

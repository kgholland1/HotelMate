import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfile } from './../../_models/profile';

@Component({
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  profile: IProfile;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {

      this.profile = data['profile'];

    });
  }

}

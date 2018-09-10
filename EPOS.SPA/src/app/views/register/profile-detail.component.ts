import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IProfile } from '../../_models/profile';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {

  profile: IProfile;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {

      this.profile = data['profile'];

    });
  }

}

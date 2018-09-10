import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ITourist } from '../../_models/tourist';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { IPhoto } from '../../_models/photo';

@Component({
  templateUrl: './tourist-view.component.html',
  styleUrls: ['./tourist-view.component.scss']
})
export class TouristViewComponent implements OnInit {
  tourist: ITourist;
  photos: IPhoto[];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {

    this.tourist = data['tourist'].touristToReturn;
    this.photos =  data['tourist'].photoToReturn;

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];

    this.galleryImages = this.getImages();
    });
  }
  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.photos.length; i++) {
      imageUrls.push({
        small: this.photos[i].url,
        medium: this.photos[i].url,
        big: this.photos[i].url,
        description: this.photos[i].description
      });
    }
    return imageUrls;
  }
}

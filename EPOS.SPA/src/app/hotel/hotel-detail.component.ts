import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { IHotel } from './../_models/hotel';

@Component({
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  hotel: IHotel;

get getAddress(): string {
    let address = this.hotel.address1;

    if (this.hotel.address2) {
        address = address + ', ' + this.hotel.address2;
      }

    if (this.hotel.town) {
      address = address + ', ' + this.hotel.town;
    }

    if (this.hotel.county) {
      address = address + ', ' + this.hotel.county;
    }

    if (this.hotel.country) {
      address = address + ', ' + this.hotel.country;
    }

    if (this.hotel.postCode) {
      address = address + ', ' + this.hotel.postCode;
    }
    return address;
}

galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {

      this.hotel = data['hotel'];

    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];

    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.hotel.photos.length; i++) {
      imageUrls.push({
        small: this.hotel.photos[i].url,
        medium: this.hotel.photos[i].url,
        big: this.hotel.photos[i].url,
        description: this.hotel.photos[i].description
      });
    }
    return imageUrls;
  }
}

import { IPhoto } from '../../_models/photo';
import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '../../_Services/auth.service';
import { environment } from 'environments/environment';
import { AlertifyService } from '../../_Services/alertify.service';
import { HotelService } from '../../_Services/hotel.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss']
})
export class EditPhotoComponent implements OnInit {
  @Input() photos: IPhoto[];
  @Input() photoType: string;
  @Input() photoTypeId: string;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: IPhoto;

  constructor(private authService: AuthService,
      private hotelService: HotelService,
      private alertify: AlertifyService) { }

  ngOnInit() {

    this.initializeUploader();

    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    const test = this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/photos/' + this.photoType + '/' + (this.photoTypeId);
    console.log('Test section: ' + test);
  }
  initializeUploader() {
    const hotelClaim = this.authService.userClaims.find(c => c.claimType.toLowerCase() === 'hotelid');
    this.uploader = new FileUploader({
      // tslint:disable-next-line:max-line-length
      url: this.baseUrl + 'hotels/' + (+hotelClaim.claimValue) + '/photos/' + this.photoType + '/' + this.photoTypeId,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: false,
      removeAfterUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: IPhoto = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          photoType: res.photoType,
          photoTypeId: res.photoTypeId,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        console.log('got this far')
        this.photos.push(photo);
        console.log('couldnt get this far')
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: IPhoto) {
    this.hotelService.setMainPhoto(photo.id, photo).subscribe(() => {
      this.currentMain = _.findWhere(this.photos, {isMain: true});
      this.currentMain.isMain = false;
      photo.isMain = true;
    }, error => {
      this.alertify.error(error, 5);
    });
  }

  deletePhoto(id: number) {
     this.alertify.confirm('Photos', 'Are you sure you want to delete this photo?', () => {
      this.hotelService.deletePhoto(id).subscribe(() => {
        this.photos.splice(_.findIndex(this.photos, {id: id}), 1);
        this.alertify.success('Photo has been deleted', 5);
      }, error => {
        this.alertify.error('Failed to delete photo', 5)
      });
     });
  }
}

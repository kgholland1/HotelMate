import { Component, OnInit, Input } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import * as _ from 'underscore';

import { MessageModalComponent } from './../message-modal.component';
import { PhotoService } from './../../core/photo.service';
import { AlertifyService } from './../../core/alertify.service';
import { AuthService } from './../../core/auth.service';
import { IPhoto } from './../../_models/photo';


@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss']
})
export class EditPhotoComponent implements OnInit {
  @Input() photos: IPhoto[] = [];
  @Input() photoType: string;
  @Input() photoTypeId: string;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: IPhoto;
  bsModalRef: BsModalRef;

  constructor(private authService: AuthService,
      private photoService: PhotoService,
      private modalService: BsModalService,
      private alertify: AlertifyService) { }

  ngOnInit() {

    this.initializeUploader();

  }
  initializeUploader() {
    const hotelId = this.authService.currentUser.hotelId;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'hotels/' + hotelId + '/photos/' + this.photoType + '/' + this.photoTypeId,
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
    this.photoService.setMainPhoto(photo.id, photo).subscribe(() => {
      this.currentMain = _.findWhere(this.photos, {isMain: true});

      if (this.currentMain !== undefined) {
        this.currentMain.isMain = false;
      }
     photo.isMain = true;
    }, error => {
      this.alertify.error(error, 5);
    });
  }

  deletePhoto(id: number) {
     const initialState = {
      title : 'Photo',
      message: 'Are you sure you want to delete this photo'
    };
    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
      if (value) {
        this.photoService.deletePhoto(id).subscribe(() => {
          this.photos.splice(_.findIndex(this.photos, {id: id}), 1);
          this.alertify.success('Photo has been deleted', 5);
        }, error => {
          this.alertify.error('Failed to delete photo', 5)
        });
      }
    });
  }
}


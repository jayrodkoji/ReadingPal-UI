import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const USERS_API_URL = 'http://localhost:3000/api/';
const USER_API_PATH = '/users';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient
  ) { }


  /**
   * Upload Profile Image
   */
  public updateProfileImage(image: FormData, key) {
    return this.http.post(`${USERS_API_URL}${USER_API_PATH}/uploadProfilePic/${key}`, image);
  }

  /**
   * Get Profile Image
   * Used for single use (not intended for use when image is needed more than once)
   * @param key: s3 key
   */
  public getProfileImage(key) {
    return `${USERS_API_URL}${USER_API_PATH}/ProfilePic/${key}`;
  }

  /**
   * Download Profile Image
   * Used for saving image (intended for use when image is needed more than once, ie. logged in user)
   */
  public downloadProfileImage(key) {
    return null;
  }

  public deleteUserImages(profileImageKey) {
    return this.http.delete(`${USERS_API_URL}${USER_API_PATH}/deleteProfilePic/${profileImageKey}`);
  }
}

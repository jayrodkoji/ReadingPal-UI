export class ImageUtils {
  // Converts the image data from database to a form for storing.
  public static convertDBImage(image)
  {
    return btoa(image);
  }

  public static convertToDBImage(image)
  {
    return atob(image);
  }

  // Decodes an image to a displayable form (must have ran convertDBImage on it previously).
  public static decodeDBImage(sanitizer, image) {
    return 'data:image/png;base64,'
      + atob(
        (sanitizer.bypassSecurityTrustResourceUrl(image) as any).
          changingThisBreaksApplicationSecurity);
  }

  public static fullDecode(sanitizer, image) {
    return ImageUtils.decodeDBImage(sanitizer, ImageUtils.convertDBImage(image));
  }

  public static readImageFileData(file, func) {
    const binaryReader = new FileReader();
    binaryReader.onload =
      e => {
        const binaryString = e.target.result;
        const convertedImage = ImageUtils.convertDBImage(binaryString as string);
        func(convertedImage);
      };
    binaryReader.readAsBinaryString(file);
  }

  public static readImageFileURL(file, func) {
    const urlReader = new FileReader();
    urlReader.onload =
      e => {
        const imgUrl = e.target.result as string;
        func(imgUrl);
      };
    urlReader.readAsDataURL(file);
  }
}

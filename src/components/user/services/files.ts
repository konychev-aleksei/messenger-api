import fs from "fs";
import { File } from "formidable";
import C from "../../../constants";

class UserFilesService {
  static async saveProfileImage(userName: string, photo: File) {
    await fs.rename(
      photo.filepath,
      `./public/avatars/${userName}.png`,
      (err) => {
        if (err) {
          throw new Error(C.SAVE_ERROR);
        }
      }
    );
  }
}

export default UserFilesService;

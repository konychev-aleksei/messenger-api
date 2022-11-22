import fs from "fs";
import { File } from "formidable";

class ChatsFilesService {
  static async changePhoto(photo: File, chatId: string) {
    await fs.rename(
      photo.filepath,
      `./public/previews/${chatId}.png`,
      (err) => {
        if (err) {
          throw new Error("Не удалось сохранить файл");
        }
      }
    );
  }
}

export default ChatsFilesService;

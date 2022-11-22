import fs from "fs";
import { File } from "formidable";
import C from "../../../constants";

class MessageFilesService {
  static async saveAudioFile(audio: File, id: number) {
    await fs.rename(audio.filepath, `./public/audio/${id}.mp3`, (err) => {
      if (err) {
        throw new Error(C.SAVE_ERROR);
      }
    });
  }

  static async saveImageFile(image: File, id: number) {
    await fs.rename(image.filepath, `./public/images/${id}.mp3`, (err) => {
      if (err) {
        throw new Error(C.SAVE_ERROR);
      }
    });
  }
}

export default MessageFilesService;

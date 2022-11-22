import fs from "fs";
import C from "../constants";
import { File } from "formidable";

const saveFile = async (
  folder: string,
  title: string,
  extension: string,
  file: File
) => {
  await fs.rename(
    file.filepath,
    `./public/${folder}/${title}.${extension}`,
    (err) => {
      if (err) {
        throw new Error(C.SAVE_ERROR);
      }
    }
  );
};

export default saveFile;

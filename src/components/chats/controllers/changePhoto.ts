import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import formidable, { File } from "formidable";
import C from "../../../constants";
import notifyUsers from "../../../utlis/notifyUsers";
import saveFile from "../../../utlis/saveFile";

type Params = {};
type ResBody = {};
export type ReqBody = {
  preview: File;
};
type ReqQuery = {
  chatId: string;
};

const changePhoto: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, _, files) => {
      if (err) {
        throw Error();
      }

      const { chatId } = req.query;
      const { photo } = files;

      if (
        !photo ||
        Array.isArray(photo) ||
        !chatId ||
        Array.isArray(chatId) ||
        Number.isNaN(Number(chatId)) ||
        !photo.mimetype?.includes("image")
      ) {
        throw Error("Unprocessable");
      }

      await ChatsService.changePhoto(chatId);
      await saveFile("previews", chatId, "png", photo);

      const users = await ChatsService.getUsersInChat(chatId);

      notifyUsers(users, C.CHANGE_CHAT_PHOTO, { id: Number(chatId) });

      res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default changePhoto;

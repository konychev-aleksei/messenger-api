import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import formidable, { File } from "formidable";
import MessageService from "../service";
import getUserNameByToken from "../../../utlis/getUserNameByToken";
import saveFile from "../../../utlis/saveFile";
import C from "../../../constants";
import notifyUsers from "../../../utlis/notifyUsers";
import ChatsService from "../../chats/service";

type Params = {};
type ResBody = {};
export type ReqBody = {
  chatId: string;
  message: string;
  image?: File;
};
type ReqQuery = {};

const sendTextMessage: RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
> = async (req, res) => {
  const token = req.headers.authorization!;
  const userName = getUserNameByToken(token);

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw Error();
      }

      const { chatId, message } = fields;
      const { image } = files;

      if (
        !chatId ||
        (!message && !image) ||
        Array.isArray(chatId) ||
        Array.isArray(message) ||
        (image && Array.isArray(image)) ||
        (image && !image.mimetype?.includes("image"))
      ) {
        throw Error("Unprocessable");
      }

      const chat = await MessageService.getChatById(chatId);

      if (!chat) {
        throw Error("Not found");
      }

      const newMessage = await MessageService.sendTextMessage({
        userName,
        chatId,
        message,
        image,
      });

      if (image) {
        await saveFile("images", newMessage.id, "png", image);
      }

      const participants = await ChatsService.getParticipantsByChatId(chatId);
      const users = participants.map((user) => user.username);

      notifyUsers(users, C.SEND_MESSAGE, {
        id: Number(chatId),
        newMessage,
      });

      res.sendStatus(201);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default sendTextMessage;

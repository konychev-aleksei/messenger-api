import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import formidable, { File } from "formidable";
import ChatsService from "../../chats/service";
import MessageService from "../service";
import getUserNameByToken from "../../../utlis/getUserNameByToken";
import saveFile from "../../../utlis/saveFile";
import C from "../../../constants";
import notifyUsers from "../../../utlis/notifyUsers";

type Params = {};
type ResBody = {};
export type ReqBody = {
  chatId: string;
  audio: File;
};
type ReqQuery = {};

const sendAudioMessage: RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
> = async (req, res) => {
  try {
    const token = req.headers.authorization!;
    const userName = getUserNameByToken(token);

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw Error();
      }

      const { chatId } = fields;
      const { audio } = files;

      if (
        !chatId ||
        Array.isArray(chatId) ||
        Array.isArray(audio) ||
        !audio.mimetype?.includes("audio")
      ) {
        throw Error("Unprocessable");
      }

      const chat = await MessageService.getChatById(chatId);

      if (!chat) {
        throw Error("Not found");
      }

      const newMessage = await MessageService.sendAudioMessage({
        userName,
        chatId,
      });

      await saveFile("audio", newMessage.id, "mp3", audio);

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

export default sendAudioMessage;

import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import formidable from "formidable";
import C from "../../../constants";
import notifyUsers from "../../../utlis/notifyUsers";

type Params = {};
type ResBody = {};
export type ReqBody = {
  userName: string;
  chatId: number;
};
type ReqQuery = {};

const addUser: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields) => {
      if (err) {
        throw Error();
      }

      const { userName, chatId } = fields;

      if (
        !userName ||
        Array.isArray(userName) ||
        !chatId ||
        Array.isArray(chatId) ||
        Number.isNaN(chatId)
      ) {
        throw Error("Unprocessable");
      }

      const user = await ChatsService.getUserByUserName(userName);

      const creator = await ChatsService.getChatCreator(chatId);

      if (!user || !creator || user === creator) {
        res.sendStatus(422);
        return;
      }

      await ChatsService.removeUserFromChat(userName, chatId);

      const usersInChat = await ChatsService.getUsersInChat(chatId);

      notifyUsers(usersInChat, C.REMOVE_USER, { userName, chatId });

      res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default addUser;

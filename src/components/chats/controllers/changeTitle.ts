import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import C from "../../../constants";
import formidable from "formidable";
import notifyUsers from "../../../utlis/notifyUsers";

type Params = {};
type ResBody = {};
export type ReqBody = {
  title: string;
};
type ReqQuery = {
  chatId: string;
};

const changeTitle: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields) => {
      if (err) {
        throw Error();
      }

      const { chatId } = req.query;
      const { title } = fields;

      if (
        !title ||
        Array.isArray(title) ||
        !chatId ||
        Array.isArray(chatId) ||
        Number.isNaN(Number(chatId))
      ) {
        throw Error("Unprocessable");
      }

      await ChatsService.changeTitle(title, chatId);

      const usersInChat = await ChatsService.getUsersInChat(chatId);

      notifyUsers(usersInChat, C.CHANGE_CHAT_TITLE, {
        title,
        id: Number(chatId),
      });

      res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default changeTitle;

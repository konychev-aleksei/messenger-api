import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import formidable from "formidable";
import getUserNameByToken from "../../../utlis/getUserNameByToken";

type Params = {};
type ResBody = {};
export type ReqBody = {
  userName: string;
  chatId: number;
};
type ReqQuery = {};

const createNewChat: RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
> = async (req, res) => {
  const token = req.headers.authorization!;
  const userName = getUserNameByToken(token);

  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields) => {
      if (err) {
        throw Error();
      }

      const { title } = fields;

      if (!title || Array.isArray(title) || title.length > 30) {
        throw Error("Unprocessable");
      }

      const data = await ChatsService.createNewChat(title, userName);

      res.status(200).json(data);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default createNewChat;

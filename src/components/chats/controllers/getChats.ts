import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import getUserNameByToken from "../../../utlis/getUserNameByToken";

type Params = {};
type ResBody = {};
export type ReqBody = {};
type ReqQuery = {
  chatId: string;
  page: number;
  perPage: number;
};

const getChats: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const token = req.headers.authorization!;
  const userName = getUserNameByToken(token);

  try {
    let { page, perPage } = req.query;

    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 1;
    }

    if (Number.isNaN(page) || Number.isNaN(perPage)) {
      throw Error("Unprocessable");
    }

    const data = await ChatsService.getChatsByUserName(userName, page, perPage);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default getChats;

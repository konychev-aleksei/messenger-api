import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import MessageService from "../service";

type Params = {};
type ResBody = {};
export type ReqBody = {};
type ReqQuery = {
  chatId: string;
  page: number;
  perPage: number;
};

const getMessages: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  try {
    let { chatId, page, perPage } = req.query;

    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 1;
    }

    if (Number.isNaN(page) || Number.isNaN(perPage)) {
      throw Error("Unprocessable");
    }

    if (Number.isNaN(Number(chatId)) || !chatId) {
      throw Error("Unprocessable");
    }

    const chat = await MessageService.getChatById(chatId);

    if (!chat) {
      throw Error("Not found");
    }

    const data = await MessageService.getMessagesByChatId(
      chatId,
      page,
      perPage
    );

    const totalCount = await MessageService.getTotalCountByChatId(chatId);

    res.status(200).json({ data, totalCount });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default getMessages;

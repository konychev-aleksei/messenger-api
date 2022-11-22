import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";

type Params = {};
type ResBody = {};
type ReqBody = {};
type ReqQuery = {
  chatId: number;
};

const getParticipants: RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
> = async (req, res) => {
  try {
    const { chatId } = req.query;

    if (!chatId || Number.isNaN(chatId)) {
      throw Error("Unprocessable");
    }

    const data = await ChatsService.getParticipantsByChatId(chatId);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default getParticipants;

import db from "./database";
import moment from "moment";

const users = [
  {
    userName: "sherer",
    displayName: "Анна Шерер",
  },
  {
    userName: "kuragin",
    displayName: "Василий Курагин",
  },
  {
    userName: "bolkonsky",
    displayName: "Андрей Болконский",
  },
  {
    userName: "bezukhov",
    displayName: "Пьер Безухов",
  },
];

export const initializeUsers = async (
  userName: string,
  displayName: string
) => {
  const newUsers = [...users, { userName, displayName }];

  for (const { userName, displayName } of newUsers) {
    await db.query(
      `INSERT INTO Users (username, displayname, photoexists) 
    VALUES ($1, $2, true)`,
      [userName, displayName]
    );
  }
};

const chats = [
  {
    title: "Вечер у Шерер",
    creator: "bezukhov",
  },
];

export const initializeChats = async (email: string) => {
  for (const { title, creator } of chats) {
    const dbResponse = await db.query(
      `INSERT INTO Chats (title, creator, photoexists, lastmessage) 
      VALUES ($1, $2, true, 0) RETURNING id`,
      [title, creator]
    );

    const id = dbResponse.rows[0].id;
    const newUsers = [...users, { userName: email }];

    for (const { userName } of newUsers) {
      await db.query(
        `INSERT INTO UserChatRelation (username, chat_id) 
        VALUES ($1, $2)`,
        [userName, id]
      );
    }
  }
};

const messages = [
  {
    userName: "sherer",
    chatId: 1,
    message:
      "Ну, здравствуйте, здравствуйте. Я часто думаю, как иногда несправедливо распределяется счастие жизни. За что вам дала судьба таких двух славных, (исключая Анатоля, вашего меньшого, я его не люблю), таких прелестных детей? А вы, право, менее всех цените их и потому их не стоите.",
    image: true,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message:
      "Что делать! Лафатер сказал бы, что у меня нет шишки родительской любви.",
    image: false,
    audio: "",
  },
  {
    userName: "sherer",
    chatId: 1,
    message:
      "Перестаньте шутить. Я хотела серьезно поговорить с вами. Знаете, я недовольна вашим меньшим сыном. Между нами будь сказано, (Лицо ее приняло грустное выражение.), о нем говорили у ее величества и жалеют вас...",
    image: false,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message: "Что ж мне делать?",
    image: false,
    audio: "",
  },
  {
    userName: "sherer",
    chatId: 1,
    message:
      "И зачем родятся дети у таких людей, как вы? Ежели бы вы не были отец, я бы ни в чем не могла упрекнуть. (Задумчиво поднимая глаза.)",
    image: false,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message: "",
    image: false,
    audio: Array.from(Array(60))
      .map((_) => Math.floor(Math.random() * 20))
      .join(","),
  },
  {
    userName: "kuragin",
    chatId: 1,
    message:
      "Я вас... и вам одним могу, признаться. Мои дети — обуза моего существования. Что делать?.. Это мой крест. Я так себе объясняю.",
    image: false,
    audio: "",
  },
  {
    userName: "sherer",
    chatId: 1,
    message:
      "Вы никогда не думали о том, чтобы женить вашего блудного сына Анатоля. У меня есть одна personne. Болконская.",
    image: false,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message:
      "Нет, вы знаете ли, что этот Анатоль мне стоит сорок тысяч в год. Что будет через пять лет, ежели это пойдет так? Она богата, ваша княжна?",
    image: false,
    audio: "",
  },
  {
    userName: "sherer",
    chatId: 1,
    message:
      "Отец очень богат и скуп. Он живет в деревне. Знаете, этот известный князь Болконский, отставленный еще при покойном императоре и прозванный прусским королем. Он очень умный человек, но со странностями и тяжелый. У нее брат, вот что недавно женился на Lise Мейнен, адъютант Кутузова.",
    image: true,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message: "Она хорошей фамилии и богата. Все, что мне нужно.",
    image: false,
    audio: "",
  },
  {
    userName: "bezukhov",
    chatId: 1,
    message:
      "Да, я слышал про его план вечного мира, и это очень интересно, но едва ли возможно...",
    image: false,
    audio: "",
  },
  {
    userName: "kuragin",
    chatId: 1,
    message: "Пьер, старый мой товарищ! И ты в большом свете!",
    image: false,
    audio: "",
  },
  {
    userName: "bezukhov",
    chatId: 1,
    message: "Андрей! Я знал, что вы будете. (Приветствуют друг друга.)",
    image: false,
    audio: "",
  },
];

export const initializeMessages = async () => {
  let createdon = moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");

  for (const { userName, chatId, message, image, audio } of messages) {
    const newMessage = await db.query(
      `INSERT INTO Messages (chat_id, createdon, username, message, image, audio) 
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [chatId, createdon, userName, message, Boolean(image), audio]
    );

    const lastMessageId = newMessage.rows[0].id;

    await db.query(
      `UPDATE Chats 
        SET lastmessage = $1
        WHERE id = $2`,
      [lastMessageId, chatId]
    );

    createdon = moment(createdon, "YYYY/MM/DD HH:mm:ss")
      .add(1, "second")
      .format("YYYY/MM/DD HH:mm:ss");
  }
};

export const initializer = async (email: string, displayName: string) => {
  await initializeUsers(email, displayName);
  await initializeChats(email);
  await initializeMessages();
};

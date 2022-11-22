const C = {
  DEFAULT_CHAT_IMAGE: "https://cdn-icons-png.flaticon.com/512/309/309666.png",
  DEFAULT_USER_IMAGE: "https://cdn-icons-png.flaticon.com/512/309/309666.png",
  API_DOMAIN: "http://localhost:8080",

  CHANGE_CHAT_TITLE: "CHANGE_CHAT_TITLE",
  CHANGE_CHAT_PHOTO: "CHANGE_CHAT_PHOTO",
  CHANGE_USER_PHOTO: "CHANGE_USER_PHOTO",
  ADD_USER: "ADD_USER",
  REMOVE_USER: "REMOVE_USER",
  SEND_MESSAGE: "SEND_MESSAGE",
  SAVE_ERROR: "Не удалось сохранить файл",
  AUTH_ERROR: "Ошибка авторизации",
};

export const getDefaultChatPhoto = (chatId: number, title: string) => ({
  id: chatId,
  message: "Новый чат",
  createdon: null,
  isevent: true,
  photo: C.DEFAULT_CHAT_IMAGE,
  title,
});

export const cropMessage = (message: string) =>
  message.length > 12 ? `${message.substring(0, 9)}...` : message;

export default C;

const getUserNameByToken = (token: string): string =>
  JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).email.split(
    "@"
  )[0];

export default getUserNameByToken;

declare namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
    CHAT_ID: string;
    TEST_CHAT_ID: string;
    PLAYERS_SECRET?: string;
    PLAYERS_FILE?: string;
    PLAYERS_ENC_FILE?: string;
  }
}

declare namespace NodeJS {
    interface ProcessEnv {
        TOKEN: string;
        MONGO: string;
        BOT_NAME: string;
        API_URL: string;
        PORT: number;
        CHAT_ID: string;
        TEST_CHAT_ID: string;
        AI_KEY: string;
    }
}

import { Client, Account, Functions } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DEV_KEY = import.meta.env.VITE_APPWRITE_DEV_KEY;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);

export const functions = new Functions(client);

export default account;

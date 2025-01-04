import { EmailClient } from "@azure/communication-email";

const connectionString = "endpoint=https://aiagent.asiapacific.communication.azure.com/;accesskey=5NhI534aVUuXIp5B2AUp0GAQiF5nEWjMRbOYsckuMqa1L6Qyw8OBJQQJ99ALACULyCpYLQgbAAAAAZCSP1eh";

export const emailClient = new EmailClient(connectionString);
// import OpenAI from "openai";
// import fs from "fs";

// import dotenv from "dotenv";
// import { FileObject } from "openai/resources";
// import { Assistant } from "openai/resources/beta/assistants";
// import { Message } from "openai/resources/beta/threads/messages";
// import { Thread } from "openai/resources/beta/threads";

// dotenv.config();

// interface OpenAiParams {
//   question: string;
//   instructions?: string;
//   filesAdded?: string[];
//   threadCreatedBefore?: Thread | null;
//   assistantCreatedBefore?: Assistant | null;
//   idFilesCreatedBefore?: FileObject[] | null;
// }

// interface OpenAiResponse {
//   messages: string;
//   threadCreatedBefore: Thread;
//   assistantCreatedBefore: Assistant;
//   idFilesCreatedBefore: FileObject[];
// }

// /**
//  * This function interacts with the OpenAI API to process a user's question.
//  *
//  * @param question  The question that the user asks.
//  * @param instructions  The instructions for the assistant.
//  * @param filesAdded  The files that are added to the assistant.
//  * @param threadCreatedBefore  The thread that is created before, so the assistant can continue the conversation.
//  * @param assistantCreatedBefore  The assistant that is created before, so the assistant can continue the conversation.
//  * @param idFilesCreatedBefore The files that are created before, so the assistant can continue the conversation.
//  * @returns {{
//  *   messages: string,
//  *   threadCreatedBefore: Thread,
//  *   assistantCreatedBefore: Assistant,
//  *   idFilesCreatedBefore: FileObject[]
//  * }} An object containing:
//  *   - `messages`: The response from the assistant/model.
//  *   - `threadCreatedBefore`: The thread that is created before, so the assistant can continue the conversation.
//  *   - `assistantCreatedBefore`: The assistant that is created before, so the assistant can continue the conversation.
//  *   - `idFilesCreatedBefore`: The files that are created before, so the assistant can continue the conversation.
//  */

// export async function OpenAi({
//   question,
//   instructions = "Ask the questions about the microwave from the documents provided.",
//   filesAdded = [],
//   threadCreatedBefore = null,
//   assistantCreatedBefore = null,
//   idFilesCreatedBefore = null,
// }: OpenAiParams): Promise<OpenAiResponse> {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   if (threadCreatedBefore && assistantCreatedBefore && idFilesCreatedBefore) {
//     await openai.beta.threads.messages.create(threadCreatedBefore.id, {
//       role: "user",
//       content: question,
//     });

//     return await createTheResponse(
//       openai,
//       threadCreatedBefore,
//       assistantCreatedBefore,
//       idFilesCreatedBefore
//     );
//   }

//   const assistant: Assistant = await openai.beta.assistants.create({
//     name: "BogdanGPT",
//     instructions: instructions,
//     tools: [{ type: "file_search" }],
//     model: "gpt-4o-mini",
//   });

//   if (!filesAdded) {
//     throw new Error("Files are required to be added to the assistant");
//   }

//   const idFiles = await listTheIdFiles(openai, filesAdded);

//   const vectorStore = await openai.beta.vectorStores.create({
//     name: "Microwave Document Vector Store",
//   });

//   await openai.beta.assistants.update(assistant.id, {
//     tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
//   });

//   let thread = await openai.beta.threads.create();

//   await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: question,
//     attachments: idFiles.map((file) => ({
//       file_id: file.id,
//       tools: [{ type: "file_search" }],
//     })),
//   });

//   return await createTheResponse(openai, thread, assistant, idFiles);
// }

// async function createTheResponse(
//   openai: OpenAI,
//   thread: Thread,
//   assistant: Assistant,
//   idFiles: FileObject[]
// ) {
//   const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//   });

//   let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

//   while (runStatus.status !== "completed") {
//     runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//   }

//   const messages = await openai.beta.threads.messages.list(thread.id);

//   const lastMessageForRun: Message | undefined = messages.data
//     .filter(
//       (message) => message.run_id === run.id && message.role === "assistant"
//     )
//     .pop();

//   if (!lastMessageForRun) {
//     throw new Error("No message found for the assistant");
//   }

//   const contentBlock = lastMessageForRun.content[0];
//   if ("text" in contentBlock) {
//     return {
//       messages: `${contentBlock.text.value} \n`,
//       threadCreatedBefore: thread,
//       assistantCreatedBefore: assistant,
//       idFilesCreatedBefore: idFiles,
//     };
//   } else {
//     throw new Error("The content of the message is not in text format.");
//   }
// }

// async function listTheIdFiles(
//   openai: OpenAI,
//   documents: string[]
// ): Promise<FileObject[]> {
//   const files = await Promise.all(
//     documents.map(async (document: string) => {
//       const file = await openai.files.create({
//         file: fs.createReadStream(document),
//         purpose: "assistants",
//       });
//       console.log("File created:", file.id);
//       return file;
//     })
//   );
//   return files;
// }

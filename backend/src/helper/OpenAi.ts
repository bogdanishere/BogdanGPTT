import OpenAI from "openai";

import dotenv from "dotenv";
import { FileObject } from "openai/resources";
import { Assistant } from "openai/resources/beta/assistants";
import { Message } from "openai/resources/beta/threads/messages";
import { Thread } from "openai/resources/beta/threads";
import { GlobalResources } from "./globalResources";

dotenv.config();

interface OpenAiParams {
  question: string;
  threadCreatedBefore?: Thread | null;
}

interface OpenAiResponse {
  messages: string;
  threadCreatedBefore: Thread;
}

export async function OpenAi({
  question,
  threadCreatedBefore = null,
}: OpenAiParams): Promise<OpenAiResponse> {
  const assistant = GlobalResources.getAssistant();
  const idFiles = GlobalResources.getIdFiles();
  const openai = GlobalResources.getOpenai();

  if (threadCreatedBefore) {
    await openai.beta.threads.messages.create(threadCreatedBefore.id, {
      role: "user",
      content: question,
    });

    return await createTheResponse(openai, threadCreatedBefore, assistant);
  }

  let thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
    attachments: idFiles.map((file) => ({
      file_id: file.id,
      tools: [{ type: "file_search" }],
    })),
  });

  return await createTheResponse(openai, thread, assistant);
}

async function createTheResponse(
  openai: OpenAI,
  thread: Thread,
  assistant: Assistant
) {
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  while (runStatus.status !== "completed") {
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  const messages = await openai.beta.threads.messages.list(thread.id);

  const lastMessageForRun: Message | undefined = messages.data
    .filter(
      (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

  if (!lastMessageForRun) {
    throw new Error("No message found for the assistant");
  }

  const contentBlock = lastMessageForRun.content[0];
  if ("text" in contentBlock) {
    return {
      messages: `${contentBlock.text.value} \n`,
      threadCreatedBefore: thread,
    };
  } else {
    throw new Error("The content of the message is not in text format.");
  }
}

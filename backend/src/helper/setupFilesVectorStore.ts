import OpenAI from "openai";
import { listTheIdFiles } from "./listTheIdFiles";
import { Assistant } from "openai/resources/beta/assistants";

export async function setupFilesVectorStore(
  filesAdded: string[],
  instructions: string
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const assistant: Assistant = await openai.beta.assistants.create({
    name: "BogdanGPT",
    instructions: instructions,
    tools: [{ type: "file_search" }],
    model: "gpt-4o-mini",
  });

  if (!filesAdded) {
    throw new Error("Files are required to be added to the assistant");
  }

  const idFiles = await listTheIdFiles(openai, filesAdded);

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Microwave Document Vector Store",
  });

  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  return { idFiles, assistant, openai };
}

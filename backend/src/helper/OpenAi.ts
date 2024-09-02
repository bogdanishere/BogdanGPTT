import { OpenAI } from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { FileObject } from "openai/resources";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

interface OldContentProp {
  role: "user" | "assistant";
  content: string;
}

interface OpenAiResponse {
  text: string;
  threadId: string;
  assistantId: string;
}

/**
 *
 * @param oldContent  The previous conversation between the user and the assistant
 * @param actualQuestion  The question that the user asked
 * @param instructions The instructions for the assistant/model. That can be used to help the assistant to understand the context of the conversation. Try to not use the default instructions.
 * @param filesAdded The files we add to the assistant to help it answer the questions. The files should be in the documents folder and the path should be relative to the root of the project.
 * @returns The response from the assistant/model
 */

export async function main(
  oldContent: OldContentProp[] = [],
  actualQuestion: string,
  instructions: string = "Ask the questions about the microwave from the documents provided.",
  filesAdded: string[] = ["documents/Microwave.pdf"]
): Promise<OpenAiResponse> {
  try {
    /**
     * Create an assistant with the GPT-4o-mini model
     * change the model to gpt-4o-mini if you want to use the smaller model
     * change the name of the assistant to whatever you want
     * tools: [{ type: "file_search" }] is used to enable the file search tool
     */
    const assistant = await openai.beta.assistants.create({
      name: "BogsanGPT",
      instructions,
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
    });

    async function listTheIdFiles(documents: string[]): Promise<FileObject[]> {
      const files: FileObject[] = await Promise.all(
        documents.map(async (document) => {
          const file = await openai.files.create({
            file: fs.createReadStream(document),
            purpose: "assistants",
          });
          console.log("File created:", file.id);
          return file;
        })
      );
      return files;
    }

    const idFiles = await listTheIdFiles(filesAdded);

    /**
     * Create a vector store to store the document vectors
     */

    const vectorStore = await openai.beta.vectorStores.create({
      name: "RCM Document Vector Store",
    });

    /**
     * Add the document vectors to the vector store
     */
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    /**
     * Create a thread with the user's question and the file attachments
     */

    const thread = await openai.beta.threads.create({
      messages: [
        ...oldContent,
        {
          role: "user",
          content: actualQuestion,
          attachments: idFiles.map((file) => ({
            file_id: file.id,
            tools: [{ type: "file_search" }],
          })),
        },
      ],
    });

    return new Promise((resolve, reject) => {
      openai.beta.threads.runs
        .stream(thread.id, {
          assistant_id: assistant.id,
        })
        .on("textCreated", () => console.log("assistant >"))
        .on("toolCallCreated", (event) =>
          console.log("assistant " + event.type)
        )
        .on("messageDone", async (event) => {
          if (event.content && event.content[0].type === "text") {
            const { text } = event.content[0];
            const { annotations } = text;
            let citations = [];

            let index = 0;
            for (let annotation of annotations) {
              text.value = text.value.replace(
                annotation.text,
                "[" + index + "]"
              );

              if (annotation.type === "file_citation") {
                const { file_citation } = annotation;
                if (file_citation) {
                  const citedFile = await openai.files.retrieve(
                    file_citation.file_id
                  );
                  citations.push("[" + index + "]" + citedFile.filename);
                }
              }
              index++;
            }

            resolve({
              text: text.value,
              threadId: thread.id,
              assistantId: assistant.id,
            });
          } else {
            reject(new Error("No text content received"));
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
}

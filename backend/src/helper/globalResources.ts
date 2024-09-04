import { Assistant } from "openai/resources/beta/assistants";
import { FileObject } from "openai/resources";
import OpenAI from "openai";

let assistant: Assistant | null = null;
let idFiles: FileObject[] | null = null;
let openai: OpenAI | null = null;

export const GlobalResources = {
  setResources: (
    newAssistant: Assistant,
    newIdFiles: FileObject[],
    newOpenai: OpenAI
  ) => {
    assistant = newAssistant;
    idFiles = newIdFiles;
    openai = newOpenai;
  },

  getAssistant: () => {
    if (!assistant) {
      throw new Error("Assistant not initialized.");
    }
    return assistant;
  },

  getIdFiles: () => {
    if (!idFiles) {
      throw new Error("Files not initialized.");
    }
    return idFiles;
  },

  getOpenai: () => {
    if (!openai) {
      throw new Error("Openai not initialized.");
    }
    return openai;
  },
};

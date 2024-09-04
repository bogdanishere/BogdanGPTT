import OpenAI from "openai";
import { FileObject } from "openai/resources";
import fs from "fs";

export async function listTheIdFiles(
  openai: OpenAI,
  documents: string[]
): Promise<FileObject[]> {
  const files = await Promise.all(
    documents.map(async (document: string) => {
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

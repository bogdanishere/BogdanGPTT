import { RequestHandler } from "express";
import * as requestOpenAi from "../helper/OpenAi";

interface OldContentProp {
  role: "user" | "assistant";
  content: string;
}

export const queryDocuments: RequestHandler = async (req, res, next) => {
  const { oldContent, actualQuestion } = req.body;

  if (!actualQuestion || !oldContent) {
    return res.status(400).json({
      message: "Missing oldContent or actualQuestion in request body",
    });
  }

  function isOldContentProp(item: any): item is OldContentProp {
    return (
      typeof item === "object" &&
      item !== null &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    );
  }

  if (
    !Array.isArray(oldContent) ||
    !oldContent.every(isOldContentProp) ||
    typeof actualQuestion !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Invalid oldContent or actualQuestion" });
  }

  try {
    const result = await requestOpenAi.main(oldContent, actualQuestion);
    let contentActual: OldContentProp[] = oldContent.concat(oldContent, {
      role: "assistant",
      content: result.text,
    });
    if (oldContent.length === 0) {
      contentActual = [
        {
          role: "user",
          content: actualQuestion,
        },
        {
          role: "assistant",
          content: result.text,
        },
      ];
    }

    res.status(200).json({ response: result.text, contentActual });
  } catch (error) {
    next(error);
  }
};

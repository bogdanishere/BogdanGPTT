import { RequestHandler } from "express";
import * as requestOpenAi from "../helper/OpenAi";
import { Thread } from "openai/resources/beta/threads";

export const queryDocuments: RequestHandler = async (req, res, next) => {
  const { question, threadCreatedBefore } = req.body;

  console.log(req.body);

  if (!question) {
    return res.status(400).json({
      message: "Missing question in request body",
    });
  }

  if (threadCreatedBefore !== null && !isThread(threadCreatedBefore)) {
    return res.status(400).json({
      message: "Invalid threadCreatedBefore format",
    });
  }

  try {
    const result = await requestOpenAi.OpenAi({
      question,
      threadCreatedBefore,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

function isThread(object: any): object is Thread {
  return (
    typeof object === "object" &&
    object !== null &&
    typeof object.id === "string" &&
    typeof object.object === "string" &&
    typeof object.created_at === "number" &&
    typeof object.metadata === "object"
  );
}

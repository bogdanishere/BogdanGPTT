// import { RequestHandler } from "express";
// import * as requestOpenAi from "../helper/OpenAi";
// import { Assistant } from "openai/resources/beta/assistants";
// import { Thread } from "openai/resources/beta/threads";
// import { FileObject } from "openai/resources";

// export const queryDocuments: RequestHandler = async (req, res, next) => {
//   const {
//     question,
//     threadCreatedBefore,
//     assistantCreatedBefore,
//     idFilesCreatedBefore,
//   } = req.body;

//   console.log(req.body);

//   if (!question) {
//     return res.status(400).json({
//       message: "Missing question in request body",
//     });
//   }

//   if (threadCreatedBefore !== null && !isThread(threadCreatedBefore)) {
//     return res.status(400).json({
//       message: "Invalid threadCreatedBefore format",
//     });
//   }

//   if (assistantCreatedBefore !== null && !isAssistant(assistantCreatedBefore)) {
//     return res.status(400).json({
//       message: "Invalid assistantCreatedBefore format",
//     });
//   }

//   if (
//     idFilesCreatedBefore !== null &&
//     (!Array.isArray(idFilesCreatedBefore) ||
//       !idFilesCreatedBefore.every(isFileObject))
//   ) {
//     return res.status(400).json({
//       message: "Invalid idFilesCreatedBefore format",
//     });
//   }

//   try {
//     const result = await requestOpenAi.OpenAi({
//       question,
//       instructions:
//         "Ask the questions about the microwave from the documents provided.",
//       filesAdded: ["documents/Microwave.pdf"],
//       threadCreatedBefore,
//       assistantCreatedBefore,
//       idFilesCreatedBefore,
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// function isThread(object: any): object is Thread {
//   return (
//     typeof object === "object" &&
//     object !== null &&
//     typeof object.id === "string" &&
//     typeof object.object === "string" &&
//     typeof object.created_at === "number" &&
//     typeof object.metadata === "object"
//   );
// }

// function isAssistant(object: any): object is Assistant {
//   return (
//     typeof object === "object" &&
//     object !== null &&
//     typeof object.id === "string" &&
//     typeof object.object === "string" &&
//     typeof object.created_at === "number" &&
//     typeof object.name === "string" &&
//     typeof object.model === "string" &&
//     typeof object.instructions === "string"
//   );
// }

// function isFileObject(object: any): object is FileObject {
//   return (
//     typeof object === "object" &&
//     object !== null &&
//     typeof object.id === "string" &&
//     typeof object.filename === "string" &&
//     typeof object.bytes === "number" &&
//     typeof object.status === "string"
//   );
// }

import app from "./app";
import { GlobalResources } from "./helper/globalResources";
import { setupFilesVectorStore } from "./helper/setupFilesVectorStore";

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    const { assistant, idFiles, openai } = await setupFilesVectorStore(
      ["documents/Microwave.pdf"],
      "Ask the questions about the microwave from the documents provided."
    );

    GlobalResources.setResources(assistant, idFiles, openai);

    console.log("Files and vector store setup completed.");
  } catch (error) {
    console.error("Failed to initialize files and vector store:", error);
  }

  console.log(`Server is running on port ${PORT}`);
});

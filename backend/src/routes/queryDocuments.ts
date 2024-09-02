import express from "express";
import * as queryDocumentsController from "../controller/queryDocuments";

const router = express.Router();

router.post("/", queryDocumentsController.queryDocuments);

export default router;

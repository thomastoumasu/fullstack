import express from "express";
import patientService from "../services/patientService";
import { Response } from "express";
import { Patient } from "../../types";

const router = express.Router();

router.get("/", (_req, res: Response<Patient[]>) => {
  res.send(patientService.getPatients());
});

export default router;

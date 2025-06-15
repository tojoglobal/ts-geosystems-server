import express from "express";
import {
  get_top_clients,
  add_top_clients,
  delete_top_client,
} from "../../controllers/HomePageControllers/top-clients-controller.js";
import { upload } from "../../middleware/UploadFile.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const top_clients_router = express.Router();

top_clients_router.get("/get-top-clients", get_top_clients);
top_clients_router.post(
  "/top-clients",
  upload.array("images", 10),
  verifyAdmin,
  add_top_clients
);
top_clients_router.delete("/top-clients/:id", verifyAdmin, delete_top_client);

export default top_clients_router;

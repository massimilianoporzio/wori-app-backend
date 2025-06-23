import { Router } from "express";
import { register, getUsers,countUsers } from "../controllers/supaController";

const router = Router();


  router.post("/register", register);
  router.get("/users", getUsers);
  router.get("/users/count", countUsers);

  export default router;

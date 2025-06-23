import { Router } from "express";
import { register, getUsers,countUsers, login} from "../controllers/supaController";

const router = Router();


  router.post("/register", register);
  router.get("/users", getUsers);
  router.get("/users/count", countUsers);
  router.post("/login", login);

  export default router;

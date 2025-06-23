import { Router } from "express";
import { register } from "../controllers/authController";

const router = Router();

export default (router: Router) => {
  router.post("/register", register);
};

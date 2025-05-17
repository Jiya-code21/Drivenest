import express from "express"
import {home,register,login,user} from "../controllers/auth_controller.js"
const router=express.Router()
import {signupSchema,loginSchema} from "../validators/auth_validators.js"
import validate from "../middleware/validate_middleware.js"
import authmiddleware from "../middleware/auth_middleware.js";
router.route("/").get(home)


router.route("/register").post(validate(signupSchema), register);
router.route("/login").post(validate(loginSchema),login)
router.route("/user").get(authmiddleware,user)

export default router

import z from "zod";

// Creating an object schema for signup
const signupSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(255, { message: "Username must not exceed 255 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must not exceed 255 characters" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must not exceed 255 characters" }),
})
const loginSchema = z.object({
  email: 
  z.string({required_error:"Email is required"})
  .trim()
  .email({ message: "Invalid email" }),

  password: z.string({required_error:"Password is required"})
  .trim()
  .min(6, { message: "Password must be at least 6 characters" }),
});

//export default {signupSchema,loginSchema};
//if i use default
//then write like this
//import signupSchema from "../validators/auth_validators.js";

export  {signupSchema,loginSchema}
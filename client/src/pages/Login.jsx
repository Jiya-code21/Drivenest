import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import {useAuth} from "../store/auth"
import {toast} from "react-toastify"
import { loginSchema } from "../validators/auth_validators.js";

const URL=`${import.meta.env.VITE_BACKEND_URI}/api/auth/login`

function Login(){
  const [user, setUser]=useState({
    email:'',
    password:''
  })
const [showPassword,setShowPassword]=useState(false) 
  const navigate=useNavigate();
  const {storeTokenInLS,userAuthentication}=useAuth();


  const handleChange=(e)=>{
    const {name,value}=e.target;
    setUser((prevUser)=>({
      ...prevUser,
      [name]:value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()

    try {
      await loginSchema.parseAsync(user);
      const response=await fetch(URL, {
        method:"POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
      })

      console.log("login form",response)

      if (response.ok) {
      toast.success("Login Successful 🎉")

        const res_data = await response.json()
        storeTokenInLS(res_data.token);
//localStorage.setItem("token",res_data.token)
await userAuthentication();
        setUser({
          email: "",
          password: ""
        })
 
        navigate("/");
      } else {
        toast.error("Invalid credentials ")

        console.log("Invalid credentials")
      }
    } catch (error) {
       if (error.name === "ZodError") {
      error.errors.forEach((err) => {
        toast.error(err.message);
      });
    } 
      else {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    }
  }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
  <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-xl"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-400 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

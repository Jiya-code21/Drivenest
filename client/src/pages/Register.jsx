import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {useAuth} from "../store/auth"
import {toast} from "react-toastify"

const URL = "http://localhost:5000/api/auth/register";

function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const {storeTokenInLS}=useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const response=await fetch(URL, {
        method:"POST",
        headers:{
          'Content-Type':"application/json",
        },

        body: JSON.stringify(user),
      })

  const res_data = await response.json();
        console.log("response from server", res_data.message)
        
      if (response.ok) {
          toast.success("Registration successful 🎉")

//store the token in localhost
        storeTokenInLS(res_data.token); // Use correct case & destructured
//localStorage.setItem("token",res_data)
        setUser({ username: "", email: "", password: "" })
        navigate("/login")
      } else {
  toast.error(res_data.message || "Registration failed ")
      }
    } catch (error) {
      console.log("register", error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
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

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register

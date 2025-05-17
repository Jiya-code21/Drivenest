import { useEffect, useState } from "react"

function Home() {
  const [username,setUsername]=useState("")

  useEffect(() => {
    const fetchUser=async()=>{
      const token=localStorage.getItem("token")
      if (!token) return;

      try {
        const res=await fetch("http://localhost:5000/api/auth/user", {
          method:"GET",
          headers:{
            Authorization: `Bearer ${token}`,
          },
        })
        const data=await res.json();

        if(res.ok){
          setUsername(data.msg.username)
        }
      } 
      catch (err){
        console.error("Failed to fetch user:",err)
      }
    }
    fetchUser()
  },[])

  return (
    <div>
      <div className="min-h-screen bg-indigo-200 flex flex-col items-center justify-center px-4 py-12">

        {username && (
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
            Hello,{username} 👋
          </h2>
        )}

        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center p-8 gap-8">

          {/*Text Content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome to Endless
            </h1>

            <p className="text-gray-600 text-lg">
              A simple project to organize folders, subfolders, and images — just like a cloud drive. You can add and search images, and manage your folder structure easily.
            </p>

          </div>

          {/*Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/folder.jpg"
              alt="Folder UI"
              className="w-full max-w-md rounded-lg shadow-md object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

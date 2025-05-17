// src/pages/Dashboard.jsx
import FolderList from "../Components/FolderList.jsx"
import { useAuth } from "../store/auth.jsx"

const Dashboard = () => {
  const {isLoggedIn, isLoading} = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isLoggedIn) return <div>Please log in to access your dashboard.</div>

  return (
    <div>
      <hr className="my-4"/>
      <FolderList/>
    </div>
  )
}

export default Dashboard

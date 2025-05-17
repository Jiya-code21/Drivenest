import { createContext,useContext,useEffect,useState } from "react"

export const AuthContext=createContext()


export const AuthProvider=({children})=>{


  const [token,setToken]=useState(localStorage.getItem("token"))
  const [user,setUser]=useState(null)
  const [isLoading,setIsLoading]=useState(true)

  const authorizationToken=token?`Bearer ${token}`:""

  // Function to store token in localStorage and state
  const storeTokenInLS=(serverToken)=>{
    setToken(serverToken);
    localStorage.setItem("token",serverToken)
  };

  const isLoggedIn=!!token;

  const LogoutUser=()=>{
    setToken("");
    localStorage.removeItem("token");
    setUser(null);// Ensure the user state is cleared on logout
  };

  
  const userAuthentication=async()=>{
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });

      if (response.ok) 
        {
        const data = await response.json()
        setUser(data.userData)
      }
       else 
       {
        console.error("Error fetching user data")
        setUser(null)
      }
    }
     catch (error) {
      console.error("Error fetching user data", error)
      setUser(null)
    }
     finally {
      setIsLoading(false)
    }
  }


  useEffect(()=>{
    if (token) {
      userAuthentication();
    } else {
      setIsLoading(false);
    }
  },[token])


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        authorizationToken,
        isLoading,
        userAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access AuthContext
export const useAuth=()=>{
  const authContextValue=useContext(AuthContext);
  if (!authContextValue) {
    
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue
}

export default AuthProvider;

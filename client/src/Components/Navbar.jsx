import {NavLink} from 'react-router-dom'
import {useAuth} from "../store/auth"

function Navbar() {
  const {isLoggedIn}=useAuth()

  return (
    <div>
      <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/">Drivenest</NavLink>
          </div>

          <nav>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>

              {/* Conditional rendering */}
              {isLoggedIn ? (
                <>
                  <li><NavLink to="/dashboard">➕Folder</NavLink></li>
                  <li><NavLink to="/logout">Logout</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/login">Login</NavLink></li>
                  <li><NavLink to="/register">SignUp</NavLink></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navbar

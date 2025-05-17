import { NavLink } from "react-router-dom"

export const Error = () => {
  return (
    <section id="error-page" className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="max-w-md">
        <h2 className="text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
          404
        </h2>
        <h4 className="text-2xl font-semibold mb-2">Sorry! Page not found</h4>
        <p className="text-gray-600 mb-6">
          Oops! It seems like the page you're trying to access doesn't exist.
          If you believe there's an issue, feel free to report it, and we'll
          look into it.
        </p>
        <div className="flex justify-center gap-4">
          <NavLink
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return Home
          </NavLink>
          <NavLink
            to="/contact"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Report Problem
          </NavLink>
        </div>
      </div>
    </section>
  )
}
export default Error
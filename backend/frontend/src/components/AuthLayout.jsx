import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

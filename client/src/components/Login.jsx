import { useState } from "react";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setShowLogin, setUser, axios, LoginHandler } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "login") {
        //  Login API call
        // const { data } = await axios.post("/api/user/login", { email, password });
        // if (data.success) {
        //   setUser(data.user);
        //   setShowLogin(false);
        //   setIsLoggedIn(true);
        //   toast.success(data.message || "Login successful!");
        // } else {
        //   toast.error(data.message || "Login failed!");
        // }

        await LoginHandler(email, password)
      } else {
        //  Register API call
        const { data } = await axios.post("/api/user/register", { name, email, password });
        if (data.success) {
          setUser(data.user);
          setShowLogin(false);
          toast.success(data.message || "Account created successfully!");
        } else {
          toast.error(data.message || "Registration failed!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 text-sm text-gray-600 bg-black/50 flex items-center justify-center z-30">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Close Button */}
        <div className="w-full flex justify-end">
          <X
            className="w-6 cursor-pointer"
            onClick={() => setShowLogin(false)}
          />
        </div>

        {/* Title */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Register Name Field */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {/* Toggle between Login / Register */}
        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

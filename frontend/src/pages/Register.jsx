import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Logo from "../images/favicon.png";
import axios from "axios";
import { setAuthToken } from "./SetAuthToken";

export default function Register() {
  const [Name, setName] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [ErrorBanner, setErrorBanner] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // 👈️ prevent page refresh

    // 👇️ access input values here
    console.log("Name 👉️", Name);
    console.log("Email 👉️", Email);
    console.log("Password 👉️", Password);

    // axios call to sign in and save jwt token

    const loginPayload = {
      fullname: Name,
      email: Email,
      password: Password,
    };

    axios
      .post(
        "https://surfjournalbackend.onrender.com/api/user/register",
        loginPayload
      )
      .then((response) => {
        //get token from response
        const token = response.data.token;

        const ROLE = response.data.role;

        const Namefull = response.data.fullname;

        // display name

        localStorage.setItem("Namey", Namefull);

        //set JWT token to local
        localStorage.setItem("token", token);

        //set JWT token to local
        localStorage.setItem("role", ROLE);

        //set token to axios common header
        setAuthToken(token);

        //redirect user to home page
        window.location.href = "/";
      })
      .catch(function (err) {
        console.log(err), setErrorBanner(true);
      });

    // 👇️ clear all input values in the form
    setName("");
    setEmail("");
    setPassword("");
  };

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      <div className="bg-gray-900">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img className="mx-auto h-full w-auto" src={Logo} />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-200">
                Surf Journal
              </h2>

              <h2 className="mt-2 text-center text-1xl tracking-tight text-gray-200">
                Register Page
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name"
                    name="Name"
                    type="text"
                    autoComplete="name"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Name"
                    onChange={(event) => setName(event.target.value)}
                    value={Name}
                  />
                </div>

                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    onChange={(event) => setEmail(event.target.value)}
                    value={Email}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={passwordShown ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={Password}
                  />
                  <div className="flex text-sm">
                    <input
                      type="checkbox"
                      onClick={togglePassword}
                      className="w-4 h-4 m-3 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <p className="mt-2 text-gray-200">Show Password</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="/signin"
                    className="font-medium text-gray-200 hover:text-slate-500"
                  >
                    Login Page
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-600 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-slate-500 group-hover:text-slate-400"
                      aria-hidden="true"
                    />
                  </span>
                  Register
                </button>
              </div>
            </form>

            {ErrorBanner ? <IncorrectBanner /> : null}
          </div>
        </div>
        <div className="bg-gray-900 h-96"></div>
      </div>
    </>
  );
}

function IncorrectBanner() {
  return (
    <>
      <div role="alert">
        <div class="bg-red-500 text-white font-bold rounded px-4 py-2">
          Incorrect Credentials
        </div>
      </div>
    </>
  );
}

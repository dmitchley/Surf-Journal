import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// the Journal component shows all the journals and when its loading it conditionally renders the loading svg

function Journal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [journals, setjournal] = useState([]);

  const url = "https://surf-journal-backend.onrender.com/api/journal";

  // get all journals
  const getJournals = () => {
    axios
      .get("https://surf-journal-backend.onrender.com/api/journals")
      .then((response) => {
        setjournal(response.data.journals);
      })
      .catch(function (err) {
        console.log(err), setErrorBanner(true);
      });
  };

  useEffect(function () {
    getJournals();
    console.log(journals);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div>
              {journals.length ? (
                journals.map((surf) => {
                  return (
                    <>
                      <div className="bg-white mb-6" key={surf._id}>
                        <div className="mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
                          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="block">
                              {" "}
                              {surf.location}{" "}
                              <b className="font-light">- {surf.wave}</b>
                            </span>
                            <span className="block text-slate-600">
                              {surf.time}{" "}
                              <b className="font-light">
                                -{" "}
                                {new Date(surf.created_at).toLocaleDateString()}
                              </b>
                            </span>
                            <p className="font-light text-base">{surf.user}</p>
                          </h2>

                          <a
                            href={`/journal:${surf._id}`}
                            id="button"
                            className="mt-5 inline-flex items-center justify-center rounded-md border border-transparent bg-slate-600 px-5 py-3 text-base font-medium text-white hover:bg-black"
                          >
                            See Journal
                          </a>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <>
                  <center>
                    <svg
                      aria-hidden="true"
                      class="mr-2 w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </center>
                </>
              )}
            </div>
          </div>
        </main>

        <div></div>
      </div>
    </div>
  );
}

export default Journal;

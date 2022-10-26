import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";

// conditional rendering below of tables based on your user role

export default function JournalDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personalData, setpersonalData] = useState([]);
  const [userlist, setuserlist] = useState([]);
  const [JournalList, setJournalList] = useState([]);
  const [personalJournal, setpersonalJournal] = useState([]);

  // personal data for each user to display in table

  const getPersonalData = async () => {
    await axios
      .get("https://surf-journal-backend.onrender.com/api/user/me", {
        // get the token from local storage and authorize the user with the token
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setpersonalData(response.data);
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // personal journals for each user to display in table

  const getPersonalJournals = async () => {
    await axios
      .get(
        "https://surf-journal-backend.onrender.com/api/journals/myJournals",
        {
          // get the token from local storage and authorize the user with the token
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {
        setpersonalJournal(response.data.foundJournals);
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // get all users for the admin account

  const getUsers = async () => {
    await axios
      .get("https://surf-journal-backend.onrender.com/api/user/", {
        // get the token from local storage and authorize the user with the token
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setuserlist(response.data.users);
        // removing the admin from the delete list to avoid issues
        let adminID = "6351c87f062ed181cd862d5f";

        setuserlist((current) =>
          current.filter((employee) => {
            return employee._id !== adminID;
          })
        );
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // only the admin can access all the journals and delete them

  const getAllJournals = async () => {
    await axios
      .get("https://surf-journal-backend.onrender.com/api/journals", {
        // get the token from local storage and authorize the user with the token
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setJournalList(response.data.journals);
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // delete function for the admin user

  const DeleteUser = (User) => {
    axios
      .delete(`https://surf-journal-backend.onrender.com/api/user/${User}`, {
        // get the token from local storage and authorize the user with the token
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
    window.location.reload();
  };

  // delete journal function

  const DeleteJournal = (Journal) => {
    axios
      .delete(
        `https://surf-journal-backend.onrender.com/api/journals/${Journal}`,
        {
          // get the token from local storage and authorize the user with the token
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      .catch(function (error) {
        // handle error
        console.log(error);
      });
    window.location.reload();
  };

  useEffect(
    function async() {
      getPersonalData();
      getPersonalJournals();

      // if admin call these function and render them

      if (personalData.role === "Admin") {
        getUsers();
        getAllJournals();
      }

      console.log(personalJournal);
    },
    [personalData.role]
  );

  function AdminHeader() {
    return (
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Delete Users
        </h3>
      </div>
    );
  }

  function JournalHeader() {
    return (
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Users Journals
        </h3>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white mt-6">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Applicant Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {personalData.fullname}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {personalData.email}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Password
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {personalData.password}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {personalData.role}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
        {/* delete users here */}
        {/* userlist */}
        {personalData.role === "Admin" ? (
          <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white mt-6">
            {personalData.role === "Admin" ? <AdminHeader /> : <></>}

            {userlist.length ? (
              userlist.map((user) => {
                return (
                  <div key={user._id}>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            {user.fullname}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <button
                              type="button"
                              className="mb-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2"
                              onClick={() => DeleteUser(user._id)}
                            >
                              Delete User
                            </button>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <></>
              </>
            )}
          </main>
        ) : (
          <></>
        )}
        {/* delete users here */}
        {/* journals here */}
        {personalData.role === "Admin" ? (
          <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white mt-6">
            {personalData.role === "Admin" ? <JournalHeader /> : <></>}

            {JournalList.length ? (
              JournalList.map((journal, index) => {
                return (
                  <div key={index}>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            <b>{journal.location}</b> - <i>{journal.time}</i> -{" "}
                            {new Date(journal.created_at).toLocaleDateString()}{" "}
                            - <b>{journal.user}</b>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <button
                              type="button"
                              className="mb-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2"
                              onClick={() => DeleteJournal(journal._id)}
                            >
                              Delete Journal
                            </button>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <>
                  {" "}
                  <svg
                    aria-hidden="true"
                    class=" w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </svg>{" "}
                </>
              </>
            )}
          </main>
        ) : (
          <></>
        )}
        {/* journals here */}

        {/* personal journals */}

        {personalData.role === "user" ? (
          <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white mt-6">
            {personalData.role === "user" ? <JournalHeader /> : <></>}

            {personalJournal.length ? (
              personalJournal.map((journal) => {
                return (
                  <div key={journal._id}>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            <b>{journal.location}</b> - <i>{journal.time}</i> -{" "}
                            {new Date(journal.created_at).toLocaleDateString()}{" "}
                            - <b>{journal.user}</b>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <button
                              type="button"
                              className="mb-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2"
                              onClick={() => DeleteJournal(journal._id)}
                            >
                              Delete Journal
                            </button>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <>
                  <center>
                    <>
                      {" "}
                      <svg
                        aria-hidden="true"
                        class=" w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                      </svg>{" "}
                    </>
                  </center>
                </>
              </>
            )}
          </main>
        ) : (
          <></>
        )}

        {/* personal journals */}
      </div>
    </div>
  );
}

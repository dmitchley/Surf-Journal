import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JournalDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [specificJournal, setspecificJournal] = useState([]);
  const [Comment, setComment] = useState([]);
  const [journalComment, setjournalComment] = useState("");

  // react-router-dom useParams passes the id of the particular journal get data function and shows the particular journal information

  let { id } = useParams();

  const getData = async () => {
    await axios
      .get(
        `https://surf-journal-backend.onrender.com/api/journals/${id.slice(1)}`
      )
      .then(function (response) {
        setspecificJournal(response.data.journal);
        setComment(response.data.journal.comments);
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // add comment function

  const addComment = async (event) => {
    event.preventDefault();

    const CommentPayload = {
      text: journalComment,
    };

    await axios
      .put(
        `https://surf-journal-backend.onrender.com/api/journals/comment/${id.slice(
          1
        )}`,
        CommentPayload
      )
      .then((response) => {
        console.log(response), window.location.reload();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
    window.location.reload();
  };

  useEffect(function () {
    getData();

    console.log(Comment);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white mt-6">
          <div class="antialiased">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              {specificJournal.created_at ? (
                <div class="flex flex-col md:flex-row -mx-4">
                  <img
                    alt="ecommerce"
                    class="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
                    src={specificJournal.image}
                  />

                  <div class="md:flex-1 px-4">
                    <h2 class="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                      {specificJournal.location} - {specificJournal.time} -
                      {new Date(
                        specificJournal.created_at
                      ).toLocaleDateString()}
                    </h2>

                    <div class=" items-center my-4">
                      <div>
                        <b>Swell Height</b>- {specificJournal.wave}
                      </div>
                      <div className="mt-2">
                        {" "}
                        <b>Swell Direction</b>- {specificJournal.waveDirection}
                      </div>

                      <div className="mt-2">
                        {" "}
                        <b>Wind Direction</b>- {specificJournal.windDirection}
                      </div>
                    </div>

                    <p class="text-gray-500 text-sm">
                      By{" "}
                      <a href="#" class="text-black hover:underline">
                        {specificJournal.user}
                      </a>
                    </p>

                    <p class="text-gray-900 pt-4 hover:font-bold">
                      {specificJournal.text}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <center>
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
                  </center>
                </>
              )}

              <p class="text-gray-900 pt-4 text-center bg-white rounded-lg border border-gray-200 shadow-md mt-5">
                <h1 className="text-center mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                  Comments Section
                </h1>
                {Comment ? (
                  Comment.map((comment) => {
                    return (
                      <>
                        <div
                          key={comment._id}
                          className="mt-5 bg-gray-50 border border-gray-150 shadow-black"
                        >
                          <p>{comment.text}</p>
                          <span className="font-bold">{comment.user}</span>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <h1>No Comments</h1>
                )}
                <div className="bg-gray-100">
                  <div className="mt-1">
                    <form className="mt-8 space-y-6" onSubmit={addComment}>
                      <textarea
                        onChange={(event) =>
                          setjournalComment(event.target.value)
                        }
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        defaultValue={""}
                      />{" "}
                      <button
                        type="submit"
                        className="mb-3 inline-flex justify-center rounded-md border border-transparent bg-slate-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2"
                      >
                        Add Comment
                      </button>
                    </form>
                  </div>
                </div>
              </p>
              {/* comment section */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

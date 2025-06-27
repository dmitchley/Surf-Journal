import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import FileBase64 from "react-file-base64";
import axios from "axios";

export default function ModalForm({ open, setOpen, journal }) {
  const cancelButtonRef = useRef(null);
  const [journalNotes, setjournalNotes] = useState([]);
  const [journalImage, setjournalImage] = useState("");
  const [loading, setloading] = useState(false);

  const SubmitJournal = (event) => {
    event.preventDefault(); // 👈️ prevent page refresh

    // payload from particular tr that hold surf journal information plus the image and notes you add

    const Payload = {
      text: journalNotes,
      time: journal.time,
      wave: journal.wave,
      image: journalImage.image,
      waveDirection: journal.waveDirection,
      windDirection: journal.windDirection,
      location: journal.location,
    };

    console.log("Notes 👉️", Payload);

    axios
      .post("http://localhost:5000/api/journals", Payload)
      .then((response) => {
        console.log(response.data), (window.location.href = "/journal");
      })
      .catch(function (err) {
        console.log(err), setErrorBanner(true), alert("File Upload Error");
      });
    showLoader();
  };

  function showLoader() {
    setloading(true);
  }

  const LoadingBar = () => {
    return (
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
        </svg>
      </center>
    );
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 "
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-100 bg-opacity-10 transition-opacity z-10" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all w-2/5 ">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3   ">
                      <div className="text-center">
                        {loading == true ? <LoadingBar /> : <></>}
                        <h3>
                          <b>Height:</b>
                          {journal.wave}
                        </h3>

                        <h3>
                          <b>Time:</b> {journal.time}
                        </h3>

                        <h3>
                          <b> Wave Direction:</b> {journal.waveDirection}
                        </h3>

                        <h3>
                          <b>Wind Direction:</b> {journal.windDirection}
                        </h3>
                      </div>
                      <div>
                        <form
                          className="mt-8 space-y-6"
                          onSubmit={SubmitJournal}
                        >
                          <div>
                            <label htmlFor="name" className="sr-only">
                              Comments
                            </label>
                            <textarea
                              id="name"
                              name="Name"
                              type="textarea "
                              autoComplete="name"
                              onChange={(event) =>
                                setjournalNotes(event.target.value)
                              }
                              value={journalNotes}
                              className="relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="Journal Notes"
                            />
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex   sm:px-6 my-4">
                            <button
                              type="file"
                              className="mr-5 w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus: focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Submit
                            </button>
                            <div className="mt-1">
                              <FileBase64
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) =>
                                  setjournalImage({ image: base64 })
                                }
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

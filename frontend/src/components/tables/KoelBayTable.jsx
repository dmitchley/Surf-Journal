import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalForm from "../ModalForm";

function KoelBayTable() {
  const [dayOne, setdayOne] = useState([]);
  const [dayTwo, setdayTwo] = useState([]);
  const [dayThree, setdayThree] = useState([]);
  const [dayFour, setdayFour] = useState([]);
  const [dayFive, setdayFive] = useState([]);
  const [journal, setjournal] = useState("");
  const [open, setOpen] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/spots/koelbay"
      );

      const surfData = response.data;

      const mappedData = surfData.map((entry) => ({
        time: new Date(entry.timestamp * 1000).toLocaleTimeString(),
        waveHeight: entry.waveHeight[0].toFixed(2) + "m",
        waveDirectionSS: entry.waveDirection[0].toFixed(1) + "°",
        wavePower: entry.wavePower[0].toFixed(2),
        swellPeriod: entry.swellPeriod[0],
        wind: "Offshore",
      }));

      const pointsPerDay = 8;
      const numberOfDays = Math.ceil(mappedData.length / pointsPerDay);

      const days = Array.from({ length: numberOfDays }, (_, dayIndex) =>
        mappedData.slice(dayIndex * pointsPerDay, (dayIndex + 1) * pointsPerDay)
      );

      setdayOne(days[0] || []);
      setdayTwo(days[1] || []);
      setdayThree(days[2] || []);
      setdayFour(days[3] || []);
      setdayFive(days[4] || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const current = new Date();
  const dayonedate = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const daytwodate = `${current.getDate() + 1}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const dayThreedate = `${current.getDate() + 2}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const dayFourdate = `${current.getDate() + 3}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const dayFivedate = `${current.getDate() + 4}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const Update = async (time, waveHeight, waveDirection, wind) => {
    setjournal({
      time: time,
      wave: waveHeight,
      waveDirection: waveDirection,
      windDirection: wind,
      location: "Koel Bay",
    });
    setOpen(true);
  };

  return (
    <>
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
        <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
          <h4 className=" text-black text-sm">{dayonedate}</h4>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                  <th className="p-2 whitespace-nowrap"></th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      SURF HEIGHT
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap"></th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      WIND DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap"></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {dayOne.length ? (
                  dayOne.map((surf, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{surf.time}</div>
                        </td>
                        {surf.waveHeight.includes("6ft") ||
                        surf.waveHeight.includes("7ft") ||
                        surf.waveHeight.includes("8ft") ? (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-400 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        ) : (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-300 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        )}

                        <td className="p-2 whitespace-nowrap"></td>

                        <td className="p-2  whitespace-nowrap">
                          <div className="text-left">
                            {surf.waveDirectionSS}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {surf.wind.includes("Onshore") ? (
                            <div className="text-left font-medium text-red-500">
                              {surf.wind}
                            </div>
                          ) : (
                            <div className="text-left font-medium text-green-500">
                              {surf.wind}
                            </div>
                          )}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          <button
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              Update(
                                surf.time,
                                surf.waveHeight,
                                surf.waveDirectionSS,
                                surf.wind
                              )
                            }
                          >
                            Add Journal
                          </button>
                          <ModalForm
                            open={open}
                            setOpen={setOpen}
                            journal={journal}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h1 className="mt-5 text-1xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-3xl">
                          <span className="block text-slate-600 text-center">
                            Data is Loading
                          </span>
                        </h1>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
        <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
          <h4 className=" text-black text-sm">{daytwodate}</h4>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                  <th className="p-2 whitespace-nowrap"></th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      SURF HEIGHT
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap"></th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      WIND DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap"></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {dayTwo.length ? (
                  dayTwo.map((surf, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{surf.time}</div>
                        </td>
                        {surf.waveHeight.includes("6ft") ||
                        surf.waveHeight.includes("7ft") ||
                        surf.waveHeight.includes("8ft") ? (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-400 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        ) : (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-300 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        )}

                        <td className="p-2 whitespace-nowrap"></td>

                        <td className="p-2  whitespace-nowrap">
                          <div className="text-left">
                            {surf.waveDirectionSS}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {surf.wind.includes("Onshore") ? (
                            <div className="text-left font-medium text-red-500">
                              {surf.wind}
                            </div>
                          ) : (
                            <div className="text-left font-medium text-green-500">
                              {surf.wind}
                            </div>
                          )}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          <button
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              Update(
                                surf.time,
                                surf.waveHeight,
                                surf.waveDirectionSS,
                                surf.wind
                              )
                            }
                          >
                            Add Journal
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h1 className="mt-5 text-1xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-3xl">
                          <span className="block text-slate-600 text-center">
                            Data is Loading
                          </span>
                        </h1>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* end of table */}
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
        <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
          <h4 className=" text-black text-sm">{dayThreedate}</h4>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                  <th className="p-2 whitespace-nowrap"></th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      SURF HEIGHT
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap"></th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      WIND DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap"></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {dayThree.length ? (
                  dayThree.map((surf, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{surf.time}</div>
                        </td>
                        {surf.waveHeight.includes("6ft") ||
                        surf.waveHeight.includes("7ft") ||
                        surf.waveHeight.includes("8ft") ? (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-400 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        ) : (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-300 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        )}

                        <td className="p-2 whitespace-nowrap"></td>

                        <td className="p-2  whitespace-nowrap">
                          <div className="text-left">
                            {surf.waveDirectionSS}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {surf.wind.includes("Onshore") ? (
                            <div className="text-left font-medium text-red-500">
                              {surf.wind}
                            </div>
                          ) : (
                            <div className="text-left font-medium text-green-500">
                              {surf.wind}
                            </div>
                          )}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          <button
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              Update(
                                surf.time,
                                surf.waveHeight,
                                surf.waveDirectionSS,
                                surf.wind
                              )
                            }
                          >
                            Add Journal
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h1 className="mt-5 text-1xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-3xl">
                          <span className="block text-slate-600 text-center">
                            Data is Loading
                          </span>
                        </h1>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
        <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
          <h4 className=" text-black text-sm">{dayFourdate}</h4>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                  <th className="p-2 whitespace-nowrap"></th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      SURF HEIGHT
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap"></th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      WIND DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap"></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {dayFour.length ? (
                  dayFour.map((surf, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{surf.time}</div>
                        </td>
                        {surf.waveHeight.includes("6ft") ||
                        surf.waveHeight.includes("7ft") ||
                        surf.waveHeight.includes("8ft") ? (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-400 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        ) : (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-300 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        )}

                        <td className="p-2 whitespace-nowrap"></td>

                        <td className="p-2  whitespace-nowrap">
                          <div className="text-left">
                            {surf.waveDirectionSS}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {surf.wind.includes("Onshore") ? (
                            <div className="text-left font-medium text-red-500">
                              {surf.wind}
                            </div>
                          ) : (
                            <div className="text-left font-medium text-green-500">
                              {surf.wind}
                            </div>
                          )}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          <button
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              Update(
                                surf.time,
                                surf.waveHeight,
                                surf.waveDirectionSS,
                                surf.wind
                              )
                            }
                          >
                            Add Journal
                          </button>
                          <ModalForm
                            open={open}
                            setOpen={setOpen}
                            journal={journal}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h1 className="mt-5 text-1xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-3xl">
                          <span className="block text-slate-600 text-center">
                            Data is Loading
                          </span>
                        </h1>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
        <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
          <h4 className=" text-black text-sm">{dayFivedate}</h4>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                  <th className="p-2 whitespace-nowrap"></th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      SURF HEIGHT
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap"></th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left text-lg">
                      WIND DIRECTION
                    </div>
                  </th>

                  <th className="p-2 whitespace-nowrap"></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {dayFive.length ? (
                  dayFive.map((surf, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{surf.time}</div>
                        </td>
                        {surf.waveHeight.includes("6ft") ||
                        surf.waveHeight.includes("7ft") ||
                        surf.waveHeight.includes("8ft") ? (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-400 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        ) : (
                          <td className="p-2 w-1 whitespace-nowrap bg-slate-300 font-bold text-center">
                            {surf.waveHeight}
                          </td>
                        )}

                        <td className="p-2 whitespace-nowrap"></td>

                        <td className="p-2  whitespace-nowrap">
                          <div className="text-left">
                            {surf.waveDirectionSS}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {surf.wind.includes("Onshore") ? (
                            <div className="text-left font-medium text-red-500">
                              {surf.wind}
                            </div>
                          ) : (
                            <div className="text-left font-medium text-green-500">
                              {surf.wind}
                            </div>
                          )}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          <button
                            className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              Update(
                                surf.time,
                                surf.waveHeight,
                                surf.waveDirectionSS,
                                surf.wind
                              )
                            }
                          >
                            Add Journal
                          </button>
                          <ModalForm
                            open={open}
                            setOpen={setOpen}
                            journal={journal}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h1 className="mt-5 text-1xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-3xl">
                          <span className="block text-slate-600 text-center">
                            Data is Loading
                          </span>
                        </h1>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default KoelBayTable;

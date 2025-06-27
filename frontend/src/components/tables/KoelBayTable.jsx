import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalForm from "../ModalForm";

function KoelBayTable() {
  const [dayOne, setDayOne] = useState([]);
  const [dayTwo, setDayTwo] = useState([]);
  const [dayThree, setDayThree] = useState([]);
  const [journal, setJournal] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
//
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/spots/koelbay");
      const allData = response.data[0][0];
      
      // Split data properly without mutating original array
      setDayOne(allData.slice(0, 8));
      setDayTwo(allData.slice(8, 16));
      setDayThree(allData.slice(16, 24));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Better date formatting
  const formatDate = (daysToAdd = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const dayOneDate = formatDate(0);
  const dayTwoDate = formatDate(1);
  const dayThreeDate = formatDate(2);

  const updateJournal = (time, waveHeight, waveDirection, wind) => {
    setJournal({
      time: time,
      wave: waveHeight,
      waveDirection: waveDirection,
      windDirection: wind,
      location: "Koel Bay",
    });
    setOpen(true);
  };

  // Helper function to determine if waves are big (3m+ for meters)
  const isBigWave = (waveHeight) => {
    const heightNum = parseFloat(waveHeight.split('-')[1]); // Get max height
    return heightNum >= 3.0;
  };

  // Helper function to determine wind color
  const getWindColor = (wind) => {
    if (wind.includes("onshore") || wind.includes("Onshore")) {
      return "text-red-500";
    }
    return "text-green-500";
  };

  // Reusable table component
  const SurfTable = ({ data, date, loading }) => (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 mt-5">
      <header className="px-5 py-2 border-b border-slate-100 bg-slate-100">
        <h4 className="text-black text-sm">{date}</h4>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left text-lg">TIME</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left text-lg">SURF HEIGHT</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left text-lg">DIRECTION</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left text-lg">WIND</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left text-lg">ACTION</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <h1 className="text-xl font-bold text-slate-600">
                      Data is Loading...
                    </h1>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((surf, index) => (
                  <tr key={index}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left font-medium">{surf.time}</div>
                    </td>
                    <td className={`p-2 whitespace-nowrap font-bold text-center ${
                      isBigWave(surf.waveHeight) 
                        ? 'bg-slate-400 text-white' 
                        : 'bg-slate-300 text-slate-800'
                    }`}>
                      {surf.waveHeight}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left">{surf.waveDirectionSS}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className={`text-left font-medium ${getWindColor(surf.wind)}`}>
                        {surf.wind}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <button
                        className="bg-slate-700 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        onClick={() =>
                          updateJournal(
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <h1 className="text-xl font-bold text-red-600">
                      No data available
                    </h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SurfTable data={dayOne} date={dayOneDate} loading={loading} />
      <SurfTable data={dayTwo} date={dayTwoDate} loading={loading} />
      <SurfTable data={dayThree} date={dayThreeDate} loading={loading} />
      
      <ModalForm open={open} setOpen={setOpen} journal={journal} />
    </>
  );
}

export default KoelBayTable
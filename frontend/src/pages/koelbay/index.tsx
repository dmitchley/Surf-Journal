import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '@/lib/index';

const createJournalEntry = async (journalData) => {

  // console.log(journalData)

  try {
    const response = await fetch('http://localhost:5000/api/journals/create-journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(journalData),
    });

    if (!response.ok) {
      throw new Error('Failed to create journal entry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

// Utility function to group data by day
const groupDataByDay = (data: any[]) => {
  return data.reduce((acc, row) => {
    const date = new Date(row.timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(row);
    return acc;
  }, {} as Record<string, any[]>);
};

// Modal Component for Journal Submission
const JournalModal = ({ showModal, setShowModal, rowData, userId }) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const journalData = {
      text,
      time: new Date(rowData.timestamp * 1000).toISOString(),
      wave: {
        height: rowData.waveHeight[0],
        unit: 'meters',
      },
      wave_direction: rowData.waveDirection[0],
      wind_direction: 'SW', // Assuming this is static, adjust if needed
      location: {
        latitude: -34.1386,
        longitude: 18.3305,
        name: 'Kommetjie',
      },
      user_id: userId,
    };

    await createJournalEntry(journalData);
    setShowModal(false);
  };

  const [image, setImage] = useState(null);

  // console.log(image)

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Create Journal Entry</h2>
        <input
          type="text"
          placeholder="Journal title"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Journal message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          rows={5}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#18202b] text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Table component to display grouped data with Journal button per row
const DayTable = ({ day, data, userId }: { day: string; data: any[]; userId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleJournalClick = (row) => {
    setSelectedRowData(row);
    setShowModal(true);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-2">{day}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Wave Height (m)
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Wave Direction (°)
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Wave Power (kW)
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Swell Period (s)
              </th>
              <th className="px-6 py-3 bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(row.timestamp * 1000).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: 'UTC',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{row.waveHeight[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.waveDirection[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.wavePower[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.swellPeriod[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleJournalClick(row)}
                    className="bg-[#18202b] text-white px-4 py-2 rounded"
                  >
                    Journal
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRowData && (
        <JournalModal
          showModal={showModal}
          setShowModal={setShowModal}
          rowData={selectedRowData}
          userId={userId}
        />
      )}
    </div>
  );
};

const KoelBayPage = ({ data }: { data: any[] }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  console.log("userId " + userId)

  const groupedData = groupDataByDay(data);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Koel Bay Surf Data</h1>
      {Object.entries(groupedData).map(([day, dayData], index) => (
        <DayTable key={index} day={day} data={dayData} userId={userId} />
      ))}
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/spots/koelbay');
    const data = await res.json();

    return {
      props: { data },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { data: [] },
    };
  }
};

export default withAuth(KoelBayPage);

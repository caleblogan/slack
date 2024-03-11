import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import { UserContext } from './context';
import { useState } from 'react';
import { ApiUser } from '../../server/src/app';
import Client from './pages/Client';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: "/client/:workspaceId",
    element: <Client />,
    children: [
      {
        path: ":channelId?",
        element: <HomePage />
      },
      {
        path: "dms",
        element: <div>dms</div>
      },
      {
        path: "activity",
        element: <div>activity</div>
      },
      {
        path: "later",
        element: <div>later</div>
      }
    ]
  }
]);

export default function App() {
  const [user] = useState<ApiUser | null>(null);

  // useEffect(() => {
  //   getMe()
  //     .then((thisUser) => { setUser(thisUser); })
  // }, [])

  return (
    <>
      <UserContext.Provider value={user}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
}
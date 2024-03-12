import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import { UserContext } from './context';
import { useState } from 'react';
import { ApiUser } from '../../server/src/app';
import Client from './pages/Client';
import HomePage from './pages/HomePage';
import DMsPage from './pages/DMsPage';
import ActivityPage from './pages/ActivityPage';
import LaterPage from './pages/LaterPage';

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
        element: <DMsPage />
      },
      {
        path: "activity",
        element: <ActivityPage />
      },
      {
        path: "later",
        element: <LaterPage />
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
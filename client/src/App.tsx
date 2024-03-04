import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import { UserContext } from './context';
import { useEffect, useState } from 'react';
import { ApiUser } from '../../server/src/app';
import { getMe } from './api/api';
import Client from './pages/Client';

const router = createBrowserRouter([
  { path: "/client", element: <Client /> }
]);

export default function App() {
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    getMe()
      .then((thisUser) => { setUser(thisUser); })
  }, [])

  return (
    <>
      <UserContext.Provider value={user}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
}
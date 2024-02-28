import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import LinksPage from './pages/LinksPage';
import { UserContext } from './context';
import { useEffect, useState } from 'react';
import { ApiUser } from '../../server/src/app';
import { getMe } from './api/api';

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/:username", element: <LinksPage /> },
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
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import PostListPage from './pages/HomePage.js'
import CreatePostPage from './pages/CreatePostPage.js'
import LoginPage from './pages/auth/LoginPage.js'
import RegisterPage from './pages/auth/RegisterPage.js'
import HomePage from './pages/HomePage.js'


import store from './store.js'
import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';



const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/create-post',
    element: <CreatePostPage />,
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </React.StrictMode>
);


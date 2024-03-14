import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import PostListPage from './pages/HomePage.js'
import CreatePostPage from './pages/CreatePostPage.js'
import LoginPage from './pages/auth/LoginPage.js'
import RegisterPage from './pages/auth/RegisterPage.js'
import HomePage from './pages/HomePage.js'


import store from './store.js'
import { connect, Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InitialLoader from './components/InitialLoader.js';
import ProfilePage from './pages/ProfilePage';
import ViewPostPage from './pages/ViewPostPage'
import PianoPage from './pages/PianoPage.js'
 

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/posts/:postid',
    element: <ViewPostPage />
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
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/piano',
    element: <PianoPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <InitialLoader />
    <RouterProvider router={router} />
  </Provider>
);



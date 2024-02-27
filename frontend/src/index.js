import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PostListPage from './pages/PostListPage.js'
import CreatePostPage from './pages/CreatePostPage.js'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: '/',
    element: <PostListPage />,
  },
  {
    path: '/create-post',
    element: <CreatePostPage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


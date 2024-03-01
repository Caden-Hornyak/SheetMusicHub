import PostListPage from './pages/HomePage.js';
import CreatePostPage from './pages/CreatePostPage';

import { Provider } from 'react-redux';
import store from './store';

import Register from './pages/auth/RegisterPage.js'


function App() {
  return (
      <div className='App'>
        
        <Register />
      </div>
  );
}

export default App;

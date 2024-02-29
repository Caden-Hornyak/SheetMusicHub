import PostListPage from './pages/HomePage.js';
import CreatePostPage from './pages/CreatePostPage';

import { Provider } from 'react-redux';
import store from './store';

import Register from './pages/RegisterPage.js'
import Navbar from './components/Navbar';

function App() {
  return (
      <div className='App'>
        <Navbar />
        <Register />
      </div>
  );
}

export default App;

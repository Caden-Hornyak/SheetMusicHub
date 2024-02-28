import PostListPage from './pages/Homepage';
import CreatePostPage from './pages/CreatePostPage';

import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    // <Provider>
      <div className='App'>
        <PostListPage />
        <h3>Hellos</h3>
      </div>
    // </Provider>
    
  );
}

export default App;

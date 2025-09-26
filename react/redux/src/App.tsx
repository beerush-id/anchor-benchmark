import { createBrowserRouter, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import Home from './Home';
import Complex from './Complex';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/complex',
    element: <Complex />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

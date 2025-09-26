import { createBrowserRouter, RouterProvider } from 'react-router';
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
  return <RouterProvider router={router} />;
}

export default App;

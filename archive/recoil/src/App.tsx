import { createBrowserRouter, RouterProvider } from 'react-router';
import { RecoilRoot } from 'recoil';
import './App.css';
import Home from './Home.js';
import Complex from './Complex.js';

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
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;

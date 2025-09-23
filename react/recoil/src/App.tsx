import { createBrowserRouter, RouterProvider } from 'react-router';
import { RecoilRoot } from 'recoil';
import './App.css';
import Home from './Home';
import Medium from './Medium';
import Complex from './Complex';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/medium",
    element: <Medium />,
  },
  {
    path: "/complex",
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
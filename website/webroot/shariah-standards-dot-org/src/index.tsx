import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { SignIn } from './routes/SignIn';
import { ErrorPage } from './RoureError';
import { PrayerTimesWithQiblaMap } from './Compnents/PrayerTimesWithQiblaMap';
import { Menu } from './routes/Menu';
import { ZakatCalculator } from './routes/ZakatCalculator';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement:<ErrorPage/>,
    children:[
      {
        path:"/",
        element:<PrayerTimesWithQiblaMap/>
      },
      {
        path:"/SignIn",
        element:<SignIn/>
      },
      {
        path:"/Menu",
        element:<Menu/>
      },
      {
        path:"/Zakat",
        element:<ZakatCalculator/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

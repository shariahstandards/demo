import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
//import { SignIn } from './Compnents/SignIn';
import { ErrorPage } from './RoureError';
import { PrayerTimesWithQiblaMap } from './Compnents/PrayerTimesWithQiblaMap';
import { Menu } from './Compnents/Menu';
import { ZakatCalculator } from './Compnents/ZakatCalculator';
import { InheritanceShares } from './Compnents/InheritanceShares';
import { QuranVerse } from './Compnents/QuranVerse';
import { QuranSearch } from './Compnents/QuranSearch';


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
      // {
      //   path:"/SignIn",
      //   element:<SignIn/>
      // },
      {
        path:"/Menu",
        element:<Menu/>
      },
      {
        path:"/Zakat",
        element:<ZakatCalculator/>
      },
      {
        path:"/Inheritance",
        element:<InheritanceShares/>
      },
      {
        path:"/QuranVerse",
        element:<QuranVerse/>
      },
      {
        path:"/QuranVerse/:chapter/:verse",
        element:<QuranVerse/>
      },
      {
        path:"/QuranSearch",
        element:<QuranSearch/>
      },
      {
        path:"/QuranSearch/:searchLanguage",
        element:<QuranSearch/>
      },
      {
        path:"/QuranSearch/:searchLanguage/:searchText",
        element:<QuranSearch/>
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

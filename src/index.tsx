import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-notifications-component/dist/theme.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureStore from './redux/configureStore';
import { Provider as ReduxProvider } from '../node_modules/react-redux'

const store = configureStore({});

ReactDOM.render(
  <ReduxProvider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReduxProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';

firebase.auth().signInAnonymously()
  .then(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
  );
})
registerServiceWorker();

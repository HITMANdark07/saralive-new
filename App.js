import React from 'react';
import Router from './Router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import reduxStore  from './src/redux/store';
import PushNotification from "react-native-push-notification";

export default function App() {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
  
      // process the notification
  
      // (required) Called when a remote is received or opened, or local notification is opened
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  })
  return (
    <Provider store={reduxStore.store}>
      <PersistGate loading={null} persistor={reduxStore.persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}

/**
 * Patient React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NativeBaseProvider} from 'native-base';
import AppRouter from './AppRouter';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <AppRouter />
    </NativeBaseProvider>
  );
}

export default App;

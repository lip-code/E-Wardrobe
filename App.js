import React from 'react';
import { WardrobeProvider } from './src/store/WardrobeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <WardrobeProvider>
      <AppNavigator />
    </WardrobeProvider>
  );
}

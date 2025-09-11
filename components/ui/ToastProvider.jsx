"use client";
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 5000,
        className: '',
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: '#3B82F6',
            secondary: 'white',
          },
        },
      }}
    />
  );
}
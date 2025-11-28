import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App';
import './index.css';

export const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
      <p className="text-gray-600">Đang tải...</p>
    </div>
  </div>
);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Không tìm thấy phần tử #root để khởi tạo ứng dụng.');
}

type GlobalWithRoot = typeof window & {
  __APP_ROOT__?: ReturnType<typeof ReactDOM.createRoot>;
};

const globalWithRoot = window as GlobalWithRoot;
const root = globalWithRoot.__APP_ROOT__ ?? ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

globalWithRoot.__APP_ROOT__ = root;
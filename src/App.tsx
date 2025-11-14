import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { router } from './routes';
import { Loading } from './components/loading';
import './App.scss';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Suspense fallback={<Loading fullscreen tip="Loading..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  );
}

export default App;

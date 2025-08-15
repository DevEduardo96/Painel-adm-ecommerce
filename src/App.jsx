import { RouterProvider } from 'react-router-dom';

// project imports
import ThemeCustomization from './themes';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary'; // Assuming ErrorBoundary is in components/ErrorBoundary

import router from './routes'; // Assuming router is in routes/index.js or similar

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeCustomization>
          <RouterProvider router={router} />
        </ThemeCustomization>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
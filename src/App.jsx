
import { RouterProvider } from 'react-router-dom';

// project imports
import ThemeCustomization from './themes';
import { AuthProvider } from './contexts/AuthContext';

import router from 'routes';

function App() {
  return (
    <ThemeCustomization>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeCustomization>
  );
}

export default App;

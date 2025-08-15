
// ==============================|| THEME CONFIG  ||============================== //

const config = {
  fontFamily: `'Poppins', sans-serif`,
  borderRadius: 12,
  outlinedFilled: true,
  navType: 'light', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  rtlLayout: false,
  container: false
};

export default config;

// Layout Config
export const DRAWER_WIDTH = 260;
export const GRID_SPACING = 2;
export const drawerWidth = 260; // Legacy support

// App Config
export const APP_DEFAULT_PATH = '/dashboard/default';
export const API_SERVER = 'https://localhost:3000/app/';
export const DASHBOARD_PATH = '/dashboard/default';
export const HORIZONTAL_MAX_ITEM = 6;

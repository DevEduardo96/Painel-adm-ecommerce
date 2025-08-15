
// Configurações específicas para desenvolvimento
export const isDevelopment = import.meta.env.DEV;

// Configurações de logging para desenvolvimento
export const devConfig = {
  enableAnalytics: false,
  enableMarketing: false,
  enableConsoleWarnings: false,
  enableExternalScripts: false
};

// Função para suprimir avisos específicos do console em desenvolvimento
export const suppressDevWarnings = () => {
  if (isDevelopment) {
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    console.warn = (...args) => {
      const message = args.join(' ');
      // Suprimir avisos específicos de marketing/campaigns
      if (message.includes('Campaign') || 
          message.includes('CodedThemes') || 
          message.includes('domain/subdomain') ||
          message.includes('analytics')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.log = (...args) => {
      const message = args.join(' ');
      // Suprimir logs de marketing
      if (message.includes('Campaign') || 
          message.includes('CodedThemes') || 
          message.includes('Marketing')) {
        return;
      }
      originalLog.apply(console, args);
    };
  }
};


import { Box, Typography, Button, Paper } from '@mui/material';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function ErrorFallback({ error, resetError }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        p: 3
      }}
    >
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%'
        }}
      >
        <IconAlertTriangle size={48} color="error" style={{ marginBottom: 16 }} />
        <Typography variant="h5" gutterBottom>
          Oops! Algo deu errado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </Typography>
        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
            {error.message}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={resetError || (() => window.location.reload())}
        >
          Tentar Novamente
        </Button>
      </Paper>
    </Box>
  );
}

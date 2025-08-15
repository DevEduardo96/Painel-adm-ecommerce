
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

// third party
import { useForm } from 'react-hook-form';

// project imports
import { useAuth } from 'contexts/AuthContext';
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const { user, error: signInError } = await signIn(data.email, data.password);
      
      if (signInError) {
        setError(signInError);
      } else if (user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          {...register('email', emailSchema)}
          placeholder="exemplo@email.com"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <FormControl variant="outlined" error={!!errors.password}>
          <InputLabel htmlFor="password">Senha</InputLabel>
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            {...register('password', passwordSchema)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha"
            placeholder="Digite sua senha"
          />
          {errors.password && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
      </Stack>

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading}
        sx={{ 
          minWidth: 120, 
          mt: { xs: 2, sm: 3 }, 
          '& .MuiButton-endIcon': { ml: 1 } 
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Entrar'}
      </Button>
    </form>
  );
}

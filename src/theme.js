import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff564f',
      dark: '#ed3843',
    },
    secondary: {
      main: '#534eff',
      dark: '#362dd1',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
      button: {
        textTransform: "none"
      }
    }
});

export default theme;

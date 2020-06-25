import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff564f',
    },
    secondary: {
      main: '#3d35dc',
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

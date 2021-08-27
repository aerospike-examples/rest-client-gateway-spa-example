import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { History } from "history";
import * as React from "react";
import { Route, RouteComponentProps, Router, Switch } from "react-router";
import { Auth } from "./core/Auth";
import AboutPage from "./pages/AboutPage";
import AddRecipePage from "./pages/AddRecipePage";
import IndexPage from "./pages/IndexPage";

export interface AppProps {
  history: History;
}

const palette: PaletteOptions = {
  primary: { main: "#B71C1C" },
  secondary: { main: "#212121" },
  background: {
    default: "darkgray"
  }
};
const auth = new Auth();

const handleAuthentication = (props: RouteComponentProps<{}>) => {
  if (/access_token|id_token|error/.test(window.location.hash)) {
    auth.handleAuthentication();
  }
  return <div>"Loading"</div>;
};
const theme = createMuiTheme({ palette });

const App = ({ history }: AppProps) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router history={history}>
      <Switch>
        <Route
          exact
          path={"/"}
          render={props => <IndexPage {...props} auth={auth} />}
        />
        <Route
          exact
          path={"/addrecipe"}
          render={props => <AddRecipePage {...props} auth={auth} />}
        />
        <Route exact path={"/about"} render={props => <AboutPage />} />
        <Route
          exact
          path={"/callback"}
          render={props => handleAuthentication(props)}
        />
      </Switch>
    </Router>
  </MuiThemeProvider>
);

export default App;

import {
  createStyles,
  Grid,
  Paper,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";
import * as React from "react";
import Header from "../components/presentational/Header";
import { TypedMap } from "../core/types/TypedMap";
import { LastApiCall } from "../generated/core/state/ApiState";

export interface PageProps {
  backgroundImage?: string;
  pageTitle?: string;
  excludeAPIPanel?: boolean;
  lastResponse?: TypedMap<LastApiCall>;
}

const styles = (materialTheme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    layout: {
      width: "auto",
      marginLeft: materialTheme.spacing.unit * 2,
      marginRight: materialTheme.spacing.unit * 2,
      [materialTheme.breakpoints.up(
        600 + materialTheme.spacing.unit * 2 * 2
      )]: {
        // width: 1200,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      minHeight: "60vh",
      background: "rgba(255,255,255,0.9)",
      marginTop: materialTheme.spacing.unit * 6,
      marginBottom: materialTheme.spacing.unit * 6,
      padding: materialTheme.spacing.unit * 2,
      [materialTheme.breakpoints.up(
        800 + materialTheme.spacing.unit * 3 * 2
      )]: {
        marginTop: materialTheme.spacing.unit * 6,
        marginBottom: materialTheme.spacing.unit * 6,
        padding: materialTheme.spacing.unit * 3
      }
    }
  });

interface PageState {}
class PageComponent extends React.PureComponent<
  WithStyles<typeof styles> & PageProps,
  PageState
> {
  constructor(props: WithStyles<typeof styles> & PageProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className={this.props.classes.root}>
        <Header title={this.props.pageTitle || "Aerospike Personal Cookbook"} />
        <main className={this.props.classes.layout}>
          <Grid
            container
            spacing={24}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={10} md={7}>
              {this.props.children &&
              React.Children.count(this.props.children) ? (
                <Paper className={this.props.classes.paper}>
                  {this.props.children}
                </Paper>
              ) : null}
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

const Page = withStyles(styles)(PageComponent);
export default Page;

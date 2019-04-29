import { ListItem, Tooltip, Typography, Zoom } from "@material-ui/core";
import ListContainer from "@material-ui/core/List";
import { css } from "emotion";
import * as React from "react";
import { connect } from "react-redux";
import { ContentBox } from "../components/presentational/ContentBox";
import Page from "./Page";

export class AboutComponent extends React.PureComponent<{}> {
  public render() {
    return (
      <Page>
        <ContentBox>
          <Typography variant="h3">About this app</Typography>
          <Typography variant="body1">
            This simple app allows creation of a collection of recipes in a
            cookbook personal to a logged in user. It showcases using the
            Aerospike database along with the Aerospike REST client gateway in a
            Single Page Application setting without a custom server. The pages
            are served from a static webserver. The REST client gateway is
            installed behind an API Manager (In this case the Azure APIM) and is
            blocked from all other access. This app also shows using OAuth2 to
            manage users and isolate individual user data. See below for the
            basic architecture we used.
          </Typography>
          <p />
          <a href="/image/arch.svg" target="_blank">
            <Tooltip
              placement="top"
              TransitionComponent={Zoom}
              title={<h1>Click for full image</h1>}
            >
              <img
                className={css({ maxWidth: "100%" })}
                src="/image/arch.png"
              />
            </Tooltip>
          </a>
          <ListContainer>
            <ListItem>
              1: Browser loads static html/js/image files and app runs
            </ListItem>
            <ListItem>
              2: User logs on and goes through OAuth2 implicit flow and gets JWT
              token with sub
            </ListItem>
            <ListItem>
              3. App makes API requests to API Manager with JWT token
            </ListItem>
            <ListItem>
              4. APIM validates JWT, transforms request embedding sub into
              record keys, and limits exposed APIs. Then sends transformed
              request to Aerospike REST Client Gateway
            </ListItem>
            <ListItem>
              5. REST Client Gateway makes necessary requests to Aerospike
              cluster nodes and returns response
            </ListItem>
          </ListContainer>
        </ContentBox>
      </Page>
    );
  }
}

const AboutPage = connect()(AboutComponent);

export default AboutPage;

import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LeftContainer from "../LeftContainer";
import RightContainer from "../RightContainer";
import "../../styles/Bookmarks.css";

export class Bookmarks extends Component {
  render() {
    return (
      <>
        <Container id="bookmarks">
          <div>
            <LeftContainer active="bookmarks" />
          </div>
          <div>
            <div id="header">
              <p>Bookmarks</p>
              <p>@username</p>
            </div>
            <hr style={{ margin: "0.5rem -10px" }} />
            <div id="content">
              <p>You haven’t added any Tweets to your Bookmarks yet</p>
              <p>When you do, they’ll show up here.</p>
            </div>
          </div>
          <div>
            <RightContainer />
          </div>
        </Container>
      </>
    );
  }
}

export default Bookmarks;

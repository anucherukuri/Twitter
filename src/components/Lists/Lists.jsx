import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LeftContainer from "../LeftContainer";
import RightContainer from "../RightContainer";
import "../../styles/Lists.css";

import { BsArrowLeft, BsThreeDots } from "react-icons/bs";
import { RiPlayListAddLine } from "react-icons/ri";

export class Lists extends Component {
  render() {
    return (
      <Container id="lists">
        <div>
          <LeftContainer active="lists" />
        </div>
        <div>
          <div id="header">
            <div id="name">
              <BsArrowLeft />
              <div>
                <p>name</p>
                <p>tag</p>
              </div>
            </div>
            <div id="icons">
              <p>
                <RiPlayListAddLine />
              </p>
              <p>
                <BsThreeDots />
              </p>
            </div>
          </div>
          <hr style={{ margin: "0.5rem -10px" }} />
          <p
            style={{ fontWeight: "650", fontSize: "24px", margin: "5px 10px" }}
          >
            Pinned
          </p>
          <hr style={{ margin: "0.5rem -10px" }} />
          <div id="pinned">
            <p>
              Nothing to see here yet -- pin up to five of your favourite Lists
              to access them quickly.
            </p>
          </div>
          <hr
            style={{
              margin: "0.5rem -10px",
              borderTop: "15px solid rgba(0,0,0,0.1)",
            }}
          />
          <p
            style={{ fontWeight: "650", fontSize: "24px", margin: "5px 10px" }}
          >
            Your Lists
          </p>
          <hr style={{ margin: "0.5rem -10px" }} />
          <div id="myLists">
            <p>You haven't created any Lists yet</p>
            <p>When you do, it'll show up here</p>
            <button>Create a List</button>
          </div>
        </div>
        <div>
          <RightContainer />
        </div>
      </Container>
    );
  }
}

export default Lists;

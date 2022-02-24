import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import "../styles/Alan.css";
import { connect } from "react-redux";
import { BsArrowRight } from "react-icons/bs";

const mapStateToProps = (state) => state;

export class Alan extends Component {
  componentDidMount = () => {
    console.log();
  };
  render() {
    return (
      <Container id="inprogress">
        <div>
          <LeftContainer active={this.props.location.pathname.slice(1)} />
        </div>
        <div id="alanCommands">
          <div className="header">
            <p>Voice Commands</p>
          </div>
          <hr style={{ marginLeft: "-20px", marginRight: "-20px" }} />
          <div className="commandsHeader">
            <p>Functionality</p>
            <BsArrowRight />
            <p>Commands</p>
          </div>
          <div className="commands">
            <p>For latest or recent tweets</p>
            <BsArrowRight />
            <p>Fetch (latest or recent) tweets</p>
          </div>
          <div className="commands">
            <p>Search for a user with username</p>
            <BsArrowRight />
            <p>Search for user (username here)</p>
          </div>
          <div className="commands">
            <p>To visit profile page</p>
            <BsArrowRight />
            <p>Go to profile page</p>
          </div>
          <div className="commands">
            <p>See the notifications</p>
            <BsArrowRight />
            <p>Check Notifications</p>
          </div>
          <div className="commands">
            <p>Clear the notifications</p>
            <BsArrowRight />
            <p>Clear Notifications</p>
          </div>
          <div className="commands">
            <p>Logout from the twitter</p>
            <BsArrowRight />
            <p>Please (logout or signout)</p>
          </div>
        </div>
        <div>
          <RightContainer />
        </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Alan);

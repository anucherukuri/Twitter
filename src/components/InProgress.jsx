import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LeftContainer from "./LeftContainer";
import "../styles/InProgress.css";
import { connect } from "react-redux";

const mapStateToProps = (state) => state;

export class InProgress extends Component {
  componentDidMount = () => {
    console.log();
  };
  render() {
    return (
      <Container id="inprogress">
        <div>
          <LeftContainer active={this.props.location.pathname.slice(1)} />
        </div>
        <div id="alertSection">
          <img
            src="https://ih0.redbubble.net/image.444173704.6876/ap,550x550,12x12,1,transparent,t.png"
            alt=""
          />
        </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(InProgress);

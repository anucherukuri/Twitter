import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LeftContainer from "../LeftContainer";
import "../../styles/Home.css";
import RightContainer from "../RightContainer";
import Feed from "./Feed";
import { connect } from "react-redux";

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (user) => {
      dispatch({
        type: "GET_USERINFO",
        payload: user,
      });
    },
    getUsers: (users) =>
      dispatch({
        type: "GET_USERS",
        payload: users,
      }),
  };
};

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
    };
  }
  bufferToBase64 = (buf) => {
    var binstr = Array.prototype.map
      .call(buf, function (ch) {
        return String.fromCharCode(ch);
      })
      .join("");
    return btoa(binstr);
  };
  componentDidMount = async () => {
    this.setState({ user: this.props.user });
  };

  render() {
    return (
      <Container id="home">
        <div>
          <LeftContainer active="home" />
        </div>
        <div>
          <Feed
            likeFunc={this.props.likeFunc}
            updateLikesFunc={this.props.updateLikesFunc}
            updateDislikesFunc={this.props.updateDislikesFunc}
          />
        </div>
        <div>
          <RightContainer />
        </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

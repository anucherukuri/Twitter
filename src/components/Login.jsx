import React, { Component } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import "../styles/Login.css";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (username) =>
      dispatch({
        type: "SET_USERNAME",
        payload: username,
      }),
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
export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "",
        password: "",
      },
      loading: false,
      showAlert: false,
    };
  }
  userHandler = (e) => {
    let user = this.state.user;
    let id = e.currentTarget.id;
    user[id] = e.currentTarget.value;
    this.setState({ user });
  };
  bufferToBase64 = (buf) => {
    var binstr = Array.prototype.map
      .call(buf, function (ch) {
        return String.fromCharCode(ch);
      })
      .join("");
    return btoa(binstr);
  };

  loginHandler = async () => {
    this.setState({ loading: true });
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/login`,
      {
        headers: new Headers({
          "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
          "content-type": "application/json",
        }),
        credentials: "include",
        method: "POST",
        body: JSON.stringify(this.state.user),
      }
    );
    if (response.ok) {
      //
      let userInfo = await fetch(
        `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      let user = await userInfo.json();
      user.image = this.bufferToBase64(user.image.data);
      if (response.ok) {
        this.setState({ user });
        this.props.getUser(this.state.user);
      }
      let usersResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles`
      );
      let users = await usersResponse.json();
      users.forEach((user) => {
        user.image = this.bufferToBase64(user.image.data);
      });
      this.props.getUsers(users);
      setTimeout(() => {
        this.props.history.push(`/home/me`);
      }, 1000);
    } else {
      this.setState({ showAlert: true, loading: false });
    }
  };
  render() {
    return (
      <Container id="login">
        <div>
          <img
            src="https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png"
            alt="logo"
          />
          <p>Log in to Twitter</p>
          {this.state.showAlert ? (
            <Alert variant="danger">Username or Password is incorrect</Alert>
          ) : null}

          <div id="user">
            <p>Phone,email or username</p>
            <input onChange={this.userHandler} id="username" type="text" />
          </div>
          <div id="user">
            <p>Password</p>
            <input onChange={this.userHandler} id="password" type="password" />
          </div>
          <button onClick={this.loginHandler} style={{ position: "relative" }}>
            {this.state.loading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <p style={{ margin: "0px" }}>Log in</p>
            )}
          </button>
          <div id="bottomContent">
            <a href="/">Forgot password ?</a>
            
            <a href="/"> Sign up for Twitter</a>
          </div>
        </div>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Login);

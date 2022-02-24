import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/StartPage.css";
import { IconContext } from "react-icons";
import { RiSearchLine, RiChat1Line } from "react-icons/ri";
import { BsPeople } from "react-icons/bs";
import { withRouter } from "react-router-dom";

import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
  },
};

class StartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegister: false,
      info: {
        name: "",
        email: "",
        username: "",
        password: "",
        dob: "",
        area: "",
      },
    };
  }

  loginHandler = () => {
    this.props.history.push("/login");
  };
  updateInfo = (e) => {
    let info = this.state.info;
    let id = e.currentTarget.id;
    info[id] = e.currentTarget.value;
    this.setState({ info });
  };
  registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/register`,
      {
        method: "POST",
        body: JSON.stringify(this.state.info),
        headers: new Headers({
          "content-Type": "application/json",
          "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
        }),
      }
    );
    if (response.ok) {
      alert("successfully registered, login to the website");
      this.setState({ showRegister: false });
      this.props.history.push("/login");
    } else {
      alert("username or email exists");
    }

    console.log(this.state.info);
  };
  componentDidMount = async()=> {
   

      let response = await fetch("https://staging.viot.portal.graphicx.io/api/v1/oauth/token/",{
        method:"POST",
        body: JSON.stringify({username:"user",password:"123",grant_type:"password"}),
        headers:new Headers({
          "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
          "Authorization":"Basic cF92b2RfcG9ydGFsX2NsaWVudDpkM2tYam9ZWE1FM0xJa3ZkdVNqVmJ3eEN6ckh4dV8=",
          "X-TenantID":"p_vod",
          "Content-type":"application/x-www-form-urlencoded"
        })
      })

  }
  render() {
    return (
      <Container id="startPage">
        <Row id="main">
          <Col xs={12} sm={12} lg={6} id="leftColumn">
            <img
              className="img-fluid"
              src="https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png"
              alt=""
            />
            <div id="content">
              <div>
                <IconContext.Provider value={{ className: "icons" }}>
                  <p>
                    <RiSearchLine />
                  </p>
                </IconContext.Provider>
                <p>Follow your interests.</p>
              </div>
              <div>
                <IconContext.Provider value={{ className: "icons" }}>
                  <p>
                    <BsPeople />
                  </p>
                </IconContext.Provider>
                <p>Hear what people are talking about.</p>
              </div>
              <div>
                <IconContext.Provider value={{ className: "icons" }}>
                  <p>
                    <RiChat1Line />
                  </p>
                </IconContext.Provider>
                <p>Join the conversation.</p>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} lg={6} id="rightColumn">
            <div>
              <div id="content">
                <img
                  src="https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png"
                  alt=""
                />
                <p>See what's happening in the world right now</p>
                <div>
                  <p>Join Twitter today.</p>
                  <div id="buttons">
                    <button
                      onClick={() => this.setState({ showRegister: true })}
                    >
                      Sign up
                    </button>
                    <button onClick={this.loginHandler}>Log in</button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row id="footer">
          <div>
            <a href="/">About</a>
            <a href="/">Help Center</a>
            <a href="/">Terms</a>
            <a href="/">Privacy policy</a>
            <a href="/">Cookies</a>
            <a href="/">Imprint</a>
            <a href="/">Ads info</a>
            <a href="/">Blog</a>
            <a href="/">Status</a>
            <a href="/">Jobs</a>
            <a href="/">Brand</a>
            <a href="/">Advertise</a>
            <a href="/">Marketing</a>
            <a href="/">Businesses</a>
            <a href="/">Developers</a>
            <a href="/">Directory</a>
            <a href="/">Settings</a>
            <a href="/">2020 Twitter, Inc.</a>
          </div>
        </Row>
        {/* register modal */}
        <Modal
          isOpen={this.state.showRegister}
          onRequestClose={() =>
            this.setState({
              showRegister: false,
            })
          }
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div id="registerModal">
            <form>
              <div id="logo">
                <div style={{ width: "70px" }}></div>
                <div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png"
                    alt=""
                  />
                </div>
                <div>
                  <button onClick={this.registerUser} type="submit">
                    Register
                  </button>
                </div>
              </div>
              <div id="info">
                <p>Create your account</p>
                <div className="inputDivs">
                  <p>Name</p>
                  <input
                    onChange={this.updateInfo}
                    id="name"
                    type="text"
                    required
                  />
                </div>
                <div className="inputDivs">
                  <p>Email</p>
                  <input
                    onChange={this.updateInfo}
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="inputDivs">
                  <p>Username</p>
                  <input
                    onChange={this.updateInfo}
                    id="username"
                    type="text"
                    required
                    minLength="5"
                  />
                </div>
                <div className="inputDivs">
                  <p>Password</p>
                  <input
                    onChange={this.updateInfo}
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <p>Date of Birth</p>
                <p>
                  This will not be shown publicly. Confirm your own age, even if
                  this account is for a business, a pet or something else.
                </p>
                <input id="dob" onChange={this.updateInfo} type="date" />
                <div className="inputDivs">
                  <p>City</p>
                  <input onChange={this.updateInfo} id="area" type="text" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default withRouter(StartPage);

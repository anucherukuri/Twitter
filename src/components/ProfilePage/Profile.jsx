import React, { Component } from "react";
import LeftContainer from "../LeftContainer";
import { Container, Spinner } from "react-bootstrap";
import RightContainer from "../RightContainer";
import "../../styles/Profile.css";
import { BsArrowLeft, BsCalendar } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { GiBalloons } from "react-icons/gi";
import { connect } from "react-redux";
import MyTweets from "./MyTweets";
import Media from "./Media";
import Likes from "./Likes";
import axios from "axios";

import Modal from "react-modal";

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (user) => {
      dispatch({
        type: "GET_USERINFO",
        payload: user,
      });
    },
  };
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "tweets",
      user: this.props.match.params.username,
      userInfo: "",
      showEdit: false,
      image: null,
      loading: false,
      updateUserInfo: {},
    };
    this.inputRef = React.createRef();
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
    if (this.props.match.params.username === "me") {
      setTimeout(() => {
        this.setState({ userInfo: this.props.user });
      }, 500);
    } else {
      let userInfo = this.props.users.filter(
        (user) => user.username === this.props.match.params.username
      );

      this.setState({ userInfo: userInfo[0] });
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.setState({ user: this.props.match.params.username });
      if (this.props.match.params.username === "me") {
        this.setState({ userInfo: this.props.user });
      } else {
        let userInfo = this.props.users.filter(
          (user) => user.username === this.props.match.params.username
        );

        this.setState({ userInfo: userInfo[0] });
      }
    }
  };
  updateInfo = (e) => {
    let updateUserInfo = this.state.updateUserInfo;
    let id = e.currentTarget.id;
    updateUserInfo[id] = e.currentTarget.value;
    this.setState({ updateUserInfo });
  };
  handleImageInput = (e) => {
    this.inputRef.current.click();
  };
  imageSelected = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("picture", file);
    this.setState({
      image: formData,
    });
  };
  editUser = async (e) => {
    e.preventDefault();
    console.log(this.state.updateUserInfo);
    let editInfo = {
      method: "PUT",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/me`,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.updateUserInfo,
      withCredentials: true,
    };

    let tweetResponse = await axios(editInfo);
    if (this.state.image !== null) {
      console.log("stf");
      let userImage = {
        method: "POST",
        url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/${this.state.userInfo._id}/uploadImage`,
        headers: {
          username: this.props.user.username,
          "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
        },
        data: this.state.image,

        withCredentials: true,
      };
      let userImageResponse = await axios(userImage);
    }
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    let userInfo = await response.json();
    userInfo.image = this.bufferToBase64(userInfo.image.data);
    if (response.ok) {
      console.log("Ok");
      this.setState({ showEdit: false, loading: true, image: null });
      this.setState({ userInfo });
      setTimeout(() => {
        this.props.getUser(this.state.userInfo);
      }, 500);
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 900);
  };
  render() {
    return (
      <Container id="profile">
        <div>
          <LeftContainer active="userInfo" />
        </div>
        <div>
          {!this.state.userInfo || this.state.loading === true ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Container id="userInfo">
              <div id="navBar">
                <div onClick={() => this.props.history.goBack()}>
                  <BsArrowLeft />
                </div>
                <div id="name">
                  <p>{this.state.userInfo.name}</p>
                  <p>tweets length</p>
                </div>
              </div>
              <div id="bgImage">
                <img src="https://png.pngtree.com/thumb_back/fh260/background/20200604/pngtree-abstract-polygonal-space-low-poly-dark-background-with-connecting-dots-and-image_337931.jpg" alt=""/>
              </div>
              <div id="image">
                <img
                  src={`data:image/jpeg;base64,${this.state.userInfo.image}`}
                  alt=""
                />
                {this.state.userInfo.username === this.props.user.username ? (
                  <button onClick={() => this.setState({ showEdit: true })}>
                    Edit Profile
                  </button>
                ) : (
                  <button>Follow</button>
                )}
              </div>
              <div id="info">
                <p>{this.state.userInfo.name}</p>
                <p>@{this.state.userInfo.username}</p>
                <div id="dates">
                  {this.state.userInfo.area ? (
                    <p>
                      <FiMapPin /> {this.state.userInfo.area}
                    </p>
                  ) : null}
                  {this.state.userInfo.dob ? (
                    <p>
                      <GiBalloons /> {this.state.userInfo.dob}
                    </p>
                  ) : null}
                  {this.state.userInfo.createdAt ? (
                    <p>
                      <BsCalendar />{" "}
                      {this.state.userInfo.createdAt.slice(0, 10)}
                    </p>
                  ) : null}
                </div>
                <div id="followers">
                  <p>
                    <span style={{ fontWeight: "650", color: "black" }}>7</span>{" "}
                    Following
                  </p>
                  <p>
                    <span style={{ fontWeight: "650", color: "black" }}>
                      7B
                    </span>{" "}
                    Followers
                  </p>
                </div>
              </div>
              <div id="myTweets">
                <div
                  onClick={() => this.setState({ active: "tweets" })}
                  className={this.state.active === "tweets" ? "active" : null}
                >
                  Tweets
                </div>
                <div
                  onClick={() => this.setState({ active: "replies" })}
                  className={this.state.active === "replies" ? "active" : null}
                >
                  Replies
                </div>
                <div
                  onClick={() => this.setState({ active: "media" })}
                  className={this.state.active === "media" ? "active" : null}
                >
                  Media
                </div>
                <div
                  onClick={() => this.setState({ active: "likes" })}
                  className={this.state.active === "likes" ? "active" : null}
                >
                  Likes
                </div>
              </div>
              {this.state.active === "tweets" ? (
                <MyTweets userId={this.state.user} />
              ) : null}
              {this.state.active === "media" ? <Media /> : null}
              {this.state.active === "likes" ? <Likes /> : null}
            </Container>
          )}
        </div>
        <div>
          <RightContainer />
        </div>

        {/* edit profile modal */}
        <Modal
          isOpen={this.state.showEdit}
          onRequestClose={() => this.setState({ showEdit: false })}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div id="editProfile">
            <div id="heading">
              <div>
                <AiOutlineClose
                  onClick={() => this.setState({ showEdit: false })}
                />
                <p>Edit profile</p>
              </div>
              <button onClick={this.editUser}>Save</button>
            </div>
            <hr style={{ marginTop: "0.2rem ", marginBottom: "0.2rem" }} />
            <div id="bgImage"></div>
            <div id="image">
              <img
                onClick={this.handleImageInput}
                src={`data:image/jpeg;base64,${this.state.userInfo.image}`}
                alt=""
              />
              <input
                ref={this.inputRef}
                style={{ display: "none" }}
                type="file"
                name="picture"
                onChange={this.imageSelected}
              />
            </div>
            <div id="info">
              <div className="inputDivs">
                <p>Name</p>
                <input
                  onChange={this.updateInfo}
                  id="name"
                  type="text"
                  required
                  placeholder={this.state.userInfo.name}
                />
              </div>
              <div className="inputDivs">
                <p>Location</p>
                <input
                  onChange={this.updateInfo}
                  id="area"
                  type="text"
                  required
                  placeholder={this.state.userInfo.area}
                />
              </div>
              <p style={{ marginTop: "10px" }}>Date of Birth</p>
              <input id="dob" onChange={this.updateInfo} type="date" />
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

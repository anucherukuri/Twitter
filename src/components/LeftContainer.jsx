import React, { useState } from "react";
import "../styles/LeftContainer.css";
import { GoHome } from "react-icons/go";
import { Badge } from "react-bootstrap";
import { FiHash, FiBell, FiMail, FiBookmark } from "react-icons/fi";
import {
  AiOutlineUser,
  AiOutlineClose,
  AiOutlinePicture,
  AiOutlineFileGif,
  AiFillCloseCircle,
} from "react-icons/ai";
import { BsCardText, BsThreeDots } from "react-icons/bs";
import { RiQuillPenLine } from "react-icons/ri";
import { FiBarChart } from "react-icons/fi";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaRegSmile } from "react-icons/fa";
import { GoCalendar } from "react-icons/go";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";
import axios from "axios";

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch({
        type: "LOGOUT",
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
const logoutStyles = {
  content: {
    maxWidth: "250px",
    top: "71%",
    left: "15%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
class LeftContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweet: {
        text: "",
      },
      image: "",
      showCreateTweet: false,
      showLogout: false,
      tempUrl: null,
    };
    this.inputRef = React.createRef();
  }
  tweetHandler = (e) => {
    let tweet = this.state.tweet;
    let id = e.currentTarget.id;
    tweet[id] = e.currentTarget.value;
    this.setState({ tweet });
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
      tempUrl: URL.createObjectURL(e.target.files[0]),
    });
  };
  sendTweet = async () => {
    //

    let tweet = {
      method: "POST",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets`,
      headers: {
        username: this.props.user.username,
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.tweet,
      withCredentials: true,
    };
    let tweetResponse = await axios(tweet);
    let tweetId = tweetResponse.data;
    console.log(tweetId);
    let tweetImage = {
      method: "POST",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${tweetId}`,
      headers: {
        username: this.props.user.username,
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.image,
      withCredentials: true,
    };
    let tweetImageResponse = await axios(tweetImage);
    this.setState({ tweet: { text: "" }, image: "" });
    this.props.history.push(`/home/me`);
  };
  logoutHandler = () => {
    this.props.history.push("/");
    //this.props.logout();
  };
  closeImagePreview = () => {
    this.setState({ tempUrl: null });
  };
  render() {
    return (
      <div id="leftBar">
        <div id="logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/1200px-Twitter_bird_logo_2012.svg.png"
            alt=""
          />
        </div>
        <div className={this.props.active === "home" ? "active" : null}>
          <Link to={`/home/me`}>
            <GoHome />
          </Link>
        </div>
        <div className={this.props.active === "hashtags" ? "active" : null}>
          <Link to={`/hashtags`}>
            <FiHash />
          </Link>
        </div>
        <div
          className={this.props.active === "notifications" ? "active" : null}
          id="notifications"
        >
          <Link to={`/notifications`}>
            <FiBell />
            {this.props.notifications > 0 ? (
              <Badge pill variant="danger">
                {this.props.notifications}
              </Badge>
            ) : null}
          </Link>
        </div>
        <div className={this.props.active === "messages" ? "active" : null}>
          <Link to={`/messages`}>
            <FiMail />
          </Link>
        </div>
        <div className={this.props.active === "bookmarks" ? "active" : null}>
          <Link to={`/${this.props.username}/bookmarks`}>
            {" "}
            <FiBookmark />
          </Link>
        </div>
        <div className={this.props.active === "lists" ? "active" : null}>
          <Link to={`/${this.props.username}/lists`}>
            <BsCardText />
          </Link>
        </div>
        <div className={this.props.active === "userInfo" ? "active" : null}>
          <Link to={`/userinfo/me`}>
            <AiOutlineUser />
          </Link>
        </div>
        <div
          className={this.props.active === "voiceCommands" ? "active" : null}
          id="alan"
        >
          <Link to={`/voiceCommands`}>
            <GiArtificialIntelligence />

            <Badge id="newBadge" pill variant="danger">
              NEW
            </Badge>
          </Link>
        </div>
        <div onClick={() => this.setState({ showCreateTweet: true })}>
          <RiQuillPenLine />
        </div>
        <div id="profile" onClick={() => this.setState({ showLogout: true })}>
          <img src={`data:image/jpeg;base64,${this.props.user.image}`} alt="" />
        </div>
        {/* Create tweet Modal */}
        <Modal
          isOpen={this.state.showCreateTweet}
          onRequestClose={() =>
            this.setState({
              showCreateTweet: false,
              image: "",
              tweet: { text: "" },
            })
          }
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div id="createTweetModal">
            <div id="heading">
              <AiOutlineClose
                onClick={() =>
                  this.setState({
                    showCreateTweet: false,
                    image: "",
                    tweet: { text: "" },
                  })
                }
              />
            </div>
            <hr style={{ marginTop: "0.3rem", marginBottom: "0.5rem" }} />
            <div id="content">
              <img
                src={`data:image/jpeg;base64,${this.props.user.image}`}
                alt=""
              />
              <textarea
                type="text"
                value={this.state.tweet.text}
                onChange={this.tweetHandler}
                placeholder="What's happening?"
                id="text"
              />
            </div>
            {this.state.tempUrl !== null ? (
              <div id="imagePreview">
                <AiFillCloseCircle onClick={this.closeImagePreview} />
                <img src={this.state.tempUrl} alt="" />
              </div>
            ) : null}
            <hr />
            <div id="footer">
              <div id="icons">
                <AiOutlinePicture onClick={this.handleImageInput} />
                <input
                  ref={this.inputRef}
                  style={{ display: "none" }}
                  type="file"
                  name="picture"
                  onChange={this.imageSelected}
                />
                <AiOutlineFileGif />
                <FiBarChart />
                <FaRegSmile />
                <GoCalendar />
              </div>
              <button
                onClick={() => {
                  this.sendTweet();
                  this.setState({
                    showCreateTweet: false,
                  });
                }}
              >
                Tweet
              </button>
            </div>
          </div>
        </Modal>
        {/* Logout Modal */}

        {this.props.user ? (
          <Modal
            isOpen={this.state.showLogout}
            onRequestClose={() =>
              this.setState({
                showLogout: false,
              })
            }
            style={logoutStyles}
            contentLabel="Example Modal"
          >
            <div id="logoutModal">
              <div id="heading">
                <img
                  src={`data:image/jpeg;base64,${this.props.user.image}`}
                  alt=""
                />
                <div>
                  <p>{this.props.user.name}</p>
                  <p>@{this.props.user.username}</p>
                </div>
              </div>
              <hr style={{ marginTop: "0.3rem", marginBottom: "0.5rem" }} />
              <p>Add a existing account</p>
              <hr style={{ marginTop: "0.3rem", marginBottom: "0.5rem" }} />
              <p onClick={this.logoutHandler}>
                Log out @{this.props.user.username}
              </p>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LeftContainer));

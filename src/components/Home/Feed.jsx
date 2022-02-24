import React, { Component } from "react";
import "../../styles/Feed.css";
import { Container, Dropdown, Form, Spinner } from "react-bootstrap";
import { WiStars } from "react-icons/wi";
import {
  AiOutlinePicture,
  AiOutlineFileGif,
  AiOutlineRetweet,
  AiOutlineHeart,
  AiFillHeart,
  AiFillCloseCircle,
} from "react-icons/ai";
import { FiBarChart, FiUpload } from "react-icons/fi";
import { FaRegSmile } from "react-icons/fa";
import { GoCalendar } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsChat } from "react-icons/bs";
import { connect } from "react-redux";
import Modal from "react-modal";
import axios from "axios";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    getTweets: () => dispatch(fetchTweets()),

    removeTweet: (tweet) => dispatch(deleteTweet(tweet)),
    addToLikedTweets: (tweetId) =>
      dispatch({
        type: "ADD_TO_LIKED_TWEETS",
        payload: tweetId,
      }),
    removeFromLikedTweets: (tweetId) =>
      dispatch({
        type: "REMOVE_FROM_LIKED_TWEETS",
        payload: tweetId,
      }),
  };
};
const bufferToBase64 = (buf) => {
  var binstr = Array.prototype.map
    .call(buf, function (ch) {
      return String.fromCharCode(ch);
    })
    .join("");
  return btoa(binstr);
};
const fetchTweets = () => {
  return async (dispatch, getState) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets`,
      {
        method: "GET",
        credentials: "include",
        headers: new Headers({
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        }),
      }
    );
    let tweets = await response.json();
    tweets.forEach((tweet) => {
      if (tweet.image) {
        const tweetbase64 = bufferToBase64(tweet.image.data);
        tweet.image = tweetbase64;
      }
      if (tweet.user.image) {
        const profilebase64 = bufferToBase64(tweet.user.image.data);
        tweet.user.image = profilebase64;
      }
    });
    let latestTweets = tweets.reverse();
    if (response.ok) {
      dispatch({
        type: "GET_TWEETS",
        payload: latestTweets,
      });
    }
  };
};
const deleteTweet = (tweet) => {
  return async (dispatch, getState) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${tweet._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      dispatch({
        type: "DELETE_TWEET",
        payload: tweet._id,
      });
    }
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
export class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweet: {
        text: "",
      },
      image: null,
      showDelete: false,
      showEdit: false,
      selectedTweet: "",
      loading: true,
      newTweet: {
        text: "",
      },
      tempUrl: null,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount = async () => {
    this.props.getTweets();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1500);
  };
  // image
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
  //
  tweetHandler = (e) => {
    let tweet = this.state.tweet;
    let id = e.currentTarget.id;
    tweet[id] = e.currentTarget.value;
    this.setState({ tweet });
  };
  editTweetHandler = (e) => {
    let newTweet = this.state.newTweet;
    let id = e.currentTarget.id;
    newTweet[id] = e.currentTarget.value;
    this.setState({ newTweet });
  };
  //sending a tweet
  sendTweet = async () => {
    this.setState({ loading: true });
    let tweet = {
      method: "POST",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets`,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.tweet,
      withCredentials: true,
    };
    let tweetResponse = await axios(tweet);
    let tweetId = tweetResponse.data;
    let tweetImage = {
      method: "POST",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${tweetId}`,
      headers: {
        username: this.props.user.username,
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.image,
    };
    let tweetImageResponse = await axios(tweetImage);
    this.props.getTweets();
    this.setState({
      tweet: { text: "" },
      image: "",
      loading: false,
      tempUrl: null,
    });
  };
  //Editing a tweet
  editTweet = async () => {
    this.setState({ loading: true });
    let editTweet = {
      method: "PUT",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${this.state.selectedTweet._id}`,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.newTweet,
      withCredentials: true,
    };

    let tweetResponse = await axios(editTweet);
    let tweetImage = {
      method: "POST",
      url: await `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${this.state.selectedTweet._id}`,
      headers: {
        username: this.props.user.username,
        "Access-Control-Allow-Origin": `${process.env.REACT_APP_ACCESS_CONTROL_URL}`,
      },
      data: this.state.image,
    };
    let tweetImageResponse = await axios(tweetImage);
    this.props.getTweets();
    this.setState({
      tweet: { text: "" },
      image: "",
      selectedTweet: "",
      loading: false,
      tempUrl: null,
    });
  };
  sendLike = (username, name, tweetText, tweetId) => {
    this.props.likeFunc(username, name, tweetText, tweetId);
    this.props.addToLikedTweets(tweetId);
    this.props.updateLikesFunc(tweetId);
  };
  unlike = (tweetId) => {
    this.props.removeFromLikedTweets(tweetId);

    this.props.updateDislikesFunc(tweetId);
  };
  closeImagePreview = () => {
    this.setState({ tempUrl: null });
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <Container id="feed">
            <div class="alan-btn"></div>
            <div id="createTweet">
              <div>
                <p>Home</p>

                <WiStars />
              </div>
              <hr style={{ margin: "0.5rem" }} />
              <div id="tweetingSection">
                <img
                  src={`data:image/jpeg;base64,${this.props.user.image}`}
                  alt=""
                />
                <textarea
                  id="text"
                  onChange={this.tweetHandler}
                  placeholder="What's happening?"
                  value={this.state.tweet.text}
                  type="text"
                />
              </div>
              {this.state.tempUrl !== null ? (
                <div id="imagePreview">
                  <AiFillCloseCircle onClick={this.closeImagePreview} />
                  <img src={this.state.tempUrl} alt="" />
                </div>
              ) : null}

              <div id="icons">
                <div>
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
                {this.state.tweet.text.length !== 0 ||
                this.state.image !== null ? (
                  <div>
                    <button onClick={this.sendTweet}>Tweet</button>
                  </div>
                ) : null}
              </div>
            </div>
            <hr
              style={{ margin: "0px", borderTop: "15px solid rgba(0,0,0,0.1)" }}
            />
            {this.props.tweets.map((tweet) => {
              return (
                <div className="tweet">
                  <img
                    className="img-fluid"
                    src={`data:image/jpeg;base64,${tweet.user.image}`}
                    alt=""
                  />
                  <div className="content">
                    <div className="name">
                      <div>
                        <p style={{ fontSize: "18px", fontWeight: "700" }}>
                          {tweet.user.name}{" "}
                          <span style={{ fontWeight: "400", color: "#9AA5AF" }}>
                            @{tweet.user.username}
                          </span>
                        </p>

                        <Dropdown>
                          <Dropdown.Toggle className="d-flex">
                            <div
                              className="dropdown"
                              onClick={() =>
                                this.setState({ showDropdown: true })
                              }
                            >
                              <MdKeyboardArrowDown />
                            </div>
                          </Dropdown.Toggle>

                          {tweet.user.username === this.props.user.username ? (
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  this.setState({
                                    showEdit: true,
                                    selectedTweet: tweet,
                                    newTweet: { text: tweet.text },
                                  })
                                }
                              >
                                Edit Tweet
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  this.setState({
                                    showDelete: true,
                                    selectedTweet: tweet,
                                  })
                                }
                              >
                                Delete Tweet
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          ) : (
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                Not interested in this Tweet
                              </Dropdown.Item>

                              <Dropdown.Item>
                                Unfollow @{tweet.user.username}
                              </Dropdown.Item>
                              <Dropdown.Item>
                                Add/remove from Lists
                              </Dropdown.Item>
                              <Dropdown.Item>
                                Mute @{tweet.user.username}
                              </Dropdown.Item>
                              <Dropdown.Item>
                                Block @{tweet.user.username}
                              </Dropdown.Item>
                              <Dropdown.Item>Embed Tweet</Dropdown.Item>
                              <Dropdown.Item>Report Tweet</Dropdown.Item>
                            </Dropdown.Menu>
                          )}
                        </Dropdown>
                      </div>
                      <p style={{ fontSize: "16px" }}>{tweet.text}</p>
                    </div>
                    {tweet.image ? (
                      <img
                        className="img-fluid"
                        src={`data:image/jpeg;base64,${tweet.image}`}
                        alt=""
                      />
                    ) : null}
                    <div className="icons">
                      {this.props.user.likedTweets.find(
                        (element) => element === tweet._id
                      ) ? (
                        <p onClick={() => this.unlike(tweet._id)}>
                          <AiFillHeart
                            style={{
                              color: "red",
                            }}
                          />
                          <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                            {tweet.likes}
                          </span>
                        </p>
                      ) : (
                        <p
                          onClick={() =>
                            this.sendLike(
                              tweet.user.username,
                              this.props.user.name,
                              tweet.text,
                              tweet._id
                            )
                          }
                        >
                          <AiOutlineHeart />{" "}
                          <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                            {tweet.likes}
                          </span>
                        </p>
                      )}
                      <p>
                        <BsChat />{" "}
                        <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                          7
                        </span>
                      </p>
                      <p>
                        <AiOutlineRetweet />{" "}
                        <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                          7
                        </span>
                      </p>
                      <p>
                        <FiUpload />{" "}
                        <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                          7
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Modals */}
            <Modal
              isOpen={this.state.showDelete}
              onRequestClose={() =>
                this.setState({ showDelete: false, selectedTweet: "" })
              }
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div id="deleteTweet">
                <div id="heading">
                  <h2>Are you sure ?</h2>
                </div>
                <div id="buttons">
                  <button
                    onClick={() => {
                      this.setState({ loading: true });
                      this.props.removeTweet(this.state.selectedTweet);
                      setTimeout(() => {
                        this.setState({
                          showDelete: false,
                          selectedTweet: "",
                          loading: false,
                        });
                      }, 500);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() =>
                      this.setState({ showDelete: false, selectedTweet: "" })
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
            {/* edit modal */}
            <Modal
              isOpen={this.state.showEdit}
              onRequestClose={() =>
                this.setState({ showEdit: false, selectedTweet: "" })
              }
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div id="editTweet">
                <div id="heading">
                  <h2>Edit your tweet</h2>
                </div>
                <div id="content">
                  <textarea
                    type="text"
                    placeholder={this.state.selectedTweet.text}
                    onChange={this.editTweetHandler}
                    //  placeholder="tweet"
                    id="text"
                  />
                  {this.state.tempUrl !== null ? (
                    <div id="imagePreview">
                      <AiFillCloseCircle onClick={this.closeImagePreview} />
                      <img src={this.state.tempUrl} alt="" />
                    </div>
                  ) : null}
                  <input type="file" onChange={this.imageSelected} />
                </div>
                <div id="buttons">
                  <button
                    onClick={() => {
                      this.editTweet();
                      this.setState({ showEdit: false });
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      this.setState({ showEdit: false, selectedTweet: "" })
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
          </Container>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Feed));

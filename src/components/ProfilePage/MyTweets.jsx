import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { FiUpload, FiBarChart2 } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsChat } from "react-icons/bs";
import { connect } from "react-redux";
import Modal from "react-modal";

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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    removeTweet: (tweet) => dispatch(deleteTweet(tweet)),
  };
};
const deleteTweet = (tweet) => {
  return async (dispatch, getState) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/tweets/${tweet._id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      alert("tweet deleted");
      dispatch({
        type: "DELETE_TWEET",
        payload: tweet._id,
      });
    }
  };
};
export class MyTweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDelete: false,
      selectedTweet: "",
      tweets: "",
    };
  }
  componentDidMount = () => {
    if (this.props.userId === "me") {
      let tweets = this.props.tweets.filter(
        (tweet) => tweet.user.username === this.props.user.username
      );
      this.setState({ tweets });
    } else {
      let tweets = this.props.tweets.filter(
        (tweet) => tweet.user.username === this.props.userId
      );
      this.setState({ tweets });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.userId !== this.props.userId) {
      let tweets;
      if (this.props.userId === "me") {
        tweets = this.props.tweets.filter(
          (tweet) => tweet.user.username === this.props.user.username
        );
      } else {
        tweets = this.props.tweets.filter(
          (tweet) => tweet.user.username === this.props.userId
        );
      }
      setTimeout(() => {
        this.setState({ tweets });
      }, 1000);
    }
  };
  render() {
    return (
      <>
        {this.state.tweets.length > 0 &&
          this.state.tweets.map((tweet) => {
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
                                  showDelete: true,
                                  selectedTweet: tweet,
                                })
                              }
                            >
                              <span style={{ color: "#E12D64" }}>
                                {" "}
                                Delete Tweet
                              </span>
                            </Dropdown.Item>
                            <Dropdown.Item>Pin to profile</Dropdown.Item>
                            <Dropdown.Item>Embed Tweet</Dropdown.Item>
                          </Dropdown.Menu>
                        ) : (
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              Follow @{tweet.user.username}
                            </Dropdown.Item>
                            <Dropdown.Item>Add/Remove from Lists</Dropdown.Item>
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
                      <AiOutlineHeart />{" "}
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
                    <p>
                      <FiBarChart2 />{" "}
                      <span style={{ fontSize: "18px", marginLeft: "7px" }}>
                        7
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
                  this.props.removeTweet(this.state.selectedTweet);
                  this.setState({ showDelete: false, selectedTweet: "" });
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
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTweets);

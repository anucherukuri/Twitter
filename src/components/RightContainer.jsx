import React, { Component } from "react";
import { FiSearch, FiSettings } from "react-icons/fi";
import "../styles/RightContainer.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => state;

class RightContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      users: "",
      filteredUsers: "",
    };
  }
  updateQuery = (e) => {
    this.setState({ query: e.currentTarget.value });
    let filteredUsers = this.state.users.filter((user) =>
      user.name.toLowerCase().includes(this.state.query)
    );
    this.setState({ filteredUsers });
  };
  resetAll = () => {
    this.setState({ filteredUsers: "", query: "" });
  };
  componentDidMount = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_CONNECTION_URL}/profiles`
    );
    let users = await response.json();

    this.setState({ users });
  };
  render() {
    return (
      <>
        <div id="rightBar">
          <div id="search">
            <FiSearch />
            <input
              onChange={this.updateQuery}
              placeholder="Search Twitter"
              type="text"
              value={this.state.query}
            />
          </div>

          {this.state.query.length > 1 ? (
            <div id="searchDropdown">
              {this.state.filteredUsers.length > 0 ? (
                this.state.filteredUsers.map((user) => {
                  return (
                    <>
                      <Link to={`/userinfo/${user.username}`}>
                        <p onClick={this.resetAll}>{user.name}</p>
                      </Link>
                    </>
                  );
                })
              ) : (
                <div>
                  <p>No results</p>
                </div>
              )}
            </div>
          ) : null}
          <div id="trending">
            <div id="header">
              <p>Trends for you</p>
              <FiSettings />
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            <div id="trendingHastag">
              <p>Trending in Germany</p>
              <p>#MERN_stack</p>
              <p>0.5M Tweets</p>
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            <div id="trendingHastag">
              <p>Trending in Germany</p>
              <p>#Hire Mandeep</p>
              <p>10.5M Tweets</p>
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            <div id="trendingHastag">
              <p>Trending in Germany</p>
              <p>#MandeepIsTheBest</p>
              <p>9.5M Tweets</p>
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            <div id="trendingHastag">
              <p>Trending in Germany</p>
              <p>#ILoveJS</p>
              <p>1.5M Tweets</p>
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            <p style={{ padding: "7px", color: "#1da1f2", margin: "0px" }}>
              Show more
            </p>
          </div>
          {/* */}
          <div id="trending">
            <div id="header">
              <p>Who to follow</p>
            </div>
            <hr style={{ margin: "0px", marginTop: "0.4rem " }} />
            {this.props.users.slice(0,5).map((user) => {
              if (user.username !== this.props.user.username) {
                return (
                  <>
                    <div id="follow">
                      <div>
                        <img
                          src={`data:image/jpeg;base64,${user.image}`}
                          alt=""
                        />
                        <div>
                          <p>{user.name}</p>
                          <p>@{user.username}</p>
                        </div>
                      </div>
                      <button>Follow</button>
                    </div>
                    <hr style={{ margin: "0px", marginTop: "0.2rem " }} />
                  </>
                );
              }
            })}

            <p style={{ padding: "7px", color: "#1da1f2", margin: "0px" }}>
              Show more
            </p>
          </div>
          <div id="footer">
            <div>
              <a href="/">Terms</a>
              <a href="/">Cookies</a>
              <a href="/">More</a>
              <a href="/">More</a>
              <a href="/">Twitter</a>
              <a href="/">Privacy policy</a>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(RightContainer);

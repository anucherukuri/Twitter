import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import "../styles/Notifications.css";

import { FiSettings } from "react-icons/fi";

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    updateActivePage: (page) =>
      dispatch({
        type: "UPDATE_ACTIVE_PAGE",
        payload: page,
      }),
    resetNotifications: () =>
      dispatch({
        type: "RESET_NOTIFICATIONS",
      }),
    clearNotificationsArray: () =>
      dispatch({
        type: "CLEAR_NOTIFICATIONS_ARRAY",
      }),
  };
};

class Notifications extends Component {
  componentDidMount() {
    let page = "notifications";
    this.props.updateActivePage(page);
    this.props.resetNotifications();
  }
  componentWillUnmount() {
    let page = "";
    this.props.updateActivePage(page);
    this.props.clearNotificationsArray();
  }
  render() {
    return (
      <>
        <Container id="notifications">
          <div>
            <LeftContainer active="notifications" />
          </div>
          <div id="content">
            <div className="header">
              <p>Notifications</p>
              <FiSettings />
            </div>
            <hr style={{ marginLeft: "-20px", marginRight: "-20px" }} />
            {this.props.notificationsArrray.length > 0 ? (
              this.props.notificationsArrray.map((notification) => {
                return <p>{notification}</p>;
              })
            ) : (
              <p
                style={{
                  textAlign: "center",
                  width: "300px",
                  margin: "auto",
                  backgroundColor: "white",
                  fontSize: "30px",
                }}
              >
                No Notifications
              </p>
            )}
          </div>
          <div>
            <RightContainer />
          </div>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

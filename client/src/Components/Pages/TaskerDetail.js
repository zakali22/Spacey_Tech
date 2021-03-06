import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { tasker_details, upload_photo } from "../../actions/userActions";
import TaskerVerify from "../../TaskerVerification";

class TaskerDetail extends Component {
  state = {
    address: {
      house_number: "",
      street_name: "",
      city: "",
      postcode: ""
    },
    birthdate: {
      day: "",
      month: "",
      year: ""
    },
    vehicle_type: "",
    promotion: ""
  };

  saveDetails = e => {
    let state = { ...this.state };
    let proceed;
    for (let prop in state) {
      if (prop === "address") {
        for (let el in state[prop]) {
          if (state[prop][el].length > 0) {
            proceed = true;
          } else {
            proceed = false;
          }
        }
      } else if (prop === "birthdate") {
        for (let el in state[prop]) {
          if (state[prop][el].length > 0) {
            proceed = true;
          } else {
            proceed = false;
          }
        }
      }
      if (state[prop].length > 0) {
        proceed = true;
      } else {
        proceed = false;
      }
    }
    if (proceed) {
      this.props.dispatch(tasker_details(this.state)).then(response => {
        this.props.history.push("/become_tasker/categories");
      });
    }
  };

  fileInput = e => {
    const image = e.target.files[0];
    const reader = new FileReader();
    let imageURL = "";
    reader.onload = event => {
      this.setState(
        {
          imageURL: event.target.result
        },
        () => {
          console.log(this.state.imageURL);
          this.props.dispatch(
            upload_photo(event.target.result, this.props.user.basic_info._id)
          );
        }
      );
    };
    reader.readAsDataURL(image);
  };

  renderOptions = type => {
    if (type === "day") {
      let options = [];
      for (let i = 1; i <= 31; i++) {
        options.push(i);
      }
      return options.map(day => {
        return <option value={day}>{day}</option>;
      });
    } else if (type === "month") {
      let options = [
        "January",
        "Febraury",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return options.map(month => {
        return <option value={month}>{month}</option>;
      });
    } else {
      let options = [];
      for (let i = 1949; i <= 2001; i++) {
        options.push(i);
      }
      return options.map(year => {
        return <option value={year}>{year}</option>;
      });
    }
  };

  handleChange = (e, property) => {
    switch (property) {
      case "address":
        let street_name = "";
        if (e.target.name === "street_name") {
          street_name = e.target.value.replace(/\d/g, "");
          this.setState({
            address: {
              ...this.state.address,
              street_name
            }
          });
        } else {
          this.setState({
            address: {
              ...this.state.address,
              [e.target.name]: e.target.value
            }
          });
        }
        break;
      case "birthdate":
        this.setState({
          birthdate: {
            ...this.state.birthdate,
            [e.target.name]: e.target.value
          }
        });
        break;
      case "vehicle_type":
        let vehicles = [...this.state.vehicle_type, e.target.name];
        this.setState({
          vehicle_type: vehicles
        });
        break;
      case "promotion":
        this.setState({
          promotion: e.target.value
        });
    }
  };

  render() {
    return (
      <div className="dashboard__container--details">
        <div className="dashboard__container--details__upload">
          <img src={this.props.user.basic_info.image} />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={e => this.fileInput(e)}
            ref={file => (this.fileRef = file)}
          />
          <p onClick={e => this.fileRef.click()}>Add profile image</p>
          <p>
            Please upload a photo of yourself that clearly conveys who you are.
            Having a friendly, professional photo inspires confidence and will
            increase your likelihood of being hired
          </p>
        </div>
        <div className="dashboard__container--details__inputs">
          <h3>Registered address</h3>
          <p>
            This information will be used to officially verify your identity.
            Please give your full address including flat/house number where
            applicable
          </p>
          <form>
            <label>
              House Number{" "}
              <input
                type="text"
                name="house_number"
                onChange={e => this.handleChange(e, "address")}
              />
            </label>
            <label>
              Street Name{" "}
              <input
                type="text"
                name="street_name"
                onChange={e => this.handleChange(e, "address")}
              />
            </label>
            <label>
              Town/City{" "}
              <input
                type="text"
                name="city"
                onChange={e => this.handleChange(e, "address")}
              />
            </label>
            <label>
              Postcode{" "}
              <input
                type="text"
                name="postcode"
                onChange={e => this.handleChange(e, "address")}
              />
            </label>
          </form>
        </div>
        <div className="dashboard__container--details__birthdate">
          <h3>Birthdate</h3>
          <select
            id="day"
            name="day"
            onChange={e => this.handleChange(e, "birthdate")}
          >
            <option value="">Day</option>
            {this.renderOptions("day")}
          </select>
          <select
            id="month"
            name="month"
            onChange={e => this.handleChange(e, "birthdate")}
          >
            <option value="">Month</option>
            {this.renderOptions("month")}
          </select>
          <select
            id="year"
            name="year"
            onChange={e => this.handleChange(e, "birthdate")}
          >
            <option value="">Year</option>
            {this.renderOptions("year")}
          </select>
        </div>
        <div className="dashboard__container--details__vehicle">
          <h3>
            Do you have access to a vehicle that you can reliably use for tasks?
          </h3>
          <label>
            <input
              type="checkbox"
              name="bicycle"
              onChange={e => this.handleChange(e, "vehicle_type")}
            />
            <h4>Bicycle / Scooter / Motorbike</h4>
            <p>
              For transporting small or single items. <br />
              <b>Examples</b>: takeaway, small packages or documents.
            </p>
          </label>
          <label>
            <input
              type="checkbox"
              name="car"
              onChange={e => this.handleChange(e, "vehicle_type")}
            />
            <h4>Car</h4>
            <p>
              For transporting medium-sized items.<br /> <b>Examples</b>:
              groceries, dog food, disassembled and flat-pack furniture,
              dry-cleaning or small electronics.
            </p>
          </label>
          <label>
            <input
              type="checkbox"
              name="large_van"
              onChange={e => this.handleChange(e, "vehicle_type")}
            />
            <h4>Large Removal Vans</h4>
            <p>
              For transporting multiple large-sized items in a single trip.
              <br />
              <b>Examples</b>: Items from a one-to-two-bedroom home, a
              medium-to-large storage facility, or a small office.
            </p>
          </label>
          <label>
            <input
              type="checkbox"
              name="transit_van"
              onChange={e => this.handleChange(e, "vehicle_type")}
            />
            <h4>Transit Vans</h4>
            <p>
              For transporting multiple medium-sized items and large single
              items in one or multiple trips.
              <br />
              <b>Examples</b>: Items from a studio flat or small storage unit,
              or one king-size mattress.
            </p>
          </label>
        </div>
        <div className="dashboard__container--details__promotion">
          <h3>How did you hear about Spacey</h3>
          <form>
            <label for="found">
              <input
                type="radio"
                name="promotion"
                value="google"
                id="found"
                onChange={e => this.handleChange(e, "promotion")}
              />Google
            </label>
            <label for="social_media">
              <input
                type="radio"
                name="promotion"
                value="social_media"
                id="social_media"
                onChange={e => this.handleChange(e, "promotion")}
              />Social Media
            </label>
            <label for="digital_ad">
              <input
                type="radio"
                name="promotion"
                value="digital_ad"
                id="digital_ad"
                onChange={e => this.handleChange(e, "promotion")}
              />Digital Ad
            </label>
            <label for="job_board">
              <input
                type="radio"
                name="promotion"
                value="job_board"
                id="job_board"
                onChange={e => this.handleChange(e, "promotion")}
              />JobBoard Ad
            </label>
            <label for="news">
              <input
                type="radio"
                name="promotion"
                value="news"
                id="news"
                onChange={e => this.handleChange(e, "promotion")}
              />Newspaper/Magazine
            </label>
          </form>
        </div>
        <div className="button" onClick={e => this.saveDetails(e)}>
          <button>Continue</button>
        </div>
      </div>
    );
  }
}

export default connect()(withRouter(TaskerVerify(TaskerDetail)));

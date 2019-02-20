import Login from "../Login/Login";
import React from "react";
import {Redirect} from "react-router";
import {isEmpty} from "../Cart/Cart";

class EmployeeLogin extends Login{
  componentDidMount() {
    fetch('http://' + window.location.hostname + ':8080/cs122b/employeelogin', {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => {
        if (res.status === 403) {
          console.log("Invalid session");
        } else {
          console.log(this.props);
          if(isEmpty(this.props.employee)){
            console.log("...but not as employee")
            this.setState({valid: false});
          }
          else{
            this.setState({valid: true});
          }
        }
        this.setState({mounted: true});
      }
    ).catch((error) =>
      console.log(error)
    )
  }
  getRetVal() {
    return (
      <Redirect to={"/employee"}/>
    );
  }
  getSession(creds) {
    fetch('http://' + window.location.hostname + ':8080/cs122b/employeelogin', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(creds)
    }).then(
      (res) => {
        if (res.status === 403) {
          document.getElementById("Form").reset();
          this.setState({valid: false});
          this.setState({error: true});
        } else {
          this.setState({valid: true});
        }
        return res.json();
      }
    ).then(
      data => {
        this.props.getCust(data);
        console.log(data);
      }
    )
      .catch((error) =>
        console.log(error)
      )
  }
}
export default EmployeeLogin;
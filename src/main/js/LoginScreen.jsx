import React from 'react';
import {Form,Col,FormGroup, ControlLabel,FormControl,Button} from 'react-bootstrap';
import BloggerConstants from './BloggerConstants';

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userId: "",
      password: "",
      userIdValid:null,
      passwordValid:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.processSignIn = this.processSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleChange(event) {
    console.log("Login screen handle change :"+event.target.value);
    console.log("handle change :"+event.target.name);
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      userIdValid :null,
      passwordValid :null,
    });
  }

  processSignIn(event) {
    console.log("==processSignIn :"+event.target.value);
    console.log("handleSubmit this.state.userId.length:"+this.state.userId.length);
    event.preventDefault();
    var validationError = false;
    if(this.state.userId.length == 0) {
      console.log("error rxd");
      this.setState({userIdValid: "error"});
      validationError = true;
    }
    if (this.state.password.length == 0){
      console.log("error rxd 2");
      this.setState({passwordValid: "error"});
      validationError = true;
    }
    if(!validationError){
      console.log('Login details submitted: ' + this.state.userId +" "+ this.state.password);
      console.log('Login details submitted this.props.loginReason:'+this.props.loginReason);
      var loginData = {"userData" : {
                                      "userId" : this.state.userId,
                                      "password" : this.state.password
                                    },
                                    "loginReason" : this.props.loginReason
                      }
    console.log('Login details submitted ++:'+loginData);
    console.log('Login details submitted usrDetails ++:'+loginData.userData);
    console.log('Login details submitted loginReason ++:'+loginData.loginReason);
    console.log('Login details submitted ++:'+JSON.stringify(loginData));
    console.log('Login details b4 submit userId setting state with value++: ' + this.state.userId);
    this.props.onLoginDataReceived(loginData);
    this.setState({
      userId: "",
      password: "",
      userIdValid:null,
      passwordValid:null
    });
  //  loginUserId.value = "";
  //  loginPassword.value = "";
    console.log('Login details after submitted userId: ' + this.state.userId);
  }
}

handleSignUp(event) {
  console.log('Sign up requested++');
  var loginData = {"userData" : null,
  "loginReason" : this.props.loginReason
}
console.log('Sign up requested loginData:'+loginData);
this.props.onLoginDataReceived(loginData);
}

render() {
  console.log("Login Screen");
  var style = {
    marginTop:"5%",
    marginRight:"5%"
  };
  var signUpUrlStyle = {
    marginLeft:"73%"
  }
  return (
    <div>
      <Form horizontal style={style}>
        <FormGroup
          controlId="loginUserId"
          validationState={this.state.userIdValid}>
          <Col componentClass={ControlLabel} smOffset={7} sm={2}>
            User Id
          </Col>
          <Col sm={3}>
            <FormControl type="input" placeholder="User Id"  name="userId" onChange={this.handleChange}/>
          </Col>
        </FormGroup>

        <FormGroup
          controlId="loginPassword"
          validationState={this.state.passwordValid}>
          <Col componentClass={ControlLabel} smOffset={7} sm={2}>
            Password
          </Col>
          <Col sm={3}>
            <FormControl type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={9} sm={3}>
            <Button type="submit" id="signInbtn" onClick={this.processSignIn}>
              Sign in
            </Button>
          </Col>
        </FormGroup>
      </Form>
      <a href="#" style={signUpUrlStyle} onClick={this.handleSignUp} id="signUp">Don't have a login ? Sign Up</a>
    </div>
  );
}
}
export default LoginScreen;

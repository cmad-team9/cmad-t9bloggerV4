	import React from 'react';
	import {Form,FormGroup, ControlLabel,FormControl,Col,ButtonGroup,Button} from 'react-bootstrap'

	class NewUser extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				userId: "",
				password: "",
	      firstName: "",
	      lastName:"",
	      nickName:"",
				userIdValid:null,
				passwordValid:null,
	      firstNameValid:null,
	      lastNameValid:null,
	      nickNameValid:null

			};
			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleCancel = this.handleCancel.bind(this);
		}

		handleChange(event) {
			console.log("New user handle change :"+event.target.value);
			console.log("New user handle change :"+event.target.name);
			const target = event.target;
			const value = target.value;
			const name = target.name;
			this.setState({
				[name]: value,
	      userIdValid:null,
				passwordValid:null,
	      firstNameValid:null,
	      lastNameValid:null,
	      nickNameValid:null
			});
		}

		handleSubmit(event) {
			console.log("==handleSubmit :"+event.target.value);
			console.log("handleSubmit this.state.blogTitle.length:"+this.state.userId.length);
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
	    if (this.state.firstName.length == 0){
				console.log("error rxd 3");
				this.setState({firstNameValid: "error"});
				validationError = true;
			}
	    if (this.state.lastName.length == 0){
				console.log("error rxd 4");
				this.setState({lastNameValid: "error"});
				validationError = true;
			}
	    if (this.state.nickName.length == 0){
				console.log("error rxd 5");
				this.setState({nickNameValid: "error"});
				validationError = true;
			}
			if(!validationError){
				console.log('A new user was submitted:-- ' + this.state.userId +" "+ this.state.password);
				var newUserData = {userDetails : {
					userId : this.state.userId,
					password : this.state.password,
					firstName: this.state.firstName,
					lastName:this.state.lastName,
					nickName:this.state.nickName,

				},
				userAddReason : this.props.userAddReason
			}
			this.props.onNewUserDataReceived(newUserData);
			this.setState({
				userId: "",
				password: "",
	      firstName: "",
	      lastName:"",
	      nickName:"",
	      userIdValid:null,
				passwordValid:null,
	      firstNameValid:null,
	      lastNameValid:null,
	      nickNameValid:null
			});
			// signUpUserId.value = "";
	    // signUpPassword.value = "";
			// signUpfirstName.value = "";
	    // signUplastName.value = "";
			// signUpnickName.value = "";

		}
		}

		handleCancel(event) {
			this.setState({
				userId: "",
				password: "",
	      firstName: "",
	      lastName:"",
	      nickName:"",
	      userIdValid:null,
				passwordValid:null,
	      firstNameValid:null,
	      lastNameValid:null,
	      nickNameValid:null
			});
		}

		render() {
			console.log("New User render");
			var style = {
				marginTop: "5%",
				marginRight:"35%"
			};
			var headingStyle = {
				marginTop: "5%",
				textAlign:"center",
				fontWeight:"bold"
			}
	    var buttonStyle = {
	      marginLeft:"70%"
	    }
			return (

				<div >
					<h3 style={headingStyle}>Signing up is easy </h3>

	        <Form horizontal style={style}>
	           <FormGroup
	             controlId="signUpUserId"
	              validationState={this.state.userIdValid}>
	             <Col componentClass={ControlLabel} smOffset={4} sm={3}>
	               User Id
	             </Col>
	             <Col sm={5}>
	               <FormControl type="input" placeholder="User Id"  name="userId" onChange={this.handleChange}/>
	             </Col>
	           </FormGroup>

	           <FormGroup
	             controlId="signUpPassword"
	             validationState={this.state.passwordValid}>
	             <Col componentClass={ControlLabel} smOffset={4} sm={3}>
	               Password
	             </Col>
	             <Col sm={5}>
	               <FormControl type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
	             </Col>
	           </FormGroup>

	           <FormGroup
	             controlId="signUpfirstName"
	              validationState={this.state.firstNameValid}>
	             <Col componentClass={ControlLabel} smOffset={4} sm={3}>
	               First Name
	             </Col>
	             <Col sm={5}>
	               <FormControl type="input" placeholder="First Name"  name="firstName" onChange={this.handleChange}/>
	             </Col>
	           </FormGroup>

	           <FormGroup
	             controlId="signUplastName"
	              validationState={this.state.lastNameValid}>
	             <Col componentClass={ControlLabel} smOffset={4} sm={3}>
	               Last Name
	             </Col>
	             <Col sm={5}>
	               <FormControl type="input" placeholder="Last Name"  name="lastName" onChange={this.handleChange}/>
	             </Col>
	           </FormGroup>

	           <FormGroup
	             controlId="signUpnickName"
	              validationState={this.state.nickNameValid}>
	             <Col componentClass={ControlLabel} smOffset={4} sm={3}>
	               NickName
	             </Col>
	             <Col sm={5}>
	               <FormControl type="input" placeholder="Nick Name"  name="nickName" onChange={this.handleChange}/>
	             </Col>
	           </FormGroup>
	        <ButtonGroup style={buttonStyle}>
					<Button type="submit" id="submitNewUserbtn" onClick={this.handleSubmit}>Submit</Button>	&nbsp;
					<Button type="reset" id="cancelNewUserbtn" onClick={this.handleCancel}>Clear</Button>
	        </ButtonGroup>
				</Form>
	    </div>
			);
		}
	}
	export default NewUser;

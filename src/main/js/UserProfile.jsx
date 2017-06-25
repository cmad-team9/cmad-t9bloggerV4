import React from 'react';
import {Form,FormGroup, ControlLabel,FormControl,Col,ButtonGroup,Button} from 'react-bootstrap'

class UserProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			password: props.userData.password,
			firstName: props.userData.firstName,
			lastName:props.userData.lastName,
			nickName:props.userData.nickName,
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
		console.log("handle change :"+event.target.value);
		console.log("handle change :"+event.target.name);
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value,
			passwordValid:null,
			firstNameValid:null,
			lastNameValid:null,
			nickNameValid:null
		});
	}

	handleSubmit(event) {
		console.log("==handleSubmit :"+event.target.value);
		event.preventDefault();
		var validationError = false;
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
			console.log('A profile update was submitted:-- ' + this.props.userData.userId );
			var newUserData = {
				userId : this.props.userData.userId,
				password : this.state.password,
				firstName: this.state.firstName,
				lastName:this.state.lastName,
				nickName:this.state.nickName
			}
			this.props.onUpdatedUserDataReceived(newUserData);
		}
	}

	handleCancel(event) {
		this.setState({
			passwordValid:null,
			firstNameValid:null,
			lastNameValid:null,
			nickNameValid:null
		});
	}

	render() {
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
		var userId = this.props.userData.userId;
		console.log("edit profile for:"+userId);
		var title =  userId+" : "+"Edit Profile";
		return (

			<div >
				<h3 style={headingStyle}>{title}</h3>
				<Form horizontal style={style}>
					<FormGroup
						controlId="loginPassword"
						validationState={this.state.passwordValid}>
						<Col componentClass={ControlLabel} smOffset={4} sm={3}>
							Password
						</Col>
						<Col sm={5}>
							<FormControl type="password" defaultValue={this.props.userData.password} name="password" onChange={this.handleChange}/>
						</Col>
					</FormGroup>

					<FormGroup
						controlId="firstName"
						validationState={this.state.firstNameValid}>
						<Col componentClass={ControlLabel} smOffset={4} sm={3}>
							First Name
						</Col>
						<Col sm={5}>
							<FormControl type="input" defaultValue={this.props.userData.firstName}  name="firstName" onChange={this.handleChange}/>
						</Col>
					</FormGroup>

					<FormGroup
						controlId="lastName"
						validationState={this.state.lastNameValid}>
						<Col componentClass={ControlLabel} smOffset={4} sm={3}>
							Last Name
						</Col>
						<Col sm={5}>
							<FormControl type="input" defaultValue={this.props.userData.lastName}  name="lastName" onChange={this.handleChange}/>
						</Col>
					</FormGroup>
					
					<FormGroup
						controlId="nickName"
						validationState={this.state.nickNameValid}>
						<Col componentClass={ControlLabel} smOffset={4} sm={3}>
							NickName
						</Col>
						<Col sm={5}>
							<FormControl type="input" defaultValue={this.props.userData.nickName} name="nickName" onChange={this.handleChange}/>
						</Col>
					</FormGroup>
					<ButtonGroup style={buttonStyle}>
						<Button type="submit" id="submitNewUserbtn" onClick={this.handleSubmit}>Submit</Button>	&nbsp;
						<Button type="reset" id="cancelNewUserbtn" onClick={this.handleCancel}>Cancel</Button>
					</ButtonGroup>
				</Form>
			</div>
		);
	}
}
export default UserProfile;

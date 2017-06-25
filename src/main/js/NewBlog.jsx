import React from 'react';
import {FormGroup, ControlLabel,FormControl,Button} from 'react-bootstrap'

class NewBlog extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			blogTitle: "",
			blogDescription: "",
			blogTitleValid:null,
			blogTitleValid:null
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleChange(event) {
		console.log("New Blog handle change :"+event.target.value);
		console.log("New blog handle change :"+event.target.name);
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value,
			blogTitleValid :null,
			blogDescriptionValid :null,
		});
	}

	handleSubmit(event) {
		console.log("New blog handleSubmit :"+event.target.value);
		console.log("handleSubmit this.state.blogTitle.length:"+this.state.blogTitle.length);
		event.preventDefault();
		var validationError = false;
		if(this.state.blogTitle.length == 0) {
			console.log("error rxd");
			this.setState({blogTitleValid: "error"});
			validationError = true;
		}
		if (this.state.blogDescription.length == 0){
			console.log("error rxd 2");
			this.setState({blogDescriptionValid: "error"});
			validationError = true;
		}
			if(!validationError){
				console.log('New blog was submitted:-- ' + this.state.blogTitle +" "+ this.state.blogDescription);
				console.log("props:"+this.props.onNewBlogDataReceived);
				var newBlogData = {
					title : this.state.blogTitle,
					description : this.state.blogDescription
				}
				this.props.onNewBlogDataReceived(newBlogData);
			}
	}

	handleCancel(event) {
		this.setState({
			blogTitle: "",
			blogDescription: "",
			blogTitleValid:null,
			blogDescriptionValid:null
		});
	}

	render() {
		console.log("New Blog render");
		var style = {
			marginLeft: "15%",
			marginTop: "5%",
			marginRight:"10%"
		};
		var headingStyle = {
			textAlign:"center",
			fontWeight:"bold"
		}
		return (

			<form style={style}>
				<h4 style={headingStyle}>New Blog</h4>

				<FormGroup
					controlId="newBlogInput"
					validationState={this.state.blogTitleValid}
					>
					<ControlLabel>Blog Title</ControlLabel>
					<FormControl
						placeholder="Enter title"
						onChange={this.handleChange}
						name="blogTitle"
					/>
				</FormGroup>
				<FormGroup
					controlId="blogDescription"
					validationState={this.state.blogDescriptionValid}
					>
					<ControlLabel>Blog Description</ControlLabel>
					<FormControl componentClass="textarea" rows="10" placeholder="Enter Description" name="blogDescription" onChange={this.handleChange}/>
				</FormGroup>
				<Button type="submit" id="submitNewBlogbtn" onClick={this.handleSubmit}>Submit</Button>	&nbsp;
				<Button type="reset" id="cancelNewBlogbtn" onClick={this.handleCancel}>Clear</Button>
			</form>
		);
	}
}
export default NewBlog;

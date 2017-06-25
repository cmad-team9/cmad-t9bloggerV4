import React from 'react';
import {Form,FormGroup, ControlLabel,FormControl,Well,Button,ButtonGroup,Pager} from 'react-bootstrap'
import BlogDisplay from './BlogDisplay.jsx';
import CommentDisplay from './CommentDisplay.jsx';
import BloggerConstants from './BloggerConstants';
import { parse_link_header } from './BloggerUtils';
import $ from 'jquery';

class BlogAndCommentsScrn extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			commentData : [],
			sortOrder:"oldest",
			commentInputDescription : "",
			commentInputDescriptionValid :null,
			loadMoreCommentsLink : null
		};
		this.fetchBlogComments = this.fetchBlogComments.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.changeCommentSortingOrder = this.changeCommentSortingOrder.bind(this);
		this.configureCommentPagingOptions = this.configureCommentPagingOptions.bind(this);
		this.requestLogin = this.requestLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.loadMoreComments = this.loadMoreComments.bind(this);
	}

	loadMoreComments() {
		console.log("loading more comments**");
		var targetUrl = this.state.loadMoreCommentsLink;
		console.log("targetUrl in comment pagingOptions click :"+targetUrl);
		var sortorder = this.state.sortOrder;
		console.log("loading more comments sortorder:"+sortorder);
		$.ajax({
			url : targetUrl,
			type : 'get',
			contentType: "application/json; charset=utf-8",
			data : {"sortOrder":sortorder},
			dataType : 'json',
			success : function(data,textStatus, jqXHR) {
				console.log("loading more comments success callback");
				this.setState({
					commentData: this.state.commentData.concat(data)
				});
				this.configureCommentPagingOptions(jqXHR.getResponseHeader("LINK"));
			}.bind(this),
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("loading more comments error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown :"+errorThrown);
			}.bind(this),
			complete : function( jqXHR, textStatus ) {
				console.log("loading more comments complete callback");
			}.bind(this)
		});
	}

	changeCommentSortingOrder(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		console.log("changeCommentSortingOrder ++ :"+event.target.value);
		var sortingorder = event.target.value;
		console.log("sorting order sortingorder ++:"+sortingorder);
		console.log("B4 setting state sortOrder##++:"+this.state.sortOrder);
		this.setState({
			sortOrder : sortingorder},
			function () {
				console.log("########################CB FUNC sortOrder++:"+this.state.sortOrder);
				this.fetchBlogComments();
			}
		);
		console.log("After setting state sortOrder++:"+this.state.sortOrder);
	}

	configureCommentPagingOptions(linkheader) {
		this.setState({
			loadMoreCommentsLink : null
		});
		if(linkheader.length != 0) {
			var parsedLinks = parse_link_header(linkheader);
			console.log("Parsing linkheader :"+parsedLinks);
			for (var key in parsedLinks) {
				var keyToMatch = key.toLowerCase();
				console.log("keyToMatch:"+keyToMatch);
				if(keyToMatch === "next") {
					console.log("Showing load more comments");
					this.setState({
						loadMoreCommentsLink : parsedLinks[key]
					});
				}
			}
		}
	}

	requestLogin() {
		this.props.onLoginRequestForComment();
	}


	componentDidMount() {
		console.log("BlogAndCommentsScrn componentDidMount sortingOrder"+this.props.sortingOrder);
		var searchStr = this.props.searchStr;
		var userfilter = this.props.userFilter;
		this.fetchBlogComments();
	}

	fetchBlogComments() {
		if(this.props.selectedBlogData != undefined){
			var blogId = this.props.selectedBlogData.blogId;
			console.log("fetchBlogComments blogId :"+blogId);
			console.log("fetchBlogComments blogtitle :"+this.props.selectedBlogData.title);
			console.log("fetchBlogComments this.state.sortOrder :"+this.state.sortOrder);
			console.log("fetchBlogComments this.state.sortOrder val :"+this.state.sortOrder);

			$.ajax({
				url : 'rest/blogger/blogs/'+blogId+'/comments',
				type : 'get',
				contentType: "application/json; charset=utf-8",
				dataType : 'json',
				data : {"offset": "0","pageSize": BloggerConstants.COMMENT_PAGESIZE,"sortOrder":this.state.sortOrder},
				success : function(data,textStatus, jqXHR) {
					console.log("fetchBlogComments success callback:"+data);
					this.setState({
						commentData: data
					});
					this.configureCommentPagingOptions(jqXHR.getResponseHeader("LINK"));
				}.bind(this),
				error : function( jqXHR,textStatus, errorThrown ) {
					console.log("fetchBlogComments error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
					// Need to show in a miniscreen.Let's leave it for now.
					//showErrorScreen("No content Found");
				}.bind(this),
				complete : function( jqXHR, textStatus ) {
					console.log("fetchBlogComments complete callback");
				}.bind(this)
			});
		}

	}

	handleChange(event) {
		console.log("handle change :"+event.target.value);
		console.log("handle change :"+event.target.name);
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value,
			commentInputDescriptionValid :null

		});
	}

	handleSubmit(event) {
		console.log("==handleSubmit++ :"+event.target.value);
		console.log("handleSubmit this.state.commentInputDescription.length:"+this.state.commentInputDescription.length);
		event.preventDefault();
		var validationError = false;
		if(this.state.commentInputDescription.length == 0) {
			console.log("error rxd");
			this.setState({commentInputDescriptionValid : "error"});
			validationError = true;
		}
		if(!validationError){
			console.log('A comment was submitted:-- ' + this.state.commentInputDescription);
			var blogId = this.props.selectedBlogData.blogId;
			console.log("commentInput blogId:"+blogId);
			var commentDescription = this.state.commentInputDescription;
			console.log("commentInput commentDescription:"+commentDescription);
			var sortOrder = this.state.sortOrder;
			var comment = {
				"comment" : commentDescription

			};
			$.ajax({
				url : 'rest/blogger/blogs/'+blogId+'/comments',
				type : 'post',
				contentType: "application/json; charset=utf-8",
				headers: {"AUTHORIZATION": window.sessionStorage.getItem('accessToken')},
				success : function(data,textStatus, jqXHR) {
					console.log("submitCommentbtn success callback++**");
					console.log("submit commentInputDescription ++:"+this.state.commentInputDescription);
					this.setState({
						commentInputDescription: "",
						commentInputDescriptionValid:null
					});
					commentInputDescription.value = "";
					console.log("submit commentInputDescription ++:"+this.state.commentInputDescription);
					this.fetchBlogComments();

				}.bind(this),
				error : function( jqXHR,textStatus, errorThrown ) {
					console.log("submitCommentbtn error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
					//showErrorScreen("Unexpected error");
				}.bind(this),
				complete : function( jqXHR, textStatus ) {
					console.log("submitCommentbtn complete callback");
				}.bind(this),
				data : JSON.stringify(comment),
				statusCode: {
					400: function() {
						alert('Incorrect data entered.Kindly recheck');
					}
				}
			});
		}
	}

	handleCancel(event) {
		this.setState({
			commentInputDescription: "",
			commentInputDescriptionValid:null
		});
	}
	render() {
		console.log("Blog Display render&&");
		var style = {
			//marginLeft: "10%",
			//marginTop: "5%",
			marginRight:"10%"
		};
		var headingStyle = {
			//textAlign:"left",
			fontWeight:"bold",
			textDecoration:"underline",
			display:"inline",
			marginLeft:"12%"
		}
		var selectStyle = {
			//float:"right",
			display:"inline",
			marginLeft:"5%"
			//marginRight : "50%"
		}
		var uStyle = {
			marginLeft:"12%"
		}
		var loginLinkStyle = {
			marginLeft:"10%"
		}
		var commentInputDescriptionStyle = {
			marginLeft:"10%"
			//width: "400px"
			//marginRight:"10%"
		}
		var textInputWidth ={
			width: "575px"
		}

		var commentButtonStyle ={
			padding: "8% 0%",
			paddingLeft:"30px",
			paddingRight:"30px"
		}
		var hrStyle = {
			marginLeft: "10%",
			//marginTop: "5%",
			marginRight:"45%",
		}
		var commentDataToRender = [];
		var tempObj;
		for( var i = 0;i < this.state.commentData.length;i++){

			commentDataToRender.push(<CommentDisplay commentData = {this.state.commentData[i]} />);
		}
		var loginLink = <div>
			<a href="#" id="loginToComment"style={loginLinkStyle} onClick={this.requestLogin}>Please login/signup to comment</a>
		</div>
		var commentTextArea = <Form inline style ={commentInputDescriptionStyle} >
			<FormGroup
				controlId="commentInputDescription"
				validationState={this.state.commentInputDescriptionValid}
				>
					<FormControl  style={textInputWidth}componentClass="textarea" rows="2" placeholder="Post your comment" name="commentInputDescription" onChange={this.handleChange}/>
				</FormGroup>
				<ButtonGroup >
					<Button style={commentButtonStyle} type="submit" id="submitNewCommentbtn" onClick={this.handleSubmit}>Post</Button>
					<Button style={commentButtonStyle} type="reset" id="cancelNewCommentbtn" onClick={this.handleCancel}>Clear</Button>
				</ButtonGroup>
			</Form>
			var commentInput = (this.props.loggedInUser != "") ?commentTextArea:loginLink;
			console.log("commentInput **:"+commentInput);
			var loadMoreCommentsOption;
			if (this.state.loadMoreCommentsLink != null ) {
				loadMoreCommentsOption = <Pager>
					<Pager.Item onClick={this.loadMoreComments}href="#">Load More Comments</Pager.Item>
				</Pager>
			}

			return (
				<div >
					<BlogDisplay blogData = {this.props.selectedBlogData} hideCommentOption={true}></BlogDisplay>
					<div style={style}>
						<h5 id ="commentHeading" style={headingStyle}>Comments</h5>
						<Form inline style={selectStyle}>
							<FormGroup controlId="formInlineSelect">
								<FormControl componentClass="select" placeholder="select" onChange={this.changeCommentSortingOrder} >
									<option value="oldest">Oldest First</option>
									<option value="newest">Recent First</option>
								</FormControl>
							</FormGroup>
						</Form>
						<hr style={uStyle}/>
					</div>
					{commentInput}
					<hr style= {hrStyle}/>
					{commentDataToRender}
					{loadMoreCommentsOption}
				</div>
			);
		}
	}
	export default BlogAndCommentsScrn;

import React from 'react';
import {FormGroup, ControlLabel,FormControl,Well} from 'react-bootstrap';
import Moment from 'react-moment';



class BlogDisplay extends React.Component {
	constructor(props){
		super(props);
		this.handleViewAddComments = this.handleViewAddComments.bind(this);
	}

	handleViewAddComments(event) {
		console.log("handleViewAddComments :"+this.props.blogData.title);
		this.props.onUserTriggerForDetailedView(this.props.blogData);
	}
	render() {
		console.log("Blog Display render");
		var style = {
			marginLeft: "10%",
			marginTop: "5%",
			marginRight:"10%"
		};
		var headingStyle = {
			textAlign:"center",
			fontWeight:"bold"
		}
    var metaStyle = {
			textAlign:"right",
			fontStyle:"italic",
			fontSize :"12px"
    //  fontWeight:"bold"
		}
		var blogTitle = (this.props.blogData === undefined) ? "":this.props.blogData.title;
		var blogDescription = (this.props.blogData === undefined) ? "":this.props.blogData.description;
		var blogAuthor = (this.props.blogData === undefined) ? "":this.props.blogData.userId;
		var blogPostedDate = (this.props.blogData === undefined) ? "":this.props.blogData.postedDate;
		var addViewComments = null;
		if(this.props.hideCommentOption != true){
			addViewComments = <a href="#" id = "commentOptionspost" onClick={this.handleViewAddComments} >View/Add Comments </a>
		}
		return (
      <div style={style}>
        <h4 id ="postHeading" style={headingStyle}>{blogTitle}</h4>
        <p id ="postContent">
          {blogDescription}
        </p>
        <div id ="postmeta"style={metaStyle}> Posted by
            <span id = "postauthor"> {blogAuthor}</span>
            <time id = "posttime"> <Moment fromNow>{blogPostedDate}</Moment></time>
        </div>
        {addViewComments}
      </div>
		);
	}
}
export default BlogDisplay;

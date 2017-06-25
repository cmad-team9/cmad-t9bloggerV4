import React from 'react';
import {FormGroup, ControlLabel,FormControl,Well} from 'react-bootstrap'
import Moment from 'react-moment';


class CommentDisplay extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		console.log("comment Display render");
		var style = {
			marginLeft: "10%",
			//marginTop: "5%",
			marginRight:"45%",
		}

    var metaStyle = {
			textAlign:"right",
			fontStyle:"italic",
			fontSize :"12px"
		}
		var commentAuthor =(this.props.commentData === undefined) ? "test": this.props.commentData.commentorId;
		var commentTime = (this.props.commentData === undefined) ? "test":this.props.commentData.postedDate;
		var commentDescription = (this.props.commentData === undefined) ? "test":this.props.commentData.comment;
		return (

      <div id ='newcommentIdx' style={style}>
        <p>{commentDescription}</p>
			  <div id ='commentmeta'  style={metaStyle}>Posted by
								   <span id = 'commentauthor'> {commentAuthor}</span>
							     <time id = 'commenttime'> <Moment fromNow>{commentTime}</Moment> </time>
        </div>
        <hr/>
      </div>
		);
	}
}
export default CommentDisplay;

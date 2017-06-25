package com.cisco.cmadt9blogger.api;

import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.PrePersist;



@Entity
public class BlogComment {

	@Id
	private String commentId = new ObjectId().toHexString();

	private String comment;

	private String commentorId;

	private Date postedDate;

	private String blogId;

	public BlogComment() {
		super();
	}

	public BlogComment(String commentId, String comment, String commentorId, Date postedDate, String blogId) {
		super();
		this.commentId = commentId;
		this.comment = comment;
		this.commentorId = commentorId;
		this.postedDate = postedDate;
		this.blogId = blogId;
	}

	@PrePersist
	protected void onCreate() {
		postedDate = new Date();
	}

	public String getCommentId() {
		return commentId;
	}

	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getCommentorId() {
		return commentorId;
	}

	public void setCommentorId(String commentorId) {
		this.commentorId = commentorId;
	}

	public Date getPostedDate() {
		return postedDate;
	}

	public void setPostedDate(Date postedDate) {
		this.postedDate = postedDate;
	}

	public String getBlogId() {
		return blogId;
	}

	public void setBlogId(String blogId) {
		this.blogId = blogId;
	}
}

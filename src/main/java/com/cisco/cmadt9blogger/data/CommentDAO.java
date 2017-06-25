package com.cisco.cmadt9blogger.data;

import java.util.List;

import com.cisco.cmadt9blogger.api.BlogComment;

public interface CommentDAO {
	void createComment(BlogComment comment);
	BlogComment readComment(String commentId);
	List<BlogComment> getAllComments(String blogId,int offset,int pageSize,String sortOrder);
	long getCommentCount(String blogId);
	void deleteComment(String commentId);
	void deleteAllComments(String blogId);
}

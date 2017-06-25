package com.cisco.cmadt9blogger.api;

import java.util.List;

public interface Blogger {
	String signupNewUser(User user) throws InvalidUserDetailsException,UserAlreadyExistsException, BloggerException;
	String loginUser(String userId, String password) throws SecurityException,BloggerException;
	User getUserDetails(String userId) throws UserNotFoundException,BloggerException;
	void updateUserProfile(User user) throws InvalidUserDetailsException,BloggerException;
	void deleteUser(String userId)  throws UserNotFoundException,BloggerException;

	String addBlog(Blog blog) throws InvalidBlogException,BloggerException;
	List<Blog> getAllBlogs(int offset,int pageSize,String searchStr,String userFilter) throws BlogNotFoundException,BloggerException; 
	Blog getBlog(String blogId) throws BlogNotFoundException,BloggerException;
	long getBlogCount(String searchStr,String userFilter) throws BloggerException;
	void deleteBlog(String blogId) throws BlogNotFoundException,BloggerException;

	void addComment(BlogComment comment) throws InvalidCommentException,BloggerException;
	List<BlogComment> getAllComments(String blogId,int offset,int pageSize,String sortOrder) throws CommentNotFoundException, BloggerException;
	long getCommentCount(String blogId) throws BloggerException;
	void deleteComment(String commentId) throws CommentNotFoundException,BloggerException;
	void deleteAllComments(String blogId) throws BloggerException;
}

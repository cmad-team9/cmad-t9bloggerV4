package com.cisco.cmadt9blogger.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.mongodb.morphia.Datastore;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.cisco.cmadt9blogger.api.Blog;
import com.cisco.cmadt9blogger.api.BlogComment;
import com.cisco.cmadt9blogger.api.BlogNotFoundException;
import com.cisco.cmadt9blogger.api.Blogger;
import com.cisco.cmadt9blogger.api.BloggerException;
import com.cisco.cmadt9blogger.api.CommentNotFoundException;
import com.cisco.cmadt9blogger.api.InvalidBlogException;
import com.cisco.cmadt9blogger.api.InvalidCommentException;
import com.cisco.cmadt9blogger.api.InvalidUserDetailsException;
import com.cisco.cmadt9blogger.api.User;
import com.cisco.cmadt9blogger.api.UserAlreadyExistsException;
import com.cisco.cmadt9blogger.api.UserNotFoundException;
import com.cisco.cmadt9blogger.data.BlogDAO;
import com.cisco.cmadt9blogger.data.CommentDAO;
import com.cisco.cmadt9blogger.data.MongoBlogDAO;
import com.cisco.cmadt9blogger.data.MongoCommentsDAO;
import com.cisco.cmadt9blogger.data.MongoUserDAO;
import com.cisco.cmadt9blogger.data.MorphiaService;
import com.cisco.cmadt9blogger.data.UserDAO;

public class T9Blogger implements Blogger{

	private UserDAO userDao;
	private BlogDAO blogDao;
	private CommentDAO commentDAO;
	
	
	public T9Blogger(){
		Datastore ds = new MorphiaService().getDatastore();
		userDao = new MongoUserDAO(User.class,ds);
		blogDao = new MongoBlogDAO(Blog.class,ds);
		commentDAO = new MongoCommentsDAO(BlogComment.class,ds);
	}

	public String signupNewUser(User user)
			throws InvalidUserDetailsException, UserAlreadyExistsException, BloggerException {
		if (user == null || 
			!(checkStringCorrectness(user.getUserId()) && 
			checkStringCorrectness(user.getPassword()) &&
			checkStringCorrectness(user.getFirstName()))) 
			throw new InvalidUserDetailsException();
		if (userDao.readUser(user.getUserId()) != null)
			throw new UserAlreadyExistsException();
		System.out.println("T9Blogger user");
		userDao.createUser(user);
		String token = issueToken(user.getUserId());
		return token;
	}

	public String loginUser(String userId,String password) throws SecurityException,/*InvalidCredentialsException, */BloggerException {
		// Authenticate the user using the credentials provided
		if(authenticate(userId, password)) {
			// Issue a token for the user
			String token = issueToken(userId);
			// Return the token on the response
			if(token == null){
				throw new BloggerException();
			}else
				return token;
		} else {
			throw new SecurityException("Invalid user/password");
		}
		
	}

	public User getUserDetails(String userId) throws UserNotFoundException, BloggerException {
		User user = userDao.readUser(userId);
		if (user == null)
			throw new UserNotFoundException();
		return user;
	}


	public String addBlog(Blog blog) throws InvalidBlogException,/* DuplicateBlogException, */BloggerException {
		if (blog == null || !(checkStringCorrectness(blog.getTitle()) && 
				              checkStringCorrectness(blog.getDescription())) )
			throw new InvalidBlogException();
		return blogDao.createBlog(blog);
	}

	public Blog getBlog(String blogId) throws BlogNotFoundException, BloggerException {
		Blog blog = blogDao.readBlog(blogId);
		if (blog == null)
			throw new BlogNotFoundException();
		return blog;
	}

	public List<Blog> getAllBlogs(int offset,int pageSize,String searchStr,String userFilter) throws BlogNotFoundException, BloggerException {
		List<Blog> blogList = blogDao.getAllBlogs(offset,pageSize,searchStr,userFilter);
		if (blogList == null || blogList.isEmpty())
			throw new BlogNotFoundException();
		return blogList;
	}



	public void updateUserProfile(User user) throws InvalidUserDetailsException, BloggerException {
		if (user == null || (userDao.readUser(user.getUserId()) == null))
			throw new InvalidUserDetailsException();
		userDao.updateUser(user);
	}

	public void addComment(BlogComment comment) throws InvalidCommentException, BloggerException {
		if(comment == null || !(checkStringCorrectness(comment.getComment())) ){
			throw new InvalidCommentException();
		}
		commentDAO.createComment(comment);

	}

	public List<BlogComment> getAllComments(String blogId,int offset,int pageSize,String sortOrder) throws CommentNotFoundException, BloggerException {
		List<BlogComment> commentList = commentDAO.getAllComments(blogId,offset,pageSize,sortOrder);
		if (commentList == null || commentList.isEmpty())
			throw new CommentNotFoundException();
		return commentList;
	}

	public long getBlogCount(String searchStr,String userFilter) throws BloggerException {
		return blogDao.getBlogCount(searchStr,userFilter);
	}

	public long getCommentCount(String blogId) throws BloggerException {
		return commentDAO.getCommentCount(blogId);
	}

	public void deleteUser(String userId) throws UserNotFoundException, BloggerException {
		User user = userDao.readUser(userId);
		if (user == null)
			throw new UserNotFoundException();
		userDao.deleteUser(userId);
	}

	public void deleteBlog(String blogId) throws BlogNotFoundException, BloggerException {
		Blog blog = blogDao.readBlog(blogId);
		if (blog == null)
			throw new BlogNotFoundException();
		commentDAO.deleteAllComments(blogId);
		blogDao.deleteBlog(blogId);
	}

	public void deleteComment(String commentId) throws CommentNotFoundException, BloggerException {
		BlogComment comment = commentDAO.readComment(commentId);
		if (comment == null)
			throw new CommentNotFoundException();
		commentDAO.deleteComment(commentId);
		
	}
	
	private String issueToken(String userId) {
		String jwtToken = null;
		try {
			Algorithm algorithm = Algorithm.HMAC256("secret");
			jwtToken= JWT.create()
					.withIssuer("auth0")
					.withSubject(userId)
					.sign(algorithm);
		} catch (UnsupportedEncodingException exception){
			//UTF-8 encoding not supported
			System.out.println("Token issue failed :"+exception);
		} catch (JWTCreationException exception){
			//Invalid Signing configuration / Couldn't convert Claims.
			System.out.println("Token issue failed :"+exception);
		}
		return jwtToken;
	}

	private boolean authenticate(String userId, String password) {
		System.out.println("T9Blogger authenticate userId:"+userId);
		boolean retVal = false;
		User user = userDao.readUser(userId);
		if(user != null){
			String storedPassword = user.getPassword();
			System.out.println("authenticate storedPassword:"+storedPassword);
			System.out.println("authenticate password != storedPassword:"+password.equals(storedPassword));
			if(password.equals(storedPassword)){
				//throw new SecurityException("Invalid user/password");
				retVal = true;
			}
		}
		return retVal;
	}
	
	private boolean checkStringCorrectness(String str){
		if(str == null || str.trim().equals("")){
			System.out.println("str :"+str);
			return false;
		}else{
			System.out.println("str true :"+str);
			return true;
		}
	}

	public void deleteAllComments(String blogId) throws BloggerException {
		commentDAO.deleteAllComments(blogId);
		
	}
}

package com.cisco.cmadt9blogger.rest;

import static javax.ws.rs.core.HttpHeaders.AUTHORIZATION;
import static javax.ws.rs.core.HttpHeaders.LINK;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

import com.cisco.cmadt9blogger.api.Blog;
import com.cisco.cmadt9blogger.api.BlogComment;
import com.cisco.cmadt9blogger.api.Blogger;
import com.cisco.cmadt9blogger.api.User;
import com.cisco.cmadt9blogger.service.T9Blogger;


@Path("/blogger")
public class BloggerController {

	private Blogger blogger = new T9Blogger();	
	

	@POST
	@Path("/user")
	@Consumes(MediaType.APPLICATION_JSON) 
	public Response signupNewUser(User user) {
		System.out.println("BloggerController signupNewUser Userid :"+user.getUserId());
		String token = blogger.signupNewUser(user);
		System.out.println("BloggerController signupNewUser token :"+token);
		return Response.ok().header(AUTHORIZATION, "Bearer " + token).build();
	}

	@PUT
	@Path("/user")
	@Consumes(MediaType.APPLICATION_JSON) 
	@RequireJWTToken
	public Response updateUser(@HeaderParam("userId") String userId,User user) {
		System.out.println("BloggerController updateUser userId:"+userId);
		user.setUserId(userId);
		blogger.updateUserProfile(user);
		return Response.ok().build();
	}

	@GET
	@Path("/user/{userId}")
	@Produces(MediaType.APPLICATION_JSON) 
	@RequireJWTToken
	public Response getUserDetails(@PathParam("userId")String userId) {
		System.out.println("BloggerController getUserDetails userId:"+userId);
		User user = blogger.getUserDetails(userId);
		return Response.ok().entity(user).build();
	}

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response loginUser(@FormParam("userId") String userId,@FormParam("password") String password) {
		System.out.println("BloggerController loginUser userId :"+userId);
		String token = blogger.loginUser(userId,password);
		return Response.ok().header(AUTHORIZATION, "Bearer " + token).build();
	}

	@POST
	@Path("/blogs")
	@Consumes(MediaType.APPLICATION_JSON)
	@RequireJWTToken
	public Response addBlog(@HeaderParam("userId") String userId,Blog blog,@Context UriInfo uriInfo) {
		System.out.println("BloggerController addBlog userId :"+userId);
		System.out.println("BloggerController addBlog blog title :"+blog.getTitle());
		blog.setUserId(userId);
		String blogId = blogger.addBlog(blog);
		System.out.println("uriInfo uri:"+uriInfo.getRequestUri());
		UriBuilder uriBuilder = uriInfo.getAbsolutePathBuilder();
		uriBuilder.path(blogId);
		System.out.println("Location Header :"+uriBuilder.build());
	    return Response.created(uriBuilder.build()).build();
	}

	@GET
	@Path("/blogs/{blogId}")
	@Produces(MediaType.APPLICATION_JSON) 
	public Response getBlog(@PathParam("blogId")String blogId) {
		System.out.println("BloggerController getBlog blogId:"+blogId); 
		Blog blog = blogger.getBlog(blogId);
		return Response.ok().entity(blog).build();
	}

	@DELETE
	@Path("/blogs/{blogId}")
	@Produces(MediaType.APPLICATION_JSON)
	@RequireJWTToken
	public Response deleteBlog(@PathParam("blogId")String blogId) {
		System.out.println("BloggerController deleteBlog blogId:"+blogId); 
		blogger.deleteBlog(blogId);
		return Response.ok().build();
	}

	@GET
	@Path("/blogs")
	@Produces(MediaType.APPLICATION_JSON) 
	public Response getAllBlogs(@QueryParam("offset")@DefaultValue("0") int offset,
			@QueryParam("pageSize")@DefaultValue("5") int pageSize,
			@QueryParam("searchStr")String searchStr,	
			@QueryParam("userFilter")String userFilter,		
			@Context UriInfo uriInfo) {
		System.out.println("BloggerController getAllBlogs offset:"+offset+" pageSize:"+pageSize);
		System.out.println("BloggerController getAllBlogs searchStr:"+searchStr+" userFilter:"+userFilter);
		System.out.println("uriInfo uri:"+uriInfo.getRequestUri());
		UriBuilder uriBuilder = uriInfo.getAbsolutePathBuilder();
		GenericEntity<List<Blog>> blogList = new GenericEntity<List<Blog>>(blogger.getAllBlogs(offset,pageSize,searchStr,userFilter)) {};
		long totalCount = blogger.getBlogCount(searchStr,userFilter);
		System.out.println("BloggerController getAllBlogs totalCount:"+totalCount);
		System.out.println("BloggerController getAllBlogs link Header :"+PaginationUtil.getLinkHeaders(uriBuilder, offset, totalCount, pageSize));
		return Response.ok().entity(blogList).header(LINK, PaginationUtil.getLinkHeaders(uriBuilder, offset, totalCount, pageSize)).build();
	}

	@POST
	@Path("/blogs/{blogId}/comments")
	@Consumes(MediaType.APPLICATION_JSON) 
	@RequireJWTToken
	public Response addBlogComment(@HeaderParam("userId") String userId,
			@PathParam("blogId")String blogId,
			BlogComment comment) {
		System.out.println("BloggerController addBlogComment userId:"+userId+" blogId:"+blogId);
		comment.setCommentorId(userId);
		comment.setBlogId(blogId);
		blogger.addComment(comment);
		return Response.ok().build();
	}

	@GET
	@Path("/blogs/{blogId}/comments")
	@Produces(MediaType.APPLICATION_JSON) 
	public Response getAllComments(@PathParam("blogId") String blogId,
			@QueryParam("offset")@DefaultValue("0") int offset,
			@QueryParam("pageSize")@DefaultValue("5") int pageSize,
			@QueryParam("sortOrder") String sortOrder,
			@Context UriInfo uriInfo) {

		UriBuilder uriBuilder = uriInfo.getAbsolutePathBuilder();
		System.out.println("BloggerController getAllComments blogId:"+blogId+" offset:"+offset+" pageSize:"+pageSize);
		System.out.println("BloggerController getAllComments sortOrder:"+sortOrder);
		long totalCommentCount = blogger.getCommentCount(blogId);
		System.out.println("BloggerController getAllComments getCommentCount :"+totalCommentCount);
		GenericEntity<List<BlogComment>> commentList = new GenericEntity<List<BlogComment>>(blogger.getAllComments(blogId, offset, pageSize,sortOrder)) {};
		System.out.println("BloggerController getAllComments link Header :"+PaginationUtil.getLinkHeaders(uriBuilder, offset, totalCommentCount, pageSize));
		return Response.ok().entity(commentList).header(LINK, PaginationUtil.getLinkHeaders(uriBuilder, offset, totalCommentCount, pageSize)).build();
	}
}

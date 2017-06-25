package com.cisco.cmadt9blogger.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
@Provider
@RequireJWTToken
@Priority(Priorities.AUTHENTICATION)
public class RequireJWTTokenFilter implements ContainerRequestFilter {

	public void filter(ContainerRequestContext requestContext) throws IOException {
		// Get the HTTP Authorization header from the request
		String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
		// Extract the token from the HTTP Authorization header
		System.out.println("RequireJWTTokenFilter filter authorizationHeader :"+authorizationHeader);
		if(authorizationHeader != null && !authorizationHeader.equals("null")) {
			String token = authorizationHeader.substring("Bearer".length()).trim();
			System.out.println("RequireJWTTokenFilter filter rxd TOKEN :"+token);        	
			try {
				Algorithm algorithm = Algorithm.HMAC256("secret");
				JWTVerifier verifier = JWT.require(algorithm)
						.withIssuer("auth0")
						.build(); //Reusable verifier instance
				verifier.verify(token);
				DecodedJWT jwt = JWT.decode(token);
				System.out.println("decoded userId:"+jwt.getSubject() );
				requestContext.getHeaders().add("userId", jwt.getSubject());
			} catch (UnsupportedEncodingException exception){
				//UTF-8 encoding not supported
				System.out.println("#### invalid token 1: " +exception+ token);
				requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());

			} catch (JWTVerificationException exception){
				//Invalid signature/claims
				System.out.println("#### invalid token 1: " +exception+ token);
				requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
			}
		} else {
			System.out.println("#### No authorization header");
			requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
		}        
	}
}

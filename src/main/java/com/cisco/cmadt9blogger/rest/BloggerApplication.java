package com.cisco.cmadt9blogger.rest;

import org.glassfish.jersey.server.ResourceConfig;

public class BloggerApplication extends ResourceConfig {
	public BloggerApplication() {
		packages("com.cisco.cmadt9blogger.rest");
	}
}

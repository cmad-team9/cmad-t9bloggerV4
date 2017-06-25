package com.cisco.cmadt9blogger.rest;

import javax.ws.rs.core.UriBuilder;

public class PaginationUtil {

	public static String getLinkHeaders(final UriBuilder uriBuilder, final int offset, final long totalCount, final int pageSize) {

		int totalPages = (int)Math.ceil((double)totalCount/pageSize);
		System.out.println("PaginationUtil getLinkHeaders totalPages :"+totalPages);
		final StringBuilder linkHeader = new StringBuilder();
		if (hasNextPage(offset, totalPages)) {
			final String uriForNextPage = constructNextPageUri(uriBuilder, offset, pageSize);
			linkHeader.append(createLinkHeader(uriForNextPage, "next"));
		}
		if (hasPreviousPage(offset)) {
			final String uriForPrevPage = constructPrevPageUri(uriBuilder, offset, pageSize);
			appendCommaIfNecessary(linkHeader);
			linkHeader.append(createLinkHeader(uriForPrevPage, "prev"));
		}
		if (hasFirstPage(offset,totalPages)) {
			final String uriForFirstPage = constructFirstPageUri(uriBuilder, pageSize);
			appendCommaIfNecessary(linkHeader);
			linkHeader.append(createLinkHeader(uriForFirstPage, "first"));
		}
		if (hasLastPage(offset, totalPages)) {
			final String uriForLastPage = constructLastPageUri(uriBuilder, totalPages, pageSize);
			appendCommaIfNecessary(linkHeader);
			linkHeader.append(createLinkHeader(uriForLastPage, "last"));
		}
		return linkHeader.toString();
	}

	private static String constructNextPageUri(final UriBuilder uriBuilder, final int offset, final int pageSize) {
		return uriBuilder.replaceQueryParam("offset", offset + 1).replaceQueryParam("pageSize", pageSize).build().toString();
	}

	private static String constructPrevPageUri(final UriBuilder uriBuilder, final int offset, final int pageSize) {
		return uriBuilder.replaceQueryParam("offset", offset - 1).replaceQueryParam("pageSize", pageSize).build().toString();
	}

	private static String constructFirstPageUri(final UriBuilder uriBuilder, final int pageSize) {
		return uriBuilder.replaceQueryParam("offset", 0).replaceQueryParam("pageSize", pageSize).build().toString();
	}

	private static String constructLastPageUri(final UriBuilder uriBuilder, final int totalPages, final int pageSize) {
		return uriBuilder.replaceQueryParam("offset", totalPages-1).replaceQueryParam("pageSize", pageSize).build().toString();
	}

	private static boolean hasNextPage(final int page, final int totalPages) {
		return page < totalPages - 1;
	}

	private static boolean hasPreviousPage(final int page) {
		return page > 0;
	}

	private static boolean hasFirstPage(final int page,final int totalPages) {
		return totalPages > 2 && hasPreviousPage(page);
	}

	private static boolean hasLastPage(final int page, final int totalPages) {
		return totalPages > 2 && hasNextPage(page, totalPages);
	}

	private static void appendCommaIfNecessary(final StringBuilder linkHeader) {
		if (linkHeader.length() > 0) {
			linkHeader.append(", ");
		}
	}

	private static String createLinkHeader(final String uri, final String rel) {
		return "<" + uri + ">; rel=\"" + rel + "\"";
	}
}



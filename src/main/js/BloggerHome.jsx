import React from 'react';
import {FormGroup, ControlLabel,FormControl,Well} from 'react-bootstrap'
import BlogDisplay from './BlogDisplay.jsx';
import $ from 'jquery';
import BloggerConstants from './BloggerConstants';
import { parse_link_header } from './BloggerUtils';
import ReactLoading from 'react-loading';


class BloggerHome extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			blogData : [],
			pagingOptionFirst : null,
			pagingOptionPrev : null,
			pagingOptionNext : null,
			pagingOptionLast : null,
			showSpinner : false
		};
		this.fetchBlogs = this.fetchBlogs.bind(this);
		this.handlePagingOption = this.handlePagingOption.bind(this);
		this.configurePagingOptions = this.configurePagingOptions.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
	}

	componentDidMount() {
		console.log("BloggerHome componentDidMount userFilter:"+this.props.userFilter);
		//if(this.props.searchStr != undefined && this.props.searchStr != null && this.props.searchStr.trim != ""){
		// to use for pagination
		//}
		var searchStr = this.props.searchStr;
		var userfilter = this.props.userFilter;
		this.fetchBlogs(searchStr,userfilter);

	}

	componentWillReceiveProps(nextProps) {
		console.log("#################################componentWillReceiveProps nextProps userFilter: "+nextProps.userFilter);
		console.log("#################################componentWillReceiveProps this.props userFilter: "+this.props.userFilter);
		console.log("#################################componentWillReceiveProps nextProps searchStr: "+nextProps.searchStr);
		console.log("#################################componentWillReceiveProps this.props searchStr: "+this.props.searchStr);
		//if(this.props.userFilter != nextProps.userFilter 
		//|| this.props.searchStr != nextProps.searchStr ) {

			this.fetchBlogs(nextProps.searchStr,nextProps.userFilter)
		//} else {
		//	console.log("################################# Not calling FETCH BLOGS");
		//}

	}

	fetchBlogs(searchStr,userfilter){
		this.setState({
				blogData : [],
				pagingOptionFirst : null,
				pagingOptionPrev : null,
				pagingOptionNext : null,
				pagingOptionLast : null,
				showSpinner :true
		});
		$.ajax({
			url : 'rest/blogger/blogs',
			type : 'get',
			contentType: "application/json; charset=utf-8",
			dataType : 'json',
			data : {"offset": "0","pageSize": BloggerConstants.BLOG_PAGESIZE,"searchStr":searchStr,"userFilter":userfilter},
			success : function(data,textStatus, jqXHR) {
				console.log("fetchAllBlogs success callback :"+data);
				this.setState({
					showSpinner :false,
					blogData: data
				});
				this.configurePagingOptions(jqXHR.getResponseHeader("LINK"));
			}.bind(this),
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("fetchAllBlogs error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
			}.bind(this),
			complete : function( jqXHR, textStatus ) {
				console.log("fetchAllBlogs complete callback");
			}.bind(this)
		});

	}



	configurePagingOptions(linkheader) {
		console.log("configurePagingOptions linkheader.length:"+linkheader.length);
		var  first = null;
		var  prev = null;
		var  next = null;
		var  last = null;
		if(linkheader.length != 0) {
			var parsedLinks = parse_link_header(linkheader);
			console.log("--Parsing linkheader-- :"+parsedLinks);

			for (var key in parsedLinks) {
				var keyToMatch = key.toLowerCase();
				console.log("keyToMatch:"+keyToMatch);
				if(keyToMatch === "next") {
					console.log("Showing next");
					next = parsedLinks[key];
				}
				if(keyToMatch === "prev") {
					console.log("Showing prev");
					prev = parsedLinks[key];
				}
				if(keyToMatch === "first") {
					console.log("Showing first");
					first = parsedLinks[key];
				}
				if(keyToMatch === "last"){
					console.log("Showing last");
					last = parsedLinks[key];
				}
				console.log("parsedLink:"+parsedLinks[key]);
			}


		}
		this.setState({
			pagingOptionFirst : first,
			pagingOptionPrev : prev,
			pagingOptionNext : next,
			pagingOptionLast : last
		});
	}

	handlePagingOption(event) {
		console.log("blog pagination options++++*");
		var targetUrl ;
		console.log("pagingOptions event.target.value :"+event.target.value);
		console.log("pagingOptions event.target.name :"+event.target.name);
		this.setState({
				blogData : [],
				pagingOptionFirst : null,
				pagingOptionPrev : null,
				pagingOptionNext : null,
				pagingOptionLast : null,
				showSpinner :true
		});
		switch(event.target.name) {
			case "first":
			targetUrl = this.state.pagingOptionFirst;
			break;
			case "prev":
			targetUrl = this.state.pagingOptionPrev;
			break;
			case "next":
			targetUrl = this.state.pagingOptionNext;
			break;
			case "last":
			targetUrl = this.state.pagingOptionLast;
			break;
			default:
			break;

		}
		console.log("targetUrl in pagingOptions click :"+targetUrl);
		var searchStr = this.props.searchStr;
		var userfilter = this.props.userFilter;
		console.log("search String in next:"+searchStr);
		console.log("userfilter String in userfilter:"+userfilter);
		$.ajax({
			url : targetUrl,
			type : 'get',
			contentType: "application/json; charset=utf-8",
			data : {"searchStr":searchStr,"userFilter":userfilter},
			dataType : 'json',
			success : function(data,textStatus, jqXHR) {
				console.log("blog pagination options success callback");
				this.setState({
					showSpinner :false,
					blogData: data
				});
				this.configurePagingOptions(jqXHR.getResponseHeader("LINK"));
			}.bind(this),
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("blog pagination options error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
			}.bind(this),
			complete : function( jqXHR, textStatus ) {
				console.log("blog pagination options complete callback");
			}.bind(this)
			
		});
		
	}

	render() {
		console.log("Home Screen render++");
		var paginationStyle={
			display:"inline",
			marginLeft:"75%",
			fontWeight:"bold"
		}
		var spinStyle = {
			marginTop:"20%",
			marginLeft:"50%"
		}
		var pageStyle = {
			marginTop:"5%"
		}
		var tempObj;
		const blogDataToRender = this.state.blogData.map((item) => {
                return (<BlogDisplay key={item.blogId} blogData={item} onUserTriggerForDetailedView={this.props.onUserTriggerForDetailedView} />)
            });
		
		var pagingOptions = [];
		if(this.state.pagingOptionFirst != null){
			pagingOptions.push(<a key="first" href="#" id="first" name="first" onClick={this.handlePagingOption} > First | </a>);
		}
		if(this.state.pagingOptionPrev != null){
			pagingOptions.push(<a key="prev" href="#" id="prev"  name="prev" onClick={this.handlePagingOption}> Previous | </a>);
		}
		if(this.state.pagingOptionNext != null){
			pagingOptions.push(<a key="next" href="#" id="next"  name="next" onClick={this.handlePagingOption} > Next | </a>);
		}
		if(this.state.pagingOptionLast != null){
			pagingOptions.push(<a key="last" href="#" id="last" name="last" onClick={this.handlePagingOption}> Last  </a>);
		}
		var spinner;
		if(this.state.showSpinner === true) {

		 spinner = <div style={spinStyle} >
		 			<ReactLoading type="spin" color="#444" /> 
		 			</div>
		}
		return (
			<div style={pageStyle}>
				{spinner}
				{blogDataToRender}
				<div id = "pagingOptions" style={paginationStyle}>
					{pagingOptions}
				</div>
			</div>
		);
	}
}
export default BloggerHome;

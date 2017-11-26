/* Navigation */
var currentPage = 'default';

function tabTo(tab) {
  if(tab !== currentPage) {
	  console.log("Navigation: from " + currentPage + " to " + tab);
    $('#page-' + currentPage).addClass('hide');
    $('#page-' + tab).removeClass('hide');
	  if(currentPage === 'default') {
	    $('#page-footer').removeClass('hide');
	  }
    currentPage = tab;
    window.scrollTo(0,0);
	}
}

var AppRouter = Backbone.Router.extend({
	routes : {
		"encodings/:id" : "loadEncoding",
		"profiles/:id" : "loadProfile",
		"vendors/:id" : "loadVendor",
		"*actions" : "defaultRoute"
	}
});

var app_router = new AppRouter();

app_router.on('route:loadProfile', function(id) {
	var profile = new profile_model({
		id : id
	});
	profile.fetch({
		success : function(results) {
			showProfileDetail(results);
		},
		error : function(model, response) {
			handleFailedRequest(response);
		}
	});
});

app_router.on('route:loadEncoding', function(id) {
	var encoding = new encoding_model({
		id : id
	});
	encoding.fetch({
		success : function(results) {
			showEncodingDetail(results);
		},
		error : function(model, response) {
			handleFailedRequest(response);
		}
	});
});

app_router.on('route:loadVendor', function(id) {
	var vendor = new vendor_model({
		id : id
	});
	vendor.fetch({
		success : function(results) {
			showVendorDetail(results);
		},
		error : function(model, response) {
			handleFailedRequest(response);
		}
	});
});

app_router.on('route:defaultRoute', function(actions) {
	switch (actions) {
	case 'profiles':
		tabTo('profiles');
		doLoadProfiles();
		break;
  case 'encodings':
	 	tabTo('encodings');
	 	doLoadEncodings();
   	break;
  case 'vendors':
	 	tabTo('vendors');
	 	doLoadVendors();
   	break;
	default:
		tabTo('overview');
		break;
	}
});

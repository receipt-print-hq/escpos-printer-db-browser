/* Navigation */
var currentPage = 'default';
  
function tabTo(tab) {
  if(tab !== currentPage) {
	  console.log(currentPage + " to " + tab);
    $('#page-' + currentPage).addClass('hide');
    $('#page-' + tab).removeClass('hide');
	  if(currentPage === 'default') {
	    $('#page-footer').removeClass('hide');
	  }
    currentPage = tab;
	}
}

var AppRouter = Backbone.Router.extend({
	routes : {
		"profiles/:id" : "loadProfile",
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

app_router.on('route:defaultRoute', function(actions) {
	switch (actions) {
	case 'profiles':
		tabTo('profiles');
		doLoadProfiles();
		break;
  // case 'encodings':
	// 	tabTo('encodings');
	// 	doLoadEncodings();
  // 	break;
  // case 'vendors':
	// 	tabTo('vendors');
	// 	doLoadVendors();
  // 	break;
	default:
		tabTo('overview');
		break;
	}
});


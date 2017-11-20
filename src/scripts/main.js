(function($){
  $(function(){

    $('.button-collapse').sideNav();
    Backbone.history.start();

  }); // end of document ready
})(jQuery); // end of jQuery name space


function handleFailedRequest(response) {
	console.error("Failed request.");
}


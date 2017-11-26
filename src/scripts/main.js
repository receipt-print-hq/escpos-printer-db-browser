(function($){
  $(function(){

    $('.button-collapse').sideNav();
    Backbone.history.start();

  }); // end of document ready
})(jQuery); // end of jQuery name space


function handleFailedRequest(response) {
  tabTo('failed');
	console.error("Failed request.");
}

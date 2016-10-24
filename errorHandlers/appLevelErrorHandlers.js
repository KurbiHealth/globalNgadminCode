module.exports = function(myApp) {

	/***************************************
	 * RESTANGULAR ERROR HANDLER (API CALLS)
	 ***************************************/

	myApp.config(function(RestangularProvider) {

	    var refreshAccesstoken = function() {
	        var deferred = $q.defer();

	        // TO DO: Refresh access-token logic
			console.log('in ',__FILE,'in refreshAccesstoken()');

	        return deferred.promise;
	    };

	    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
	        if(response.status === 403) {
	            refreshAccesstoken().then(function() {
	                // Repeat the request and then call the handlers the usual way.
	                $http(response.config).then(responseHandler, deferred.reject);
	                // Be aware that no request interceptors are called this way.
	            });

	            return false; // error handled
	        }

	        return true; // error not handled
	    });
	});

	/***************************************
	 * CUSTOM ERROR MESSAGES
	 ***************************************/

	function errorHandler($rootScope, $state, $translate, notification) {

		// delete the NG-Admin default error handler
		delete $rootScope.$$listeners.$stateChangeError;

	    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {

			console.log('ERROR HANDLER, error',error);
			// console.log('event',event);
			// console.log('toState',toState);
			// console.log('toParams',toParams);
			// console.log('fromState',fromState);
			// console.log('fromParams',fromParams);

	        if(error.status == 404) {
	            $state.go('ma-404');
	            event.preventDefault();
	        } else {
	        	var errorMessage;
	        	
	        	if(error.message){
	        		errorMessage = error.message;
	        	}else if(error.data.error.message){
	        		errorMessage = error.data.error.message;
	        	}

	            $translate('STATE_CHANGE_ERROR', { 'message': errorMessage })
	            .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
	            throw error;
	        }
	    });
	}

	myApp.run(errorHandler);

	myApp.config(['$translateProvider', function ($translateProvider) {
	    $translateProvider.translations('en', {
	      'STATE_CHANGE_ERROR': 'Error: {{ message }}'
	    });
	    $translateProvider.preferredLanguage('en');
	}]);

	return myApp;

}
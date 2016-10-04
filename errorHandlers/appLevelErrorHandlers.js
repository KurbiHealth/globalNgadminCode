module.exports = function(myApp) {

console.log('instantiating error handlers');

	/***************************************
	 * RESTANGULAR ERROR HANDLER (API CALLS)
	 ***************************************/

	/*myApp.config(function(RestangularProvider) {

	    var refreshAccesstoken = function() {
	        var deferred = $q.defer();

	        // Refresh access-token logic

	        return deferred.promise;
	    };

	    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
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
	});*/

	/***************************************
	 * CUSTOM ERROR MESSAGES
	 ***************************************/

	// app.errorMessage(function (response) {
	//     return 'Global error: ' + response.status + '(' + response.data + ')';
	// });

	function errorHandler($rootScope, $state, $translate, notification) {
	    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
	console.log('error',error);
	// console.log('event',event);
	// console.log('toState',toState);
	// console.log('toParams',toParams);
	        if(error.status == 404) {
	            $state.go('ma-404');
	            event.preventDefault();
	        } else {
	            $translate('STATE_CHANGE_ERROR', { message: error.message })
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
	    //$translateProvider.preferredLanguage('en');
	}]);

	return myApp;

}
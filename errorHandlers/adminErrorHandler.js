module.exports = function(admin) {

    // Experimental Error Handler
    function appErrorHandler(response) {
	
		console.log('in globalNgadminCode/errorHandlers/adminErrorHandler.js');
        
        return 'Global ADMIN error: ' + response.status + '(' + response.data + ')';
    
    }
    
    admin.errorMessage(appErrorHandler);

    return admin;

}
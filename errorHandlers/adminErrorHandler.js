module.exports = function(admin) {

    // Experimental Error Handler
    function appErrorHandler(response,notification) {
	
		console.log('in globalNgadminCode/errorHandlers/adminErrorHandler.js, response',response);
        notification.log('error');
        return 'Global ADMIN error: ' + response.status + '(' + response.data + ')';
    
    }
    
    admin.errorMessage(appErrorHandler);

    return admin;

}
module.exports = function(admin,notification) {

    // Experimental Error Handler
    function appErrorHandler(response) {

        if(response.error){
        	var errorMessage = response.error.message;
        	var errorStatus = response.error.status
        }else if(response.data.error){
        	var errorMessage = response.data.error.message;
        	var errorStatus = response.data.error.status;
        }else{
        	var errorMessage = 'Unable to process.';
        	var errorStatus = 'Status unknown';
        }

        console.log('Error: ' + errorStatus + ', ' + errorMessage);
        notification.log('Error: ' + errorStatus + ', ' + errorMessage);

        return 'Global ADMIN error: ' + errorStatus + '(' + errorMessage + ')';
    
    }
    
    admin.errorMessage(appErrorHandler);

    return admin;

}
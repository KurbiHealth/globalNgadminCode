module.exports = function(admin) {

    // Experimental Error Handler
    function appErrorHandler(response,notification) {

    	var source = '';

        if(response.error){
        	var errorMessage = response.error.message;
        	var errorStatus = response.error.status
        }else if(response.data.error){
        	source = 'Stamplay ';
        	var errorMessage = response.data.error.message;
        	var errorStatus = response.data.error.status;
        }else{
        	var errorMessage = 'Unable to process.';
        	var errorStatus = 'Status unknown';
        }

        console.log(source + 'Error: ' + errorStatus + ', ' + errorMessage);
        notification.log('Error: ' + errorStatus + ', ' + errorMessage);

        return 'Global ADMIN error: ' + errorStatus + '(' + errorMessage + ')';
    
    }
    
    admin.errorMessage(appErrorHandler);

    return admin;

}
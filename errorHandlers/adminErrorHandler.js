module.exports = function(admin) {

    // Experimental Error Handler
    function adminErrorHandler(response,notification) {

    	var humane = require('humane-js');
    	var notification = humane.create({ timeout: 5000, clickToClose: true, addnCls: 'humane-flatty' });

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
    
    admin.errorMessage(adminErrorHandler);

    return admin;

}
module.exports = function(myApp) {

	myApp.config(function(RestangularProvider,window){
console.log('window',window);
		// http://kpadmin-jwt
	    var url = window.location.href;
console.log('url',url);
	    var token = window.localStorage.getItem(url + "-jwt");
console.log('token',token);	    
	    if(typeof token == 'object' && token == null){
	        token = '';
	    }else{
	        token = token.replace(/"/g,'');
	        token = token.toString();
	    }

	    RestangularProvider.setDefaultHeaders({
	        "Content-Type": 'application/json; charset=utf-8',
	        "x-stamplay-jwt": token
	    });

	})

}
module.exports = function(RestangularProvider) {

    var token = window.localStorage.getItem("http://kpadmin-jwt");
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

}
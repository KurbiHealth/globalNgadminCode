function chatboxConfigController($stateParams, notification, Restangular, $http, chatServerURL,$scope,$window) {
   
	// URL is the location of the chat endpoints
	var URL = chatServerURL;

    // notification is the service used to display notifications on the top of the screen
    this.notification = notification;
   
    // AVATAR (FILE PICKER)
    this.avatar = '';

    // COLOR PICKER FIELD
    // taken from https://github.com/ruhley/angular-color-picker
    $scope.options = {
	    round: true,
	    format: 'hex',
	    swatchOnly: true,
	    close: {
	        show: true,
	        label: 'Close',
	        class: 'btn',
	    }
	};
	this.color = '';

	// HEADLINE
    this.headline = '';

    // Check to see if there is a recent customization record available; if there is, load it and put values into form fields
    if($stateParams.chatBoxId){
		var currView = 'edit';
		this.chatBoxId = $stateParams.chatBoxId;
		var that = this;
		Restangular.one('chatbox',that.chatBoxId).get()
			.then(function(result){
				var cb = result.data.plain();
				that.chatBoxData = cb;
				that.latestCustomizationId = cb.customizations[cb.customizations.length - 1];
				Restangular.one('customization',that.latestCustomizationId).get()
					.then(function(result){
						result = result.data.plain();
						that.avatar = result.chat_avatar;
						that.color = result.chat_color;
						that.headline = result.chat_headline;
					});
			});
    }else{
    	var currView = 'new';
    }

    // the function is called from the template (file 'chatboxconfigtemplate.js')
	this.submitForm = function() {

		var apiKey = 'public';

		var customizationFormData = {
			avatar: this.avatar,
			color: this.color,
			headline: this.headline
		};
  
		if(currView == 'new'){
			$http
			.post(URL,customizationFormData)
			.then(function(response) {
				// Add snippet to UI
				console.log(response);
				//var targetDiv = angular.element(document.getElementById('chatSnippet'));
				//targetDiv.text("<script>"+response.data.snippet + "</script>");
				//apiKey = response.apiKey;
				return response.data;
			}, function(err) {
				console.log("There was an error saving.",err);
			})
			.then(function(response){
				var chatBoxId = response.chatBoxId;
				var snippet = response.snippet;

				// Save form elements and snippet to Stamplay
				var data = {
					'chat_avatar': customizationFormData.avatar,
					'chat_color': customizationFormData.color,
					'chat_headline': customizationFormData.headline,
					'chatbox': chatBoxId
				};
				Restangular.all('customization')
					.post(data)
					.then(function(response) {
					// save the snippet & link to Customization rcd 
					// to the ChatBox record
					var customizationId = response.data.id;

					var chatBoxData = {
						'snippet': snippet,
						'customizations': ''
					}
					Restangular
						.one('chatbox',chatBoxId)
						.get()
						.then(function(result){
							var temp = result.data.plain();
							if(!temp.customizations){
								customArr = [];
							}else{
								var customArr = temp.customizations;
							}
							customArr.push(customizationId);
							chatBoxData.customizations = customArr;
							Restangular.one('chatbox',chatBoxId)
								.customPUT(chatBoxData)
								.then(function(result){
									$window.location.href = '/#/chatbox/show/' + chatBoxId;
								})
						});
				}, function(err) {
					console.log("There was an error saving.",err);
				})
			});
		}

		if(currView == 'edit'){
			// send chatBoxId to bot API, it will update the js,html,css
			// NOTE: customizationFormData is defined above
			customizationFormData.chatBoxId = that.chatBoxId;
			$http
			.put(URL,customizationFormData)
			.then(function(result){
				var data = {
					'chat_avatar': customizationFormData.avatar,
					'chat_color': customizationFormData.color,
					'chat_headline': customizationFormData.headline,
					'chatbox': that.chatBoxId
				};
				Restangular.all('customization').post(data)
			// insert the new customization id into the chatbox record
				.then(function(result){
					result = result.data.plain();
					
					var newCustomizationId = result.id;
					
					var customizationArr = that.chatBoxData.customizations;
					customizationArr.push(newCustomizationId);
					Restangular.one('chatbox',that.chatBoxId)
					.customPUT({customizations: customizationArr})
					.then(function(result){
						$window.location.href = '/#/chatbox/show/' + that.chatBoxId;
					});
				})
			});

		} // END if(currView == 'edit')

	} // END this.submitForm()

} // END function chatboxConfigController()

export default chatboxConfigController;
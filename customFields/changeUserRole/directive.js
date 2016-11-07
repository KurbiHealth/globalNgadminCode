/*
 * This directive is meant to be used inside the Page entity views. For it to work,
 * it has to reference a 'page' Entity
 */
function changeRoleField(Restangular,$log){

	function controller($scope,$rootScope){

		var datastore = $scope.datastore;
		var entryId = $scope.entity._uniqueId;
		var currPage = $scope.currPage = datastore.getEntries(entryId)[0];
		var userObj = $scope.userObj = currPage.values.plain();
		var currRoleId = $scope.currRoleId = userObj.givenRole;
		var userId = userObj.id;

        $scope.updateRole = function(choice){
        	var temp = $scope.currChoice;
        	var roleId = choice._id;

        	// change role in user record on Stamplay
			var url = 'https://bkschool.stamplayapp.com/api/user/v1/users/' + userId + '/role';
        	var data = {
        		'givenRole': roleId
        	};
        	Restangular
        	.oneUrl('users',url) // userId defined above, outside of function
        	.patch(data)
            .then(
            	function(result){
	            	var content = result.data.plain();
	            },
	            function(error){
	            	$log.error(error);
	            }
            );
        }

	}

	return {
        restrict: 'E', // bind to attribute of element?
        controller: controller,
        link: function(scope,element,attrs){
        	scope.roles = [];
        	scope.view = attrs.view;
        	if(scope.view == 'show'){
        		Restangular.oneUrl('roles','https://bkschool.stamplayapp.com/api/user/v1/roles/')
        		.get({_id: scope.currRoleId})
        		.then(
	        		function(result){
	        			result = result.data.plain();
	        			scope.currRoleName = result[0].name;
	        		},
	        		function(error){
	        			$log.error(error);
	        		}
        		);

        	}
        	if(scope.view == 'edit'){
		        // GET LIST OF ROLES FOR DROPDOWN
		        var roleList = Restangular.allUrl('roles','https://bkschool.stamplayapp.com/api/user/v1/roles');
		        roleList.getList()
		        .then(
			        function(result){
			        	if(scope.currPage._identifierValue){
							// IN 'EDITION' VIEW
							result = result.data.plain();
							scope.roles = result;
							if(typeof result !== 'object')
								result = JSON.parse(result);
							scope.currRoleName = '';
							result.map(function(e){
								if(e._id == scope.currRoleId)
									scope.currRoleName = e.name;
							});
							scope.currChoice = {
								name: scope.currRoleName,
								_id: scope.currRoleId
							};
				        } // END if(viewType == 'edition')
			        },
			        function(error){
			        	$log.error(error);
			        }
		        );
	    	}
        },
        template: `
        <p ng-if="view=='show'" style="text-transform: capitalize;">{{currRoleName}}</p>
        <div ng-if="view=='edit'">
	        <select ng-model="currChoice" 
	            ng-options="role.name for role in roles track by role._id"
	            name="dropdown" 
	            class="form-control" 
	            ng-change="updateRole(this.currChoice)">
	        </select>
	    </div>`
    }

}

changeRoleField.$inject = ['Restangular'];

export default changeRoleField;
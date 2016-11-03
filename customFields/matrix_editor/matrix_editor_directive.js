function directiveController($scope){

    $scope.isString = false; // used in link and in template

    if(!$scope.viewtype){
        $scope.viewtype = 'show';
    }
    
    $scope.value = $scope.value(); // .prepare will add the matrix field values
    $scope.field = $scope.field();
    $scope.datastore = $scope.datastore();
	$scope.form = $scope.form();
    $scope.entity = $scope.entity();

    $scope.address = $scope.entity.uniqueId;
    $scope.entry = $scope.datastore.getEntries($scope.address)[0];

    if($scope.field._valueType == 'string'){
        // derive headers from the data object itself?? (use keys?)
        $scope.isString = true;
    }

    /*****************************
     ****    MATRIX OBJECT    ****
     *****************************/

	var matrix = $scope.matrix = {};

    if($scope.field._debug){
        matrix.debugThis = JSON.parse($scope.field._debug);
    }
	matrix.headers = [];
	matrix.numFields = 0;
	matrix.emptyDataObj = {};
	matrix.data = [];
	matrix.numBootstrapCols = 0;
	matrix.dropdowns = {};
	matrix.selectedDropdown = {};

    /*****************************
     * INIT
     *****************************/
	
	matrix.init = function(headers,dropdowns){
debugger;
        if($scope.field._valueType == 'object'){
    		headers.map(function(h){
    			matrix.headers.push(h.label);
    			matrix.numFields++;
    			matrix.emptyDataObj[h.key] = '';
    		});
        }else{
            matrix.headers.push('String');
            matrix.numFields++;
            matrix.emptyDataObj = [];
            matrix.emptyDataObj.push(' ');
        }
		if($scope.value === null){
			matrix.data.push(angular.copy(matrix.emptyDataObj));
		}else{

            if(typeof $scope.value == 'string'){
                try{
                    var tempValue = JSON.parse($scope.value);
                    $scope.value = tempValue;
                }catch(error){
                    console.log('error',error);
                }
            }

            // if the value is an object, it should be an array of objects; check to see if the first
            // element is a valid object, if it isn't, check to see whether 1+2 is a valid object, and so on       
            if($scope.field._valueType == 'object'){
                if($scope.value[0].search(/\{.*:/) > -1){
                    try{
                        JSON.parse($scope.value[0]);
                    }catch(error){
                        var tempArr = [];
                        for (var i = 0; i < $scope.value.length; i=i+2) {
                            tempArr.push(JSON.parse($scope.value[i] + ',' + $scope.value[i+1]));
                        }
                        $scope.value = tempArr;
                    }
                }else{
                    // make string into a sub array to make the template below work
                    var tempValue = angular.copy($scope.value);
                    tempValue.every(function(value,key){
                        var temp = [];
                        temp.push(value);
                        $scope.value[key] = temp;
                        return true;
                    });
                }
            }

            matrix.data = $scope.value;

            if($scope.field._valueType == 'object'){
                for(var j in matrix.data){
                    matrix.selectedDropdown[j] = { 
                        type: {
                            value: matrix.data[j]['type']
                        }
                    };
                }
            }
		}
		
        if($scope.viewtype=='edit'){
            matrix.numBootstrapCols = Math.floor(11/(matrix.numFields));
        }else{
            matrix.numBootstrapCols = Math.floor(12/matrix.numFields);
        }
		if(matrix.numBootstrapCols < 4) matrix.numBootstrapCols = 4;
		
        matrix.dropdowns = dropdowns;
	}

    /*****************************
     * METHODS
     *****************************/
    
    matrix.addRow = function() {
    	var obj = matrix.emptyDataObj;
        matrix.data.push(angular.copy(obj));
        return false;
    }

    matrix.updateDropdownValue = function(rkey,fkey){
    	matrix.data[rkey][fkey] = matrix.selectedDropdown[rkey][fkey]['value'];
    }

    /*****************************
     * WATCHER
     *****************************/

    function saveValueInDatastore(newVal,oldVal){

        var temp = matrix.data;

        if($scope.isString != true){
            temp = temp.map(function(v){
                if($scope.isString == true){
                    v = v[0];
                }
                return JSON.stringify(v);
            });
            temp = temp.join();
        }

        $scope.entry.values[$scope.field._name] = temp;
        $scope.datastore.setEntries($scope.address,$scope.entry);
    }

    $scope.$watch('matrix.data',saveValueInDatastore,true);

    matrix.deleteRow = function(rkey){
        matrix.data.splice(rkey,1);
    }

}

function MatrixEditorDirective($compile){

	return {
		scope: {
			'field': '&',
            'value': '&',
            'datastore': '&',
            'matrix': '&',
            'form': '&',
            'entity': '&',
            'viewtype': '@'
		},
		restrict: 'E',
		controller: directiveController,
		controllerAs: 'controller',
		link: {
			pre: function(scope,element,attributes){
				const config = scope.field; // configuration values from the ES6 class

				// STRING TYPE
				// scope.isString is set to 'false' in the controller
				if(config._valueType == 'string'){
					scope.isString = true;
				}

				// OBJECT TYPE (object is stringified)
				if(config._valueType == 'object'){
					if(config._objectDefinition.length == 0){
						return false;
					}
				}

                scope.matrix.init(config._objectDefinition,config._dropdownChoices);
				
                // PARSE STRING INTO OBJ IF NEEDED
                if(config._jsonParse == true){
                    scope.value = scope.value.map(function(e){
                        return JSON.parse(e);
                    });
                }
debugger;
            	// --- Modify CSS ---
                // ?? override field.getCssClasses(entry) ??
                // field._fieldValueStyles == [{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]
                // Ex. [{fieldName:source, value:patient, cssClass:chat-message-source-patient}]')
                /*var styles = JSON.parse(field._fieldValueStyles);
                entries = entries.map(function(e){
                    for(var i in styles){
                        if(styles[i].fieldName in e.values){
                            if(styles[i].value == e.values[styles[i].fieldName]){
// FIX THIS SO IT GOES THROUGH TO maDatagrid DIRECTIVE (see ????????? below)
                                e._entryCssClasses = e._entryCssClasses ? e._entryCssClasses+' '+styles[i].cssClass : styles[i].cssClass;
                                e.values._entryCssClasses = styles[i].cssClass;
                                scope.entryCssClasses = scope.entryCssClasses ? scope.entryCssClasses+' '+styles[i].cssClass : styles[i].cssClass;
                            }
                        }
                    }
                    return e;
                });*/

                var template = `
                <style>
                /* ng-admin's validation system uses a padding-right here to allow for a 
                validation icon on the right side of the input */
                .has-feedback .form-control {
                    padding-right: 0;
                }
                .debug{
                    display:block;color:black; width:100%;border:1px solid gray;
                    border-radius:3px;margin-top:15px;padding:10px;white-space: pre-wrap;
                    white-space: -moz-pre-wrap !important;white-space: -pre-wrap;
                    white-space: -o-pre-wrap;word-wrap: break-word;
                }
                </style>
                <div id="matrix-input-table">
                    <div ng-model="matrix.data">
                        <div class="row">
                           <div class="col-md-{{matrix.numBootstrapCols}}" ng-repeat="header in matrix.headers" style="margin-bottom:5px;font-weight:700;">
                                {{header}}
                            </div>
                        </div>
                        <div class="row" ng-repeat="(rkey,rvalue) in matrix.data track by $index" style="margin-bottom:5px !important;">
                            <div style="overflow:auto;">
                                <div ng-if="viewtype=='show'">
                                    <div ng-if="isString" class="col-md-{{matrix.numBootstrapCols}}">
                                        <span style="text-transform:capitalize;" class="form-control">{{rvalue}}</>
                                    </div>
                                    <div ng-if="!isString" class="col-md-{{matrix.numBootstrapCols}}" ng-repeat="(fkey, fvalue) in matrix.data[rkey]" ng-class="matrix.setLast($last)">
                                        <input type="text" ng-if="!matrix.dropdowns[fkey]" class="form-control" ng-model="matrix.data[rkey][fkey]" />
                                        <select ng-if="matrix.dropdowns[fkey]" 
                                            ng-model="matrix.selectedDropdown[rkey][fkey]" 
                                            ng-options="option.label for option in matrix.dropdowns[fkey] track by option.value"
                                            name="dropdown_{{rkey+fkey}}" 
                                            class="form-control" 
                                            ng-change="matrix.updateDropdownValue(rkey,fkey)">
                                        </select>
                                    </div>
                                </div>
                                <div ng-if="viewtype=='edit'">
                                    <div ng-if="isString" class="col-md-{{matrix.numBootstrapCols}}">
                                        <input 
                                            type="text" class="form-control" 
                                            ng-model="matrix.data[rkey]" 
                                            ng-change="saveValueInDatastore();" 
                                            ng-model-options="{ updateOn: 'blur mouseleave', debounce: {'blur': 0, 'mouseleave': 500} }"
                                        >
                                    </div>
                                    <div ng-if="!isString" class="col-md-{{matrix.numBootstrapCols}}" ng-repeat="(fkey, fvalue) in matrix.data[rkey]" ng-class="matrix.setLast($last)">
                                        <input type="text" ng-if="!matrix.dropdowns[fkey]" class="form-control" ng-model="matrix.data[rkey][fkey]"  />
                                        <select ng-if="matrix.dropdowns[fkey]" 
                                            ng-model="matrix.selectedDropdown[rkey][fkey]" 
                                            ng-options="option.label for option in matrix.dropdowns[fkey] track by option.value"
                                            name="dropdown_{{rkey+fkey}}" 
                                            class="form-control" 
                                            ng-change="matrix.updateDropdownValue(rkey,fkey)">
                                        </select>
                                    </div>
                                    <div class="col-md-1" style="padding:0;">
                                        <i ng-click="matrix.deleteRow(rkey)" class="fa fa-trash-o" style="padding-top:5px;font-size:20px;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" ng-if="viewtype=='edit'">
                            <div class="col-md-12">
                                <div ng-click="matrix.addRow()" class="btn btn-primary">Add Row</div>
                            </div>
                        </div>
                    </div><!-- end ui-tree-nodes -->
                </div>
                <br/>
                <p ng-show="matrix.debugThis">matrix data object</p>
                <pre ng-show="matrix.debugThis" class="debug">{{matrix.data | json}}</pre>
                <p ng-show="matrix.debugThis">matrix selected dropdown</p>
                <pre ng-show="matrix.debugThis" class="debug">{{matrix.selectedDropdown | json}}</pre>
                <p ng-show="matrix.debugThis">ng-admin datastore</p>
                <pre ng-show="matrix.debugThis" class="debug">{{datastore | json}}</pre>
                <p ng-show="matrix.debugThis">ng-admin form</p>
                <pre ng-show="matrix.debugThis" class="debug">{{form | json}}</pre>
                <p ng-show="matrix.debugThis">ng-admin values</p>
                <pre ng-show="matrix.debugThis" class="debug">{{value | json}}</pre>
                `;
				element.append(template);
            	$compile(element.contents())(scope);

			},
			post: function(scope,element,attributes){
				// IF THE TEMPLATE NEEDS PROCESSING POST-COMPILE, 
				// ADD THE CODE HERE
			}
		}
	}

}

export default MatrixEditorDirective;

MatrixEditorDirective.$inject = ['$compile'];
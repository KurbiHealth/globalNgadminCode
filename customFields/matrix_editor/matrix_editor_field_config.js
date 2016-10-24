import EmbeddedListField from 'admin-config/lib/Field/EmbeddedListField';

class MatrixEditorField extends EmbeddedListField {

    constructor(name) {
        super(name);
        this._jsonParse = false;
        this._type = "matrix_editor";
        this._fieldValueStyles = null;
        this._debug = false;
        this._valueType = '';
        this._objectDefinition = [];
        this._dropdownChoices = {};
    }

    // attempt to convert all strings to objects, true or false
    jsonParse(trueFalse) {
        if (!arguments.length) return this._jsonParse;
        this._jsonParse = trueFalse;
        return this;
    }

    // add css attribs based on an object key/value
    // .fieldValueStyles('[{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]')
    fieldValueStyles(objStringified){
        if (!arguments.length) return this._fieldValueStyles;
        this._fieldValueStyles = objStringified;
        return this;
    }

    // options are 'object' or 'string'
    valueType(type){
        if(!arguments.length) return this._valueType;
        this._valueType = type;
        return this;
    }
    
    // Stamplay has an array of strings avail as a field, so it can be used
    // to save an array of stringified objects (if entryType above == 'object')
    objectDefinition(arrayOfKeys){
        if(!arguments.length) return this._objectDefinition;
        this._objectDefinition = arrayOfKeys;
        return this;
    }
    
    // if true, then in creation or edition mode, show the stringified object
    // that will be saved by form
    debug(debug){
        if(!arguments.length) return this._debug;
        this._debug = debug;
        return this;
    }

    // if a field is type "dropdown"
    // must accomodate multiple fields of type "dropdown"
    dropdownChoices(key,array){
        if(!arguments.length) return this._dropdownChoices;
        this._dropdownChoices[key] = array;
        return this;
    }

}

export default MatrixEditorField;
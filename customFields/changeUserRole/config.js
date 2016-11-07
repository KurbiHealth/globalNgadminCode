import FileField from 'admin-config/lib/Field/FileField';

class ChangeRoleField extends FileField {
    constructor(name) {
        super(name);
        this._type = "change_role_dropdown";
    }

}

export default ChangeRoleField;
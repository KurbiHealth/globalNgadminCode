import FileField from 'admin-config/lib/Field/FileField';

class StamplayFileField extends FileField {
    constructor(name) {
        super(name);
        this._type = "stamplay_file_upload";
        this._uploadInformation = {
            url: '/upload',
            accept: '*'
        };
    }

    uploadInformation(information) {
        if (!arguments.length) return this._uploadInformation;
        this._uploadInformation = information;
        return this;
    }
}

export default StamplayFileField;

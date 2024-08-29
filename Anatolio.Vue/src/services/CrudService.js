import axios from 'axios';
import { useRouter } from 'vue-router';

export default class CrudService {
    _apiPath = '';

    constructor(path, settings) {
        this.router = useRouter();
        this._apiPath = `/api/${path}`;
        this._createPath = settings.createPath ?? `/api/${path}`;

        this.error = settings.error;
        this.errors = settings.errors;
        this.data = settings.data;
        this.loading = settings.loading;
        this.dialog = settings.dialog ?? false;
    }

    get(id, fnc) {
        if (id === null || id === undefined || id === '') {
            return;
        }
        axios.get(this.getUrl(id), { loading: this.loading, errors: this.errors, error: this.error }).then((response) => {
            this.data.value = response;
            if (fnc) {
                fnc(response);
            }
        });
    }
    delete(id, fnc) {
        if (id === null || id === undefined || id === '') {
            return;
        }
        var message = 'Are you sure you want to delete?';
        var isOk = confirm(message);
        if (!isOk) {
            return;
        }

        axios.delete(this.getUrl(id), { loading: this.loading, errors: this.errors, error: this.error }).then((response) => {
            if (fnc) {
                fnc(response);
            }
        });
    }
    archive(id, fnc) {
        if (id === null || id === undefined || id === '') {
            return;
        }
        var message = 'Are you sure you want to add to archive?';
        var isOk = confirm(message);
        if (!isOk) {
            return;
        }
        axios.delete(this.getUrl(id), { loading: this.loading, errors: this.errors, error: this.error }).then((response) => {
            if (fnc) {
                fnc(response);
            }
        });
    }

    save(fnc) {
        if (!this.data.value.Id) {
            axios.post(this._createPath, this.data.value, { loading: this.loading, errors: this.errors, error: this.error }).then((res) => {
                //if (!this.dialog) {
                //    this.router.replace(`${this.route.path}${res.Id}`);
                //}
                if (fnc) {
                    fnc(res ?? this.data.value);
                }
            });
            return;
        }
        axios.put(this.getUrl(this.data.value.Id), this.data.value, { loading: this.loading, errors: this.errors, error: this.error }).then((res) => {
            if (fnc) {
                fnc(res ?? this.data.value);
            }
        });
    }
    getUrl(id) {
        var url = this._apiPath + '/' + id;
        if (!id || id == 0) {
            url = this._apiPath;
        }
        return url;
    }
}

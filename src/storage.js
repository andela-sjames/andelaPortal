function Storage() {
    this.store = window.localStorage;
}

Storage.prototype.get = function(key) {
    try {
        return JSON.parse(this.store.getItem(key));
    } catch (e) {
        return null;
    }
};

Storage.prototype.set = function(key, value) {
    return this.store.setItem(key, JSON.stringify(value));
};

Storage.prototype.exist = function(key) {
    if (this.get(key)) {
        return true;
    }

    return false;
};

Storage.prototype.clear = function(key) {
    return this.store.clear();
};

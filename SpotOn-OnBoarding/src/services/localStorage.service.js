/**
 * LocalStorage service
 * This class handles basic storage functionality like
 * saving data to localstorage, retriving and removing
 */

class LocalStorage {
    setUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    clearAll() {
        localStorage.removeItem("user");
        return true;
    }
}

export default new LocalStorage();

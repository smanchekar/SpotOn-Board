import { constants } from './constants';

class Util {
    /**
     * Check if two object are equal
     */
    shallowEqual(object1: any, object2: any) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (object1[key] !== object2[key]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if object is empty or not
     */
    isEmpty(object: any) {
        return Object.keys(object).length === 0;
    }

    /**
     * Get routes by roleid
     */
    getRoutes(roleid: number) {
        const { ADMIN, USER } = constants.USER_ROLE;
        switch (roleid) {
            case ADMIN:
                return constants.ADMIN_ROUTES;
            case USER:
                return constants.USER_ROUTES;
            default:
                return [];
        }
    }

    mergeDateTime(dateString: string) {
        var date = new Date(dateString);
        return Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        );
    }
}

export default new Util();

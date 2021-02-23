
class EventService {

    constructor() {
        this.listeners = new Map();
        this.event = {
            LOADING_START: "LOADING STARTED",
            LOADING_STOP: "LOADING STOPPED",
        };
    }

    registerEvent(eventName, callback) {
        console.log("CALLBACK", callback);
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    unregisterEvent(eventName, signature) {
        if (this.listeners.has(eventName)) {
            let registeredEvents = this.listeners.get(eventName);
            for (let i = 0; i < registeredEvents.length; i++) {
                if (registeredEvents[i] == signature) {
                    registeredEvents.splice(i, 1);
                    this.listeners.set(eventName, registeredEvents);
                }
            }
        }
    }

    fireEvent(eventName, data) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach(callback => {
                callback(data);
            });
        }
    }

    fireEventDelay(eventName, data, delay) {
        if (this.listeners.has(eventName)) {
            let events = this.listeners.get(eventName);
            let i = 0
            let t = setInterval(() => {
                events[i](data);
                i++;
                if (i == events.length) {
                    clearInterval(t);
                }
            }, delay);
        }
    }

    unregisterAllEvent(eventName) {
        if (this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
    }
}

export default new EventService();
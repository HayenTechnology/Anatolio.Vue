import mqtt from "mqtt";

class AnatolioMqtt {
    constructor(connectionOptions) {
        this.connection = connectionOptions || {
            endpoint: null,
            clean: false,
            connectTimeout: 4000,
            reconnectPeriod: 4000,
            clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
        };
        this.listeners = {};
        this.subscribed = {};
        this.client = null;
        this.createConnection();
    }

    on(channel, func) {
        this.listeners[channel] = func;
        if (this.client && this.client.connected) {
            this.client.subscribe(channel, {}, (error, res) => {
                if (error) {
                    console.log("Subscribe to topics error", error);
                    return;
                }
                this.subscribed[channel] = true;
                console.log("Subscribe to topics res", res);
            });
        }
    }

    emit(channel, data) {
        let jsonData = "";
        try {
            jsonData = typeof data === "string" ? data : JSON.stringify(data);
        } catch (error) {
            console.log("Data serialization error", error);
            jsonData = data;
        }
        if (this.client && this.client.connected) {
            this.client.publish(channel, jsonData);
        } else {
            console.log("Client is not connected");
        }
    }

    createConnection() {
        const { endpoint, ...options } = this.connection;

        const connectUrl = endpoint ?? `wss://${window.location.hostname}:7191/mqtt`;
        const connectUrlHttp = endpoint ?? `ws://${window.location.hostname}:7190/mqtt`;

        try {
            this.client = mqtt.connect(connectUrl, options);
        } catch (error) {
            console.log("Primary connection error, attempting fallback", error);
            try {
                this.client = mqtt.connect(connectUrlHttp, options);
            } catch (error) {
                console.log("Fallback connection error", error);
                return;
            }
        }

        this.client.on("connect", () => {
            console.log("Connection succeeded!");

            for (let prp in this.listeners) {
                if (!this.subscribed[prp]) {
                    this.client.subscribe(prp, (err) => {
                        if (err) {
                            console.log("subscribe failed", err);
                        } else {
                            this.subscribed[prp] = true;
                        }
                    });
                }
            }
        });

        this.client.on("error", (error) => {
            console.log("Connection failed", error);
        });

        this.client.on("message", (topic, message) => {
            console.log(`Received message ${message} from topic ${topic}`);
            try {
                const msgJson = JSON.parse(message.toString());
                if (this.listeners[topic]) {
                    this.listeners[topic](msgJson);
                }
            } catch (error) {
                if (this.listeners[topic]) {
                    this.listeners[topic](message.toString());
                }
            }
        });
    }
}

let mqttClient;

export const createMqttClient = (connectionOptions) => {
    if (!mqttClient) {
        mqttClient = new AnatolioMqtt(connectionOptions);
    }
    return mqttClient;
};

export default {
    install: (app, options) => {
        const client = createMqttClient(options);
        app.config.globalProperties.$mqtt = client;
    },
};

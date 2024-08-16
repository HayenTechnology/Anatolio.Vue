import mqtt from 'mqtt';

export default class Gbot {
    listeners = {};
    subscribed = {};
    on(channel, func) {
        this.listeners[channel] = func;

        try {
            this.client.subscribe(channel, {}, (error, res) => {
                if (error) {
                    console.log('Subscribe to topics error', error);
                    return;
                }
                this.subscribed[channel] = true;
                console.log('Subscribe to topics res', res);
            });
        } catch (ex) {
            //console.log(ex)
        }
    }
    emit(channel, data) {
        var jsonData = '';
        try {
            if (typeof data == 'string') {
                jsonData = data;
            } else {
                jsonData = JSON.stringify(data);
            }
        } catch {
            jsonData = data;
        }
        this.client.publish(channel, jsonData);
    }

    connection = {
        endpoint: '/mqtt',
        clean: false, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
        // Certification Information
        clientId: 'mqttjs_3be2c321' + Math.random().toString(16).substr(2, 8)
        //username: 'emqx_test',
        //password: 'emqx_test',
    };

    receiveNews = '';

    client = {
        connected: false
    };

    createConnection() {
        // Connect string, and specify the connection method used through protocol
        // ws unencrypted WebSocket connection
        // wss encrypted WebSocket connection
        // mqtt unencrypted TCP connection
        // mqtts encrypted TCP connection
        // wxs WeChat mini app connection
        // alis Alipay mini app connection
        const { endpoint, ...options } = this.connection;

        const connectUrl = `wss://${window.location.hostname}:7191${endpoint}`;
        const connectUrlHttp = `ws://${window.location.hostname}:7190${endpoint}`;

        try {
            this.client = mqtt.connect(connectUrl, options);
        } catch (error) {
            try {
                this.client = mqtt.connect(connectUrlHttp, options);
            } catch (error) {
                console.log('mqtt.connect error', error);
            }
        }
        this.client.on('connect', () => {
            console.log('Connection succeeded!');

            for (var prp in this.listeners) {
                try {
                    if (!this.subscribed[prp]) {
                        this.client.subscribe(prp, (err) => {
                            console.log('subscribe failed', err);
                        });
                    }
                } catch (err) {
                    console.log('subscribe failed', err);
                }
            }
        });
        this.client.on('error', (error) => {
            console.log('Connection failed', error);
        });
        this.client.on('message', (topic, message) => {
            // this.receiveNews = this.receiveNews.concat(message)
            console.log(`Received message ${message} from topic ${topic}`);

            try {
                var msgJson = JSON.parse(message.toString());

                if (this.listeners[topic]) {
                    try {
                        this.listeners[topic](msgJson);
                    } catch (err) {
                        console.log('listeners failed', err);
                    }
                }
            } catch {
                if (this.listeners[topic]) this.listeners[topic](message.toString());
            }

            // message is Buffer
            console.log(topic);
            console.log(message.toString());
        });
    }
}

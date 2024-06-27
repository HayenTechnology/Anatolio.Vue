---
sidebar_position: 1
title: Anatolio MQTT
---

# Anatolio MQTT Client Integration

Bu döküman, Anatolio MQTT client'ýnýn Vue 3 ve Composition API kullanarak nasýl entegre edileceðini anlatmaktadýr.

## Kurulum

Öncelikle, `@hayentechnology/anatolio-mqtt` paketini npm ile kurun:

```sh
npm install @hayentechnology/anatolio-mqtt
```


## 1. AnatolioMqtt Sýnýfý

AnatolioMqtt sýnýfý, MQTT baðlantýsý kurmak ve mesaj göndermek/almak için kullanýlýr.



### 2. main.js Dosyasýný Düzenleme

Vue projenizin main.js dosyasýný aþaðýdaki gibi düzenleyin:

```javascipt
import { createApp } from 'vue';
import App from './App.vue';
import { AnatolioMqtt } from '@hayentechnology/anatolio-mqtt';

const connectionOptions = {
  endpoint: 'wss://localhost:7191/mqtt',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  // username: 'your-username',
  // password: 'your-password'
};

const app = createApp(App);

app.use(AnatolioMqtt, connectionOptions);

app.mount('#app');
```


### 3. Vue Bileþenlerinde MQTT Kullanýmý

```javascipt
<template>
  <div>
    <h1>MQTT Example</h1>
  </div>
</template>

<script>
import { inject, onMounted } from 'vue';

export default {
  name: 'ExampleComponent',
  setup() {
    const mqttClient = inject('$mqtt');

    onMounted(() => {
      mqttClient.on('myChannel', (data) => {
        console.log('Received data:', data);
      });

      mqttClient.emit('myChannel', { message: 'Hello, MQTT!' });
    });
  }
};
</script>

<style scoped>
/* Stil dosyalarý buraya gelecek */
</style>


```



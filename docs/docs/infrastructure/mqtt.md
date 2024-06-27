---
sidebar_position: 1
title: Anatolio MQTT
---

# Anatolio MQTT Client Integration

Bu d�k�man, Anatolio MQTT client'�n�n Vue 3 ve Composition API kullanarak nas�l entegre edilece�ini anlatmaktad�r.

## Kurulum

�ncelikle, `@hayentechnology/anatolio-mqtt` paketini npm ile kurun:

```sh
npm install @hayentechnology/anatolio-mqtt
```


## 1. AnatolioMqtt S�n�f�

AnatolioMqtt s�n�f�, MQTT ba�lant�s� kurmak ve mesaj g�ndermek/almak i�in kullan�l�r.



### 2. main.js Dosyas�n� D�zenleme

Vue projenizin main.js dosyas�n� a�a��daki gibi d�zenleyin:

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


### 3. Vue Bile�enlerinde MQTT Kullan�m�

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
/* Stil dosyalar� buraya gelecek */
</style>


```



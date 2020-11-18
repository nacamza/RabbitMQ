# RabbitMQ
Primero iniciamos la rqabbit mediante el siguiente comando
````
docker-compose up -d
````
[Documentación](https://www.cloudamqp.com/blog/2015-05-18-part1-rabbitmq-for-beginners-what-is-rabbitmq.html)
[Video explicativo](https://www.youtube.com/watch?v=8083HvKEwZY&t=761s)
### Primer ejemplo 
Enviar mensajes directo a las colas:
- Publisher: queues.js
- Subscriber: queues.js
### Ejemplos con exchange
Tipos de Exchanges:
- Direct: el mensaje se enruta a las colas cuya clave de enlace coincide exactamente con la clave de enrutamiento del mensaje. 
- Fanout: un intercambio de fanout enruta los mensajes a todas las colas vinculadas a él.
- Topic: Topic realiza una coincidencia de comodines entre la clave de enrutamiento y el patrón de enrutamiento especificado en el enlace.
- Headers: Headers utiliza los atributos del encabezado del mensaje para el enrutamiento.

![](https://www.cloudamqp.com/img/blog/exchanges-topic-fanout-direct.png)


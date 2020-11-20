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

## [Comfiguracion avanzada](https://www.rabbitmq.com/queues.html#optional-arguments)
### [Message TTL](https://www.rabbitmq.com/ttl.html#per-queue-message-ttl)
Cuánto tiempo puede vivir un mensaje publicado en una cola antes de que se descarte (milisegundos). (Establece el argumento "x-message-ttl")
````
rabbitmqctl set_policy TTL ".*" '{"message-ttl":60000}' --apply-to queues
````
### [Auto expire](https://www.rabbitmq.com/ttl.html#queue-ttl)
TTL también se puede configurar en colas, no solo en el contenido de la cola. Las colas expirarán después de un período de tiempo solo cuando no se utilicen (por ejemplo, no tengan consumidores). 

**X-expires** determina cuánto tiempo se puede dejar de utilizar una cola antes de que se elimine automáticamente (milisegundos).
````
rabbitmqctl set_policy expiry ".*" '{"expires":1800000}' --apply-to queues
````
### [Max length](https://www.rabbitmq.com/maxlength.html)
La longitud máxima de una cola se puede limitar a un número determinado de mensajes, o un número determinado de bytes, o ambos.
````
rabbitmqctl set_policy my-pol "^one-meg$" \
  '{"max-length-bytes":1048576}' \
  --apply-to queues
````
La política my-pol garantiza que la cola de un meg no contenga más de 1 MB de datos de mensajes. Cuando se alcanza el límite de 1MiB, los mensajes más antiguos se descartan del encabezado de la cola.
````	
rabbitmqctl set_policy my-pol "^two-messages$" \
  '{"max-length":2,"overflow":"reject-publish"}' \
  --apply-to queues
````  
La política my-pol garantiza que la cola two-messages no contenga más de 2 mensajes y que todas las publicaciones adicionales se envíen como respuestas basic.nack siempre que la cola contenga 2 mensajes y las confirmaciones del editor estén habilitadas.



# RabbitMQ
Vamos a instalar RabbitMQ con docker-compose mediante el siguiente comando
````
docker-compose up -d
````
[Documentación](https://www.cloudamqp.com/blog/2015-05-18-part1-rabbitmq-for-beginners-what-is-rabbitmq.html)

[Video explicativo de funcionamiento](https://www.youtube.com/watch?v=8083HvKEwZY&t=761s)

# Proyecto 
El el proyecto hay dos carpetas en donde:
- Publisher: Se uncuentra el codigo que genera mensajer
- Subscriber: Se encuentra el codigo que consume mensaje
## Ejemplos
Dentro de las carpetas Publisher y Subscriber vamos a encontrar cuatro archivos que implementan los siguientes ejemplos
- queues.js: Implementa un ejemplo sin configurar el exchange (por defecto utiliza el directo)
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
### [Max length/Max length bytes](https://www.rabbitmq.com/maxlength.html)
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

### [Overflow behaviour](https://www.rabbitmq.com/maxlength.html#overflow-behaviour)
Establece el comportamiento de desbordamiento de la cola. Esto determina qué sucede con los mensajes cuando se alcanza la longitud máxima de una cola.Si el overflow se establece en reject-publish, se descartarán los mensajes publicados más recientemente. Además, si las confirmaciones del editor están habilitadas, el publisher será informado del rechazo a través de un mensaje basic.nack. Si un mensaje se enruta a varias colas y es rechazado por al menos una de ellas, el canal informará al publisher a través de basic.nack. El mensaje aún se publicará en todas las demás colas que pueden ponerlo en cola.

### [Dead letter exchange](https://www.rabbitmq.com/dlx.html)
Nombre opcional de un exchange al que se volverán a publicar los mensajes si se rechazan o caducan. (Establece el argumento "x-dead-letter-exchange").
````
rabbitmqctl set_policy DLX ".*" '{"dead-letter-exchange":"my-dlx"}' --apply-to queues
````
### [Dead letter routing key]()
Clave routing key opcional para usar cuando un mensaje tiene dead-lettered. Si no se configura, se utilizará la routing key original del mensaje.
````
channel.exchangeDeclare("some.exchange.name", "direct");

Map<String, Object> args = new HashMap<String, Object>();
args.put("x-dead-letter-exchange", "some.exchange.name");
channel.queueDeclare("myqueue", false, false, false, args);
````
### [Maximum priority](https://www.rabbitmq.com/priority.html)
Número máximo de niveles de prioridad que admite la cola; si no se establece, la cola no admitirá las prioridades de los mensajes.
````
Channel ch = ...;
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-max-priority", 10);
ch.queueDeclare("my-priority-queue", true, false, false, args);
````
### [Lazy mode](https://www.rabbitmq.com/lazy-queues.html)
Configure la cola en lazy mode, manteniendo tantos mensajes como sea posible en el disco para reducir el uso de RAM; si no se configura, la cola mantendrá un caché en memoria para entregar mensajes lo más rápido posible.
````
rabbitmqctl set_policy Lazy "^lazy-queue$" '{"queue-mode":"lazy"}' --apply-to queues
````
### [Master locator](https://www.rabbitmq.com/ha.html)
Establezca la cola en el modo master location, determinando la regla por la cual se ubica la cola en el nodo master.

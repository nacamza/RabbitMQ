
// Nombramos el exchange
const exchangeName = 'logs'
// Definimos el comportamiento del Exchange (fanout = broadcasts)
const exchangeType = 'fanout'
// Es la ruta del mensaje 
const bindingkey = ''


var amqp = require('amqplib/callback_api');

// Me conecto con la Rabbit
amqp.connect('amqp://192.168.44.37', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    // Creo un canal
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        // Indico a que Exchange se va a conectar la cola
        channel.assertExchange(exchangeName, exchangeType, {
            durable: false
        });       
        
        // Creo una cola
        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        
            //Conecto la cola con el Exchange
            channel.bindQueue(q.queue, exchangeName, bindingkey);

            //Leo los datos
            channel.consume(q.queue, function(msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                // Nos aseguramos que el mensaje sea recibido con un ACK 
                noAck: true
            });
        });
    });
});
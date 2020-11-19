// Nombramos el exchange
const exchangeName = 'direct_logs'
// Definimos el comportamiento del Exchange (fanout = broadcasts)
const exchangeType = 'direct'
// Es la ruta del mensaje 
const routingkey = ''

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

        var args = process.argv.slice(2);

        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        // severity es la routingkey ??????
        var severity = (args.length > 0) ? args[0] : 'info';

        // Indico a que Exchange me voy a conectar (si no existe, lo crea)
        channel.assertExchange(exchangeName, exchangeType, {
            durable: false
        });
        // Envío mensaje
        channel.publish(exchangeName, severity, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});

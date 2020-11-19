var amqp = require('amqplib/callback_api');

amqp.connect('amqp://192.168.44.37', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        channel.assertQueue(queue, {
            // Nos asegurarnos de que la cola sobreviva al reinicio del nodo RabbitMQ
            // Este parámetro no se pude cambiar una vez creada la cola 
            durable: true
        });
    
        channel.sendToQueue(queue, Buffer.from(msg), {
            //Ahora debemos marcar nuestros mensajes como persistentes
            persistent: true
        });

        console.log(" [x] Sent %s", msg);
        console.log(" Queue %s", queue);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
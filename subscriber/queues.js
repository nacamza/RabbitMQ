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

        channel.assertQueue(queue, {
            // Nos asegurarnos de que la cola sobreviva al reinicio del nodo RabbitMQ
            // Este parámetro no se pude cambiar una vez creada la cola 
            durable: true
        });

        //Esto le dice a RabbitMQ que no dé más de un mensaje a un trabajador a la vez. 
        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;
          
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
              console.log(" [x] Done");
              channel.ack(msg);
            }, secs * 1000);
        }, {

            // Nos aseguramos que el mensaje sea recibido 
            noAck: false
        });
    });
});

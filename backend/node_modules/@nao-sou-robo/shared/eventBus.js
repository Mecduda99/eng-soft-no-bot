const amqp = require('amqplib');

class EventBus {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async publish(event, data) {
    const exchange = 'nao-sou-robo-events';
    await this.channel.assertExchange(exchange, 'topic');
    this.channel.publish(exchange, event, Buffer.from(JSON.stringify(data)));
    console.log(`[EVENT PUBLISHED] ${event}:`, data);
  }

  async subscribe(event, callback) {
    const exchange = 'nao-sou-robo-events';
    await this.channel.assertExchange(exchange, 'topic');
    const q = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q.queue, exchange, event);
    
    this.channel.consume(q.queue, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(`[EVENT RECEIVED] ${event}:`, data);
        callback(data);
        this.channel.ack(msg);
      }
    });
  }

  async close() {
    if (this.connection) await this.connection.close();
  }
}

module.exports = EventBus;
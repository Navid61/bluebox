import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'user-devices-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'user-devices-group' });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'sample-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

consumeMessages().catch(console.error);

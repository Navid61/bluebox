import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'user-management-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'user-management-group' });

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

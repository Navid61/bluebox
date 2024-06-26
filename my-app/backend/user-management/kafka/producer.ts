import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'user-management-producer',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

const produceMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'sample-topic',
    messages: [{ value: 'Hello from user-management producer!' }]
  });
  await producer.disconnect();
};

produceMessage().catch(console.error);

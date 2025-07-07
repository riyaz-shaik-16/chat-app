import amqp from "amqplib";
// import dotenv from ""

let channel = null;
const hostname = process.env.RABBITMQ_HOSTNAME;
const username = process.env.RABBITMQ_USERNAME;
const password = process.env.RABBITMQ_PASSWORD;

if(!hostname || !username || !password){
  console.log(".env variables not initialized!!")
  process.exit(1);
}

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname,
      port: 5672,
      username,
      password,
    });

    channel = await connection.createChannel();

    // console.log("Channel: ",channel);
  } catch (error) {
    console.log("Failed to connect to rabbitmq: ", error);
    process.exit(1);
  }
};

export const publishToQueue = async (queueName, message) => {
  if (!channel) {
    console.log("Rabbitmq channel not initialized!!");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

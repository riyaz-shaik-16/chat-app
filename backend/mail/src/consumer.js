import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtp = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname:process.env.RABBITMQ_HOSTNAME,
      PORT: 5672,
      username:process.env.RABBITMQ_USERNAME,
      password:process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();

    const queueName = "send-otp";

    await channel.assertQueue(queueName,{durable:true});

    console.log("Mail service started! waitinf to send otp!");

    channel.consume(queueName,async(message)=>{
        try {

            const {to,subject,body} = JSON.parse(message.content.toString());

            const transporter = nodemailer.createTransport({
                host:"smtp.gmail.com",
                port:465,
                auth:{
                    user:process.env.EMAIL_ID,
                    pass:process.env.EMAIL_PASSWORD
                }
            }) 
            

            await transporter.sendMail({
                from:"chat-app",
                to,
                subject,
                text:body,
            })

            console.log(`otp sent to ${to}`);

            channel.ack(message);
        } catch (error) {
            console.log("Error in channel.cosume:  ",error);
        }
    })
  } catch (error) {
    console.log("Error in sending otp function: ", error);
  }
};

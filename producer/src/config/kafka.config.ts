import { Admin, Kafka, logLevel, Producer } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private broker: string;

  constructor() {
    this.broker = process.env.KAFKA_BROKERS || "192.168.29.202:9092";
    this.kafka = new Kafka({
      clientId: "producer",
      brokers: [this.broker],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.admin.connect();
      console.log("Kafka Connected");
    } catch (error) {
      console.error("Error while connecting : ", error);
    }
  }

  async createTopic(topic: string): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1 }],
      });
      console.log("Topic Created : ", topic);
    } catch (error) {
      console.error("Error creating topic: ", error);
    }
  }

  async sendToTopic(topic: string, message: string): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log("Message sent to topic : ", topic);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.admin.disconnect();
    } catch (error) {
      console.error("Error while disconnecting : ", error);
    }
  }
}

export default new KafkaConfig();

import kafkaConfig from "./config/kafka.config"

export const init = async () => {
    try {
        await kafkaConfig.connect();
        await kafkaConfig.createTopic('test');
    } catch (error) {
        console.error('Error starting services: ', error);
        process.exit(1);
    }
}
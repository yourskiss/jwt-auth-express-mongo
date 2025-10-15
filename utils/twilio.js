import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const sendMSG = async (to, body) => {
    try {
        const message = await client.messages.create({
            body:body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });
        if(message.sid) {
            console.log("SMS sent successfully. SID:", message.sid);
        }
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}
export default sendMSG;
const nodemailer = require("nodemailer"); 
const logger = require("./logger");

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: "18saranshtyagi2004@gmail.com", 
        pass: "apyxguobpudobjdp"
    }
}); 

transporter.verify((error, success) => {
    if(error) {
        logger.error("Email transporter verification failed:", error);
    }
    else {
        logger.info("Email transporter is ready to send messages");
    }
});

async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    for(let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await transporter.sendMail(mailOptions);
            logger.info(`Email sent: ${mailOptions.subject} to ${mailOptions.to}`);
            return;
        } catch (error) {
            logger.error(`Email attempt ${attempt} failed: ${error}`);
            if(attempt === maxRetries) {
                throw new Error(`Failed to send email after ${maxRetries} attempts`);
            }
        }
    }
}

module.exports = { sendEmailWithRetry, transporter };
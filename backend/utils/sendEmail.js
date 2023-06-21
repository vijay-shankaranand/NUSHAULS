const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.HOST,
            service: process.env.SERVICE,
            post: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: 'nushauls@gmail.com',
                pass: 'rlpguxponxbnakmi'
            }
        })

        await transporter.sendMail({
            from:process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log("Email send Successfully")
    } catch (error) {
        console.log("Email not sent");
        console.log(error);
        return error;
    }
}

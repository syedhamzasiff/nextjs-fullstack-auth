import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
       const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        //configure mail for usage

        if (emailType === "VERIFY"){
          await User.findByIdAndUpdate(userId,
            {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
          }
           else if (emailType === "RESET") {
              await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
          }
        


          const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: 'hamza@hamza.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'Verify' ? "verify your email" : "reset your Password", // Subject line
            //text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` // html body
          }

          const mailResponse = await transport.sendMail(mailOptions);
          return mailResponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}
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
              
          }
        


        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 465,
            secure: true,
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });

          const mailOptions = {
            from: 'hamza@hamza.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'Verify' ? "verify your email" : "reset your Password", // Subject line
            //text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          }

          const mailResponse = await transporter.sendMail(mailOptions);
          return mailResponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}
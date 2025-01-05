import {  transporter} from './Email.config.js'
import { Verification_Email_Template,  } from './EmailTemplate.js';



export const SendVerificationLink = async (email, verificationLink) => {
    try {
      const response = await transporter.sendMail({
          from: '"CodeBY Barouque 👻" <sa0071429@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Verfiy your Email", // Subject line
          text: "Verify Your Email", // plain text body
        html: Verification_Email_Template.replace('{verificationLink}', verificationLink),
      });
      console.log("Verification link sent successfully", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  




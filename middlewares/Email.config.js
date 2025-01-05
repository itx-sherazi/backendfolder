import  nodemailer  from 'nodemailer'



export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "sa0071429@gmail.com",
      pass: "sidq yasf mmvm bqss",
    },
  });
  
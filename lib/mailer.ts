import nodemailer from "nodemailer";


// export const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });



export const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // info@yourdomain.com
        pass: process.env.EMAIL_PASS, // normal password (2FA OFF hai)
    },
});
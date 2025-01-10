const RegistrationOTPTemplate = (username: string, otp: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shelf-Savvy : Registration OTP</title>
    <style>
        body {
            margin: 0;
            font-family: 'Urbanist', Sans-Serif;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #fff;
        }
        .container {
            background-color: #000;
            border: 2px solid rgba(82, 82, 82, 0.2);
            border-radius: 10px;
            width: 540px;
            position: relative;
        }
        .header {
            padding: 16px;
            gap: 8px;
            align-items: center;
            justify-content: center;
            text-align: center
        }
        .header h1 {
            font-family: 'League Gothic', Sans-Serif;
            font-size: 24px;
            letter-spacing: 3px;
            margin: 0;
            color: #fff;
            text-align: center
        }
        .header h2 {
            font-size: 28px;
            margin: 0;
            color: #fff;
            text-align: center
        }
        .content {
            background-color: #1A1A1A;
            padding: 16px;
            color: #fff;
        }
        .content p {
            margin-bottom: 16px;
            color: #fff;
        }
        .otp {
            font-weight: bold;
            font-size: 24px;
        }
        .footer {
            font-size: 12px;
            text-align: center;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SHELF-SAVVY</h1>
            <h2>OTP Verification</h2>
        </div>
        <div class="content">
            <p>Dear ${username},</p>
            <p>Your OTP is <span class="otp">${otp.slice(0, 3) + " " + otp.slice(3, 6)}</span></p>
            <p>Thank you for registering with Shelf-Savvy!</p>
            <p>We are excited to have you on board.</p>
            <p style="font-size: 12px;">Do not share this OTP with anyone. If this wasn't you, please ignore this message.</p>
            <p class="footer">&copy; Shelf-Savvy, CodeSprint 2025</p>
        </div>
    </div>
</body>
</html>
`;
};

export default RegistrationOTPTemplate;

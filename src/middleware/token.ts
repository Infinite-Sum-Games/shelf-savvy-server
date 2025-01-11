import { V4 } from "paseto";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

const secKey = "src/encryption/private_key.pem" as string;
const pubKey = "src/encryption/private_key.pem" as string;

const createToken = async (email: string) => {
  const secretKey = process.env.TOKEN_SECRET;
  const data = { email, secretKey };
  const privateKey = fs.readFileSync(secKey);
  const token = await V4.sign(data, privateKey, { expiresIn: "1440m" });
  return token;
};

const tempToken = async (email: string) => {
  const secretKey = process.env.TOKEN_SECRET;
  const data = { email, secretKey };
  const privateKey = fs.readFileSync(secKey);
  const token = await V4.sign(data, privateKey, { expiresIn: "5m" });
  return token;
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const tokenHeader: string = req.headers.authorization as string;
  let token: string | null = null;
  try {
    token = tokenHeader.split(" ")[1];
  } catch (error) {
    res.status(401).json({
      message: "UNAUTHORIZED REQUEST: Token Missing",
    });
    return;
  }

  if (tokenHeader === null || token === null) {
    res.status(401).json({
      message: "UNAUTHORIZED REQUEST: Token Missing",
    });
    return;
  }

  const publicKey = fs.readFileSync(pubKey);
  try {
    const payLoad = await V4.verify(token, publicKey);
    const emailCheck = req.body.email === payLoad["email"];
    if (payLoad["secretKey"] === process.env.TOKEN_SECRET && emailCheck) {
      next();
    } else {
      res.status(403).send({
        message: "FORBIDDEN ACCESS",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(403).send({
      message: "FORBIDDEN ACCESS",
    });
    return;
  }
};

export { createToken, tempToken, authMiddleware };

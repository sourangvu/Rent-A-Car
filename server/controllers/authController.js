import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import sendEmail from '../utils/sendEmail.js';
import { hash } from 'bcryptjs';

const users = {}; // Example in-memory user store

export async function forgotPassword(req, res) {
    const { email, role } = req.body;
  
    // For example: differentiate users based on role
    const userStore = role === 'admin' ? adminUsers : users;
    const user = userStore[email];
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const token = sign({ email, role }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
    const resetLink = `${process.env.Client_Domain}/reset-password/${token}`;
  
    const html = `<p>You requested a password reset</p>
                  <a href="${resetLink}">Click here to reset</a>`;
  
    try {
      await sendEmail(email, 'Reset Your Password', html);
      res.json({ message: 'Reset email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending email' });
    }
  }

  export async function resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const decoded = verify(token, process.env.JWT_SECRET_KEY);
      const { email, role } = decoded;
  
      const userStore = role === 'admin' ? adminUsers : users;
  
      if (!userStore[email]) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const hashedPassword = await hash(newPassword, 10);
      userStore[email].password = hashedPassword;
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  }
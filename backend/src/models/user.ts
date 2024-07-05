import { Schema, model, Document } from 'mongoose';
var bcrypt = require('bcryptjs');

export interface Video {
  url: string;
  size: number;
  title: string;
  description: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profilePicture?: string;
  videos?: Video[];
  mobileNo: string;
  bio?: string;
}

export interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: false },
  videos: [{
    url: { type: String, required: true },
    size: { type: Number, required: true, max: 6 * 1024 * 1024 },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  mobileNo: { type: String, required: true },
  bio: { type: String, required: false, maxlength: 500 },
});

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  const generatedPassword = generatePassword(user.mobileNo, user.firstName, user.email);
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(generatedPassword, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next();
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password);
};

function generatePassword(mobileNo: string, firstName: string, email: string): string {
  return mobileNo.slice(0, 4) + firstName.slice(0, 2) + email.slice(0, 3);
}

export const UserModel = model<UserDocument>('User', userSchema);
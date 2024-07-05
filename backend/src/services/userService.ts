// src/services/userService.ts

import { UserModel, User, Video } from "../models/user";

export type UserCreationParams = Pick<User, "email" | "firstName" | "lastName" | "mobileNo">;

export class UserService {
  public async getUser(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  public async createUser(userCreationParams: UserCreationParams & { password: string }): Promise<User> {
    const newUser = new UserModel({
      ...userCreationParams,
      password: userCreationParams.password, // ensure password is included
    });
    return newUser.save();
  }

  public async updateUser(id: string, update: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  public async deleteUser(id: string): Promise<User | null> {
    return UserModel.findByIdAndDelete(id).exec();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async updateUserByEmail(email: string, update: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate({ email }, update, { new: true }).exec();
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async getUserByFirstName(firstName: string): Promise<User | null> {
    return UserModel.findOne({ firstName }).exec();
  }

  public async getUserBio(id: string): Promise<string | null | undefined> {
    const user = await UserModel.findById(id).exec();
    return user ? user.bio : null;
  }

  public async updateUserBio(id: string, bio: string): Promise<User | null> {
    if (bio.length > 500) {
      throw new Error("Bio cannot exceed 500 characters");
    }
    return UserModel.findByIdAndUpdate(id, { bio }, { new: true }).exec();
  }

  public async addVideoToUser(userId: string, video: Video): Promise<User | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $push: { videos: video } },
      { new: true }
    ).exec();
  }

  public async getAllUsers(): Promise<User[]> {
    return UserModel.find({}, "firstName profilePicture videos").exec();
  }
}
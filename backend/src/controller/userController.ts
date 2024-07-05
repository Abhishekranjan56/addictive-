"use strict"
import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse } from "tsoa";
import { User, Video } from "../models/user";
import { UserService, UserCreationParams } from "../services/userService";
import { sendWelcomeEmail } from "../services/emailService";
import { UserModel } from "../models/user";

@Route("users")
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Get("{userId}")
  public async getUser(@Path() userId: string): Promise<User | null> {
    return this.userService.getUser(userId);
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(@Body() body: Omit<UserCreationParams, "password">): Promise<User> {
    const generatedPassword = generatePassword(body.mobileNo, body.firstName, body.email);
    
    const user = await this.userService.createUser({
      ...body,
      password: generatedPassword,
    });

    sendWelcomeEmail(user.email, user.firstName, user.lastName, user.mobileNo, generatedPassword);

    this.setStatus(201);
    return user;
  }

  @Put("{userId}")
  public async updateUser(
    @Path() userId: string,
    @Body() body: Partial<User>
  ): Promise<User | null> {
    return this.userService.updateUser(userId, body);
  }

  @Get()
  public async getUserByFirstName(@Query() firstName: string): Promise<User | null> {
    return this.userService.getUserByFirstName(firstName);
  }

  @Post("login")
  public async loginUser(
    @Body() body: { firstName: string; password: string }
  ): Promise<{ message: string; user?: User }> {
    const user = await UserModel.findOne({ firstName: body.firstName }).exec();
    if (user && await user.comparePassword(body.password)) {
      return { message: "Login successful", user };
    } else {
      this.setStatus(401);
      return { message: "Invalid first name or password" };
    }
  }

  @Get("{userId}/bio")
  public async getUserBio(@Path() userId: string): Promise<{ bio: string | null | undefined }> {
    const bio = await this.userService.getUserBio(userId);
    if (bio !== null) {
      return { bio };
    } else {
      this.setStatus(404);
      return { bio: null };
    }
  }

  @Put("{userId}/bio")
  public async updateUserBio(
    @Path() userId: string,
    @Body() body: { bio: string }
  ): Promise<User | null> {
    try {
      return await this.userService.updateUserBio(userId, body.bio);
    } catch (error) {
      this.setStatus(400);
      return null;
    }
  }

  @Get("all")
  public async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}

function generatePassword(mobileNo: string, firstName: string, email: string): string {
  return mobileNo.slice(0, 4) + firstName.slice(0, 2) + email.slice(0, 3);
}
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { toast } from "react-toastify";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Label } from "../../components/ui/label";

export function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bio, setBio] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstName");

  const fetchUserDetails = async (firstName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/users?firstName=${firstName}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBio = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success("Bio updated successfully!");
      } else {
        toast.error("Failed to update bio");
      }
    } catch (error) {
      toast.error("An error occurred while updating bio");
    }
  };

  const handleAddVideo = async () => {
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("video", videoFile);

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/videos`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success("Video uploaded successfully!");
      } else {
        toast.error("Failed to upload video");
      }
    } catch (error) {
      toast.error("An error occurred while uploading video");
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) {
      toast.error("Please select a profile picture file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePicture", profilePictureFile);

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/profile-picture`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      toast.error("An error occurred while uploading profile picture");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (firstName) {
      fetchUserDetails(firstName);
    }
  }, [firstName]);

  console.log(user);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : user ? (
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.profilePicture || "https://github.com/shadcn.png"} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Name:</span>
                        <span>{`${user.firstName} ${user.lastName}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Phone:</span>
                        <span>{user.mobileNo}</span>
                      </div>
                      {user.bio && (
                        <div className="pt-2">
                          <span className="font-semibold">Bio:</span>
                          <p className="mt-1 text-sm">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No user found.</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </CardFooter>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle>User Uploads</CardTitle>
                  <CardDescription>Manage your uploaded videos.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-[-10px]">Upload Video</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload Video</DialogTitle>
                      <DialogDescription>
                        Select a video file to upload. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="videoTitle" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="videoTitle"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="videoDescription" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="videoDescription"
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="videoFile" className="text-right">
                          Video File
                        </Label>
                        <Input
                          id="videoFile"
                          type="file"
                          onChange={(e) => setVideoFile(e.target.files[0])}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddVideo} disabled={uploading}>
                        {uploading ? "Uploading..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto" style={{ width: 'calc(300px * 3 + 2rem)', height: '300px' }}>
                  <div className="flex space-x-4 pb-4">
                    {user?.videos?.map((video, index) => (
                      <Card key={index} className="w-[300px] flex-shrink-0">
                        <CardContent className="flex flex-col items-center justify-center p-2">
                          <video className="w-full h-32" controls>
                            <source src={video.url} type="video/mp4" />
                          </video>
                          <div className="mt-2 w-full text-center">
                            <hr className="my-2"/>
                            <h3 className="text-sm font-semibold">{video.title}</h3>
                            <p className="text-xs">{video.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Upload a new profile picture.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-[-10px]">Upload Picture</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload Profile Picture</DialogTitle>
                      <DialogDescription>
                        Select a profile picture to upload. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="profilePictureFile" className="text-right">
                          Profile Picture
                        </Label>
                        <Input
                          id="profilePictureFile"
                          type="file"
                          onChange={(e) => setProfilePictureFile(e.target.files[0])}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleProfilePictureUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import ProfileSettings from "@/assets/profile";
import SecuritySettings from "@/assets/security";
import SavedItems from "@/assets/saveditems";
import Articles from "@/assets/userarticles";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "../../../services/authService";
import { UserIcon, LockIcon, PencilIcon } from "lucide-react";
import { BookmarkIcon } from "lucide-react";
import { motion } from "framer-motion";

const Users = () => {
  const [selectedSection, setSelectedSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bio, setBio] = useState<string>("");
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    date: new Date(),
    email: "",
    user: "",
    country: "",
    medium: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    bio: "",
    avatar: "",
  });
  const { user, isAuthenticated } = useAuth();
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const profile = await getProfile();
          setUserInfo({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            date: profile.date ? new Date(profile.date) : new Date(),
            email: profile.email || "",
            user: profile.user || "",
            country: profile.country || "",
            medium: profile.medium || "",
            instagram: profile.instagram || "",
            facebook: profile.facebook || "",
            twitter: profile.twitter || "",
            linkedin: profile.linkedin || "",
            bio: profile.bio || "",
            avatar: profile.avatar || "",
          });
          setProfileImage(profile.profileImage || "");
          setBio(profile.bio || "");
        } catch (error) {
          console.error("Error fetching profile data", error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const RenderContent = () => {
    if (!isAuthenticated) {
      router.push("/");
    }
    switch (selectedSection) {
      case "personal":
        return <ProfileSettings />;

      case "security":
        return <SecuritySettings />;

      case "saved":
        return <SavedItems userId={user?.id ?? 0} />;

      case "articles":
        return <Articles />;

      default:
        return null;
    }
  };

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      setIsSidebarVisible(true);
    } else if (info.offset.x < -100) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[400px_1fr] bg-inherit text-foreground">
        {/* Mobile Menu Button */}
        <motion.div
          className={`fixed block sm:hidden left-0 top-1/2 transform -translate-y-1/2 z-50 bg-[#000916] text-white p-2 rounded-r-full cursor-pointer animate-pulse ${
            isSidebarVisible ? "translate-x-64" : "translate-x-0"
          }`}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {isSidebarVisible ? "✕" : "➔"}
        </motion.div>

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#000916] p-4 transform ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:hidden`}
        >
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold">Welcome</h2>
              <p className="text-customColor-welcome">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedSection("personal")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                <UserIcon className="size-8" />
                <span>Personal Information</span>
              </button>
              <button
                onClick={() => setSelectedSection("security")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                <LockIcon className="size-8" />
                <span>Security & Social Links</span>
              </button>
              <button
                onClick={() => setSelectedSection("saved")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                <BookmarkIcon className="size-8" />
                <span>Saved Articles</span>
              </button>
              <button
                onClick={() => setSelectedSection("articles")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                <PencilIcon className="size-8" />
                <span>My Articles</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block border-r border-border bg-[#000916] px-2 py-8 w-full md:w-16 md:hover:w-64 md:transition-all md:duration-300 group`}
        >
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Welcome
              </h2>
              <p className="text-customColor-welcome opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedSection("personal")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <UserIcon className="size-8" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Personal Information
                </span>
              </button>
              <button
                onClick={() => setSelectedSection("security")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <LockIcon className="size-8" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Security & Social Links
                </span>
              </button>
              <button
                onClick={() => setSelectedSection("saved")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <BookmarkIcon className="size-8" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Saved Articles
                </span>
              </button>
              <button
                onClick={() => setSelectedSection("articles")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <PencilIcon className="size-8" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  My Articles
                </span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="bg-inherit p-4 md:p-6 lg:p-8">{RenderContent()}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Users;

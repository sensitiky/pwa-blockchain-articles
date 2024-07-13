//Seccion de login/registro y pre inicio de sesion.
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { SVGProps, useEffect, useState } from "react";
import Header from "@/assets/header";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios, { isCancel, AxiosError } from "axios";
import Footer from "@/assets/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import FacebookLogin from "@/components/FacebookLogin"; // Importar el componente de Facebook Login

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const cookies = new Cookie();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    try {
      const result = await axios.post(
        "http://localhost:4000/users/google-login",
        {
          token: credential,
        }
      );
      console.log("Google Login Success:", result.data);
      const { jwtToken } = result.data;

      // Guardar el token JWT en el almacenamiento local
      localStorage.setItem("token", jwtToken);

      // Obtener la sesión del usuario
      const sessionResponse = await axios.get(
        "http://localhost:4000/users/session",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log("User session:", sessionResponse.data);

      // Redirigir o actualizar el estado de autenticación de la aplicación
      window.location.href = "/dashboard"; // Redirigir a una página protegida
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      console.log("Registering user:", { username, email, password });
      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log("Register response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        await handleLogin(username, password);
      } else {
        const errorData = await response.json();
        console.error("Failed to register user:", errorData);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log("Logging in with:", { username, password });
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        router.push("/users");
      } else {
        const errorData = await response.json();
        console.error("Failed to login user:", errorData);
      }
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(username, email, password);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient2 ">
      <Header />
      <main
        className="flex-1 mt-12 md:mt-16 lg:mt-20 "
        data-aos="fade-in"
        data-aos-once="true"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="200"
      >
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-b">
          <div className="flex justify-center container space-y-10 xl:space-y-16 px-4 md:px-6">
            <div className="grid gap-4 grid-rows-2 md:gap-16">
              <div>
                <div className="grid-1 items-center">
                  <h1 className="text-center text-customColor-innovatio3 lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    In order to continue with the creation
                    <br /> process you must register with your <br />
                    Google account
                  </h1>
                </div>
                <div className="justify-center gap-4 items-center mx-auto grid-1 flex flex-col mt-6 grid-2 sm:flex-row">
                  <Dialog defaultOpen>
                    <DialogTrigger asChild>
                      <Button className="hover:bg-customColor-innovatio3 hover:text-customColor-innovatio bg-customColor-innovatio2 border-customColor-innovatio3 border-2 rounded-full px-6 py-3 text-sm text-customColor-innovatio3 font-medium">
                        Sign Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle className="font-bold text-center text-2xl text-customColor-innovatio3">
                        WELCOME
                      </DialogTitle>
                      <DialogDescription />
                      <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="login">Login</TabsTrigger>
                          <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={() => console.log("Login Failed")}
                              />
                            </div>
                            <div className="flex justify-center">
                              <FacebookLogin appId={""} />
                            </div>
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                  Or continue with
                                </span>
                              </div>
                            </div>
                            <form
                              className="space-y-2"
                              onSubmit={handleLoginSubmit}
                            >
                              <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  placeholder="Your username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="********"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                              <Button
                                type="submit"
                                className="w-full bg-customColor-innovatio3 hover:bg-customColor-innovatio2 hover:text-customColor-innovatio3"
                              >
                                Login
                              </Button>
                            </form>
                          </div>
                        </TabsContent>
                        <TabsContent value="register">
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={() => console.log("Login Failed")}
                              />
                            </div>
                            <div className="flex justify-center">
                              <FacebookLogin appId={""} />
                            </div>
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                  Or continue with
                                </span>
                              </div>
                            </div>
                            <form
                              className="space-y-2"
                              onSubmit={handleRegisterSubmit}
                            >
                              <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  placeholder="Your username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="youremail@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="********"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                              <Button
                                type="submit"
                                className="w-full bg-customColor-innovatio3 hover:bg-customColor-innovatio2 hover:text-customColor-innovatio3"
                              >
                                Sign Up
                              </Button>
                            </form>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="bg-customColor-innovatio3 rounded-full px-6 py-3 text-sm text-customColor-innovatio font-medium border-2 hover:bg-customColor-innovatio2 hover:border-customColor-innovatio3"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Login;

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

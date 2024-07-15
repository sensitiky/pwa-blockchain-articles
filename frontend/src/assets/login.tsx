"use client"

import { JSX, SVGProps, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginCard() {
  const [showRegister, setShowRegister] = useState(false)
  return (
    <div className="mx-auto max-w-md space-y-6">
      {!showRegister && (
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Enter your username and password to access your account.</p>
        </div>
      )}
      {showRegister && (
        <div className="space-y-2 text-center animate-zoom-out">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-muted-foreground">Enter your details to create an account.</p>
        </div>
      )}
      {!showRegister && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
            <Button variant="outline" className="w-full">
              <FacebookIcon className="mr-2 h-4 w-4" />
              Login with Facebook
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <div>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)} className="underline">
                Create one
              </button>
            </div>
            <div>
              <Link href="#" className="underline" prefetch={false}>
                Forget your password?
              </Link>
            </div>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Register with Google
            </Button>
            <Button variant="outline" className="w-full">
              <FacebookIcon className="mr-2 h-4 w-4" />
              Register with Facebook
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
              I have read and agree to the{" "}
              <Link href="#" className="underline" prefetch={false}>
                Terms and Conditions
              </Link>
              ,{" "}
              <Link href="#" className="underline" prefetch={false}>
                Services Terms
              </Link>
              ,{" "}
              <Link href="#" className="underline" prefetch={false}>
                Earn Terms
              </Link>
              ,{" "}
              <Link href="#" className="underline" prefetch={false}>
                Exchange Terms
              </Link>
              , and{" "}
              <Link href="#" className="underline" prefetch={false}>
                Privacy Policy
              </Link>
              of Blogchain.
            </Label>
          </div>
        </div>
      )}
    </div>
  )
}

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
  )
}


function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const LoginCard: React.FC = () => {
  return (
    <Card className="w-[350px] bg-white">
      <CardHeader>
        <CardTitle className="text-center">Welcome</CardTitle>
        <CardDescription className="text-center">Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 mr-2" />
            Sign in with Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 mr-2" />
            Sign in with Email
          </Button>
        </div>
        <div className="text-center mt-4">
          <Link href="/forgot-password">
            <Button className="text-sm text-gray-600 hover:underline bg-inherit hover:bg-inherit">Forgot password?</Button>
          </Link>
        </div>
        <div className="text-center mt-2">
          <Link href="/signup">
            <Button className="text-sm text-gray-600 hover:underline bg-inherit hover:bg-inherit">No account? Create one</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

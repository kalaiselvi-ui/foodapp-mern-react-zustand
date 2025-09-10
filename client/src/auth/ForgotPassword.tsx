import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const loading: boolean = false;
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4">
        <h1 className="font-extrabold text-center text-2xl">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your email address to reset your password
        </p>
        <div className="relative w-full">
          <Input
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Mail className="absolute inset-y-2 right-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button>Send Reset Link</Button>
        )}
        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userSignupSchema, type SignupInputState } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { treeifyError } from "zod";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    name: "",
    email: "",
    password: "",
    contact: "",
  });
  const [error, setError] = useState<Partial<SignupInputState>>({});
  const { signup, loading } = useUserStore();
  const navigate = useNavigate();
  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = userSignupSchema.safeParse(input);

    if (!result.success) {
      const tree = treeifyError(result.error);

      const fieldErrors: Partial<SignupInputState> = {};

      if (tree.properties) {
        Object.entries(tree.properties).forEach(([key, value]) => {
          if (value?.errors?.length) {
            fieldErrors[key as keyof SignupInputState] = value.errors[0];
          }
        });
      }

      setError(fieldErrors);
      return;
    }
    //api implementation
    try {
      await signup(input);
      // navigate("/verify-email");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-y-auto w-full">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg mx-4"
      >
        <div className="mb-4">
          <h1 className="font-bold text-2xl text-center">TastySarv</h1>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="name"
              placeholder="Enter your name"
              className="focus-visible:ring-1"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
            />
            <User className="absolute right-1.5 inset-y-1.5 text-gray-500" />
            {error && (
              <span className="text-sm text-red-500">{error.name}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              className="focus-visible:ring-1"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
            <Mail className="absolute right-1.5 inset-y-1.5 text-gray-500" />
            {error && (
              <span className="text-sm text-red-500">{error.email}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              name="password"
              className="focus-visible:ring-1"
              value={input.password}
              onChange={changeEventHandler}
            />
            <LockKeyhole className="absolute right-1.5 inset-y-1.5 text-gray-500" />
            {error && (
              <span className="text-sm text-red-500">{error.password}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              className="focus-visible:ring-1"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
            />
            <PhoneOutgoing className="absolute right-1.5 inset-y-1.5 text-gray-500" />
            {error && (
              <span className="text-sm text-red-500">{error.contact}</span>
            )}
          </div>
        </div>
        <div className="mb-10">
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Signup
            </Button>
          )}
        </div>
        <Separator />
        <p className="mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

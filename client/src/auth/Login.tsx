import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userLoginSchema, type LoginInputState } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Partial<LoginInputState>>({});
  const { loading, login } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const loginSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      // const tree = treeifyError(result.error);

      const fieldErrors: Partial<LoginInputState> = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoginInputState;
        fieldErrors[fieldName] = issue.message;
        console.log(result.error.issues);
      });

      setError(fieldErrors);
      return;
    }
    try {
      await login(input);
      navigate("/");
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
              type="email"
              placeholder="Enter your email"
              className="focus-visible:ring-1"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
            <Mail className="absolute right-1.5 inset-y-1.5 text-gray-500" />
            <span className="text-sm text-red-500">{error.email}</span>
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
            <span className="text-sm text-red-500">{error.password}</span>
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
              Login
            </Button>
          )}
          <div className="pt-4 text-center">
            <Link
              to="/forgot-password"
              className="hover:text-blue-500 hover:underline text-center"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Separator />
        <p className="mt-2 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

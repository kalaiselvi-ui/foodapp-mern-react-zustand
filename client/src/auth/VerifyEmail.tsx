import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import React, { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const { loading, verifyEmail } = useUserStore();
  const navigate = useNavigate();
  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    //Move to next input field is digit is entered
    if (value !== "" && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const VerifyEmailHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode: string = otp.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your Email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <form onSubmit={VerifyEmailHandler}>
          <div className="flex justify-center gap-4">
            {otp.map((letter: string, idx: number) => (
              <Input
                type="text"
                key={idx}
                maxLength={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(idx, e)
                }
                ref={(ele) => {
                  inputRef.current[idx] = ele;
                }}
                value={letter}
                className="md:w-12 md:h-12 w-8 h-8 text-sm md:text-2xl font-normal md:font-bold rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="mt-6 w-full">Verify</Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;

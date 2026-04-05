import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { toast } from "sonner";
import ThemeToggle from "@/components/layout/ThemeToggle";
import getField from "@/form/getField";
import useRegisterForm from "@/pages/Register/hooks/useRegisterForm";
import registerControls from "./config/controls";

const RegisterPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, errors } = useRegisterForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await register(data.name, data.email, data.password);
      toast.success("Account created successfully");
      navigate("/organization");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 font-bold text-2xl">
        <div className="flex bg-primary text-primary-foreground items-center justify-center rounded-lg p-1.5 shadow-sm">
          <Activity className="h-6 w-6" />
        </div>
        Pulse
      </div>

      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>Get started with Pulse</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {registerControls.map((config) => {
              const Element = getField(config.type);
              return (
                <Element
                  key={config.name}
                  {...config}
                  control={control}
                  errors={errors}
                />
              );
            })}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-2 text-base font-medium cursor-pointer"
            >
              {submitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;

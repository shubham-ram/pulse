import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
import getField from "@/form/Controller/getField";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
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
              className="mt-2"
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
              className="text-primary underline underline-offset-4"
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

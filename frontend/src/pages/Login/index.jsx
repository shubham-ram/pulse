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
import getField from "@/form/getField";
import useLoginForm from "./hooks/useLoginForm";
import loginControls from "./config/controls";

const LoginPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, errors } = useLoginForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success("Logged in successfully");
      navigate(user.organizationId ? "/" : "/organization");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Pulse account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {loginControls.map((config) => {
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
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

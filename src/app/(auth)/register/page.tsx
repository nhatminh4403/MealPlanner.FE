"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { register } from "@/libs/axios";
import { toast } from "sonner";
import axios from "axios";
import { useLocalization } from "@/libs/LocalizationProvider";
import { Eye, EyeClosed, EyeOff } from "lucide-react";

export default function Register() {
  const { L } = useLocalization();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(L("MealPlannerAPI", "Auth:PasswordsDoNotMatch"));
      return;
    }

    setIsLoading(true);

    try {
      await register({
        emailAddress: formData.email,
        password: formData.password,
        name: formData.name,
        userName: formData.userName,
        appName: "MealPlanner",
      });
      toast.success(L("MealPlannerAPI", "Auth:RegistrationSuccessful"));
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error?.message ||
            error.message ||
            L("MealPlannerAPI", "Auth:RegistrationFailed"),
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : L("MealPlannerAPI", "Auth:RegistrationFailed"),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <Card className="shadow-2xl bg-background/60 backdrop-blur-xl 
    relative overflow-hidden gradient-border-static bg-gradient-sheen mt-8">
      <div className="absolute inset-0 rounded-[inherit] border-t border-b border-l border-r pointer-events-none 
      border-t-primary-secondary-65 border-b-primary-secondary-205 border-l-primary-secondary-25 border-r-primary-secondary-155 opacity-80" />

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {L("MealPlannerAPI", "Auth:CreateAnAccount")}
        </CardTitle>
        <CardDescription className="text-center">
          {L("MealPlannerAPI", "Auth:RegisterDescription")}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{L("MealPlannerAPI", "Auth:FullName")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={L(
                "MealPlannerAPI",
                "Auth:RegistrationNamePlaceholder",
              )}
              className="bg-background/50"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">{L("MealPlannerAPI", "Auth:UserName")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={L(
                "MealPlannerAPI",
                "Auth:RegistrationNamePlaceholder",
              )}
              className="bg-background/50"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{L("MealPlannerAPI", "Auth:Email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={L(
                "MealPlannerAPI",
                "Auth:RegistrationEmailPlaceholder",
              )}
              className="bg-background/50"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="password">
                {L("MealPlannerAPI", "Auth:Password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="bg-background/50 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground border-l border-muted/30 rounded-l-none rounded-r-md"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">
                {L("MealPlannerAPI", "Common:Confirm")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-background/50 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground border-l border-muted/30 rounded-l-none rounded-r-md"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 pb-3">
            <Checkbox id="terms" required />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {L("MealPlannerAPI", "Auth:AgreeToTerms")}{" "}
              <Link href="/terms" className="text-primary hover:underline">
                {L("MealPlannerAPI", "Auth:TermsOfService")}
              </Link>
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 rounded-b">
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 border-none h-10 text-white font-semibold transition-all"
            disabled={isLoading}
          >
            {isLoading
              ? L("MealPlannerAPI", "Auth:Registering")
              : L("MealPlannerAPI", "Auth:Register")}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {L("MealPlannerAPI", "Auth:AlreadyHaveAccount")}?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {L("MealPlannerAPI", "Auth:SignIn")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

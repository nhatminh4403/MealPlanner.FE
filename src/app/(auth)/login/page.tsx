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
import { login } from "@/libs/axios";
import { toast } from "sonner";
import { useLocalization } from "@/libs/LocalizationProvider";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { L } = useLocalization();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(usernameOrEmail, password);
      toast.success(L("MealPlannerAPI", "Auth:SuccessfullyLoggedIn"));
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : L("MealPlannerAPI", "Auth:LoginFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl bg-background/60 backdrop-blur-xl relative overflow-hidden gradient-border-static bg-gradient-sheen">
      <div className="absolute inset-0 rounded-[inherit] border-t border-b border-l border-r pointer-events-none 
      border-t-primary-secondary-25 border-b-primary-secondary-205 border-l-primary-secondary-115 border-r-primary-secondary-155 opacity-80" />

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {L("MealPlannerAPI", "Auth:WelcomeBack")}
        </CardTitle>
        <CardDescription className="text-center">
          {L("MealPlannerAPI", "Auth:SignInDescription")}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="identifier">
              {L("MealPlannerAPI", "Auth:EmailOrUsername")}
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder={L("MealPlannerAPI", "Auth:EmailOrUsername")}
              className="bg-background/50"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                {L("MealPlannerAPI", "Auth:Password")}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {L("MealPlannerAPI", "Auth:ForgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-background/50 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="flex items-center space-x-2 mb-2 pb-1">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {L("MealPlannerAPI", "Auth:RememberMe")}
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 border-none h-10 text-white font-semibold transition-all"
            disabled={isLoading}
          >
            {isLoading
              ? L("MealPlannerAPI", "Auth:SigningIn")
              : L("MealPlannerAPI", "Auth:SignIn")}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {L("MealPlannerAPI", "Auth:NoAccount")}?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {L("MealPlannerAPI", "Auth:CreateAccount")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

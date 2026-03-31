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
import { useLocalization } from "@/libs/localization";

export default function Login() {
  const { L } = useLocalization();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(usernameOrEmail, password);
      toast.success(L("MealPlannerAPI", "SuccessfullyLoggedIn"));
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : L("MealPlannerAPI", "LoginFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl bg-background/60 backdrop-blur-xl relative overflow-hidden gradient-border-static">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute top-0 left-0 h-full w-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute top-0 right-0 h-full w-1 bg-linear-to-r from-primary to-secondary" />

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {L("MealPlannerAPI", "WelcomeBack")}
        </CardTitle>
        <CardDescription className="text-center">
          {L("MealPlannerAPI", "SignInDescription")}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="identifier">
              {L("MealPlannerAPI", "EmailOrUsername")}
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder={L("MealPlannerAPI", "EmailOrUsername")}
              className="bg-background/50"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                {L("MealPlannerAPI", "Password")}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {L("MealPlannerAPI", "ForgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              className="bg-background/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2 mb-2 pb-1">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {L("MealPlannerAPI", "RememberMe")}
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
              ? L("MealPlannerAPI", "SigningIn")
              : L("MealPlannerAPI", "SignIn")}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {L("MealPlannerAPI", "NoAccount")}?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {L("MealPlannerAPI", "CreateAccount")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

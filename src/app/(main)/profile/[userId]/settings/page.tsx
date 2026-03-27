"use client";

import React, { useEffect, useState, use } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userSettings } from "@/libs/api";
import { UserSettings, VisibilityLevel } from "@/libs/interfaceDTO";
import { Bell, Shield, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function SettingsPage({ params }: PageProps) {
  const { userId } = use(params);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userSettings.get().then((res) => {
      setSettings(res.data);
      setLoading(false);
    }).catch(() => {
      // Mock settings if API fails or for initial development
      setSettings({
        privacy: {
          profileVisibility: 2,
          recipesVisibility: 2,
          shoppingListVisibility: 0,
        },
        notifications: {
          mealReminders: true,
          recipeUpdates: true,
          communityActivity: true,
          shoppingListAlerts: false,
        }
      });
      setLoading(false);
    });
  }, [userId]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await userSettings.update(settings);
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage your account preferences and application appearance.</p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-8 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <TabsTrigger value="appearance" className="gap-2 px-4 py-2 rounded-lg data-active:bg-white dark:data-active:bg-zinc-800 data-active:shadow-sm transition-all">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 px-4 py-2 rounded-lg data-active:bg-white dark:data-active:bg-zinc-800 data-active:shadow-sm transition-all">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2 px-4 py-2 rounded-lg data-active:bg-white dark:data-active:bg-zinc-800 data-active:shadow-sm transition-all">
            <Shield className="h-4 w-4" /> Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Appearance</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Settings related to how MealPlanner looks. Use the theme toggle in the header to switch between light and dark modes.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                 <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Notification Preferences</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose when and how you want to be notified.</p>
            
            <div className="mt-8 space-y-4">
              {[
                { id: 'mealReminders', label: 'Meal Reminders', desc: 'Get reminded about your upcoming planned meals.' },
                { id: 'recipeUpdates', label: 'Recipe Updates', desc: 'Alerts when recipes you follow are updated.' },
                { id: 'communityActivity', label: 'Community Activity', desc: 'Notify me of likes, comments, and new followers.' },
                { id: 'shoppingListAlerts', label: 'Shopping List Alerts', desc: 'Reminders for items on your shopping list.' },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{notif.label}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{notif.desc}</p>
                  </div>
                  <Switch 
                    checked={settings?.notifications[notif.id as keyof typeof settings.notifications]} 
                    onCheckedChange={(val) => setSettings(s => s ? {
                      ...s, 
                      notifications: {...s.notifications, [notif.id as keyof typeof s.notifications]: val}
                    } : null)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                 <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Privacy & Visibility</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Control who can interact with your profile and recipes.</p>
            
            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Profile Visibility</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Determine who can see your public profile.</p>
                </div>
                <Select 
                  value={settings?.privacy.profileVisibility.toString()} 
                  onValueChange={(val) => setSettings(s => s ? {
                    ...s, 
                    privacy: {...s.privacy, profileVisibility: parseInt(val) as VisibilityLevel}
                  } : null)}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-zinc-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Private</SelectItem>
                    <SelectItem value="1">Friends Only</SelectItem>
                    <SelectItem value="2">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Recipe Default Visibility</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Sets the initial visibility for newly created recipes.</p>
                </div>
                <Select 
                  value={settings?.privacy.recipesVisibility.toString()} 
                  onValueChange={(val) => setSettings(s => s ? {
                    ...s, 
                    privacy: {...s.privacy, recipesVisibility: parseInt(val) as VisibilityLevel}
                  } : null)}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-zinc-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Private</SelectItem>
                    <SelectItem value="1">Friends Only</SelectItem>
                    <SelectItem value="2">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex items-center justify-between p-6 rounded-2xl bg-zinc-900 dark:bg-primary shadow-xl shadow-primary/10">
        <div className="hidden sm:block">
           <p className="text-white font-medium text-lg">Unsaved changes?</p>
           <p className="text-zinc-400 dark:text-primary-foreground/70 text-sm">Make sure to save before leaving the page.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          size="lg"
          className="w-full sm:w-auto gap-2 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 dark:border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <><Save className="h-4 w-4" /> Save All Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}

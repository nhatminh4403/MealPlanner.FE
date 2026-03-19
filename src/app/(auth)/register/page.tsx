"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { register } from '@/libs/axios'
import { toast } from 'sonner'
import axios from 'axios'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    try {
      await register({
        userName: formData.email, // ABP usually uses email as username or requires both
        emailAddress: formData.email,
        password: formData.password,
        name: formData.name
      })
      toast.success('Registration successful! Please sign in.')
      router.push('/login')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error?.message || error.message || 'Registration failed')
      } else {
        toast.error(error instanceof Error ? error.message : 'Registration failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <Card className="shadow-2xl bg-background/60 backdrop-blur-xl relative overflow-hidden gradient-border-static">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute top-0 left-0 h-full w-1 bg-linear-to-r from-primary to-secondary" />
      <div className="absolute top-0 right-0 h-full w-1 bg-linear-to-r from-primary to-secondary" />
      
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account and start planning your meals
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              className="bg-background/50" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-background/50" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-background/50" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                className="bg-background/50" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pb-3">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
              I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 rounded-b">
          <Button 
            type="submit"
            className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 border-none h-10 text-white font-semibold transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

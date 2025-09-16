"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const adminRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type AdminRegistrationForm = z.infer<typeof adminRegistrationSchema>;

export default function AdminRegistrationPage() {
  const [formData, setFormData] = useState<AdminRegistrationForm>({
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminRegistrationForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateField(name: keyof AdminRegistrationForm, value: string) {
    try {
      // Validate the email field
      if (name === "email") {
        adminRegistrationSchema.shape.email.parse(value);
      }

      // Clear error if validation passes
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((err: z.ZodIssue) =>
          err.path.includes(name)
        );
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        }
      }
    }
  }

  function handleInputChange(name: keyof AdminRegistrationForm, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change (debounced validation could be added here)
    if (value.trim()) {
      validateField(name, value);
    } else {
      // Clear error when field is empty
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate the entire form
      const validatedData = adminRegistrationSchema.parse(formData);

      // Clear all errors
      setErrors({});

      console.log("Registering admin:", validatedData);

      // TODO: Add actual registration logic here
      // await registerAdmin(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set errors from validation
        const newErrors: Partial<Record<keyof AdminRegistrationForm, string>> =
          {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof AdminRegistrationForm;
          if (field && !newErrors[field]) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Registration
          </CardTitle>
          <CardDescription className="text-center">
            An email will be sent to this account containing login credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <CardFooter className="px-0">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

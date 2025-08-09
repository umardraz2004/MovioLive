import * as yup from "yup";

export const SignupSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters")
    .matches(/^[A-Za-z ]+$/, "Full name must only contain letters and spaces"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email format"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Must contain at least one special character (@, $, !, %, *, ?, &)"
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const LoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email format"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const contactSchema = yup.object({
  name: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

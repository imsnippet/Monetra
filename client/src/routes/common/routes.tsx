import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routePath";

// Route pages are code-split for performance
const SignIn = lazy(() => import("@/pages/auth/sign-in"));
const SignUp = lazy(() => import("@/pages/auth/sign-up"));
const VerifyEmail = lazy(() => import("@/pages/auth/verify-email"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgot-password"));
const VerifyResetPassword = lazy(() => import("@/pages/auth/verify-reset-password"));
const SetNewPassword = lazy(() => import("@/pages/auth/set-new-password"));
const ResetPassword = lazy(() => import("@/pages/auth/reset-password"));
const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Transactions = lazy(() => import("@/pages/transactions"));
const Reports = lazy(() => import("@/pages/reports"));
const Budget = lazy(() => import("@/pages/budget"));
const Goals = lazy(() => import("@/pages/goals"));
const Accounts = lazy(() => import("@/pages/accounts"));
const Recurring = lazy(() => import("@/pages/recurring"));
const Settings = lazy(() => import("@/pages/settings"));
const Account = lazy(() => import("@/pages/settings/account"));
const Appearance = lazy(() => import("@/pages/settings/appearance"));
const Backup = lazy(() => import("@/pages/settings/backup"));
const Billing = lazy(() => import("@/pages/settings/billing"));
const Categories = lazy(() => import("@/pages/settings/categories"));



export const publicRoutePaths = [
  { path: PUBLIC_ROUTES.HOME, element: <Home /> },
  { path: PUBLIC_ROUTES.ABOUT, element: <About /> },
];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.VERIFY_OTP, element: <VerifyEmail /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: AUTH_ROUTES.VERIFY_RESET_OTP, element: <VerifyResetPassword /> },
  { path: AUTH_ROUTES.SET_NEW_PASSWORD, element: <SetNewPassword /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
  { path: PROTECTED_ROUTES.BUDGET, element: <Budget /> },
  { path: PROTECTED_ROUTES.GOALS, element: <Goals /> },
  { path: PROTECTED_ROUTES.ACCOUNTS, element: <Accounts /> },
  { path: PROTECTED_ROUTES.RECURRING, element: <Recurring /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.ANALYTICS, element: <Reports /> },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <Settings />,
    children: [
      { index: true, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
      { path: PROTECTED_ROUTES.SETTINGS_BACKUP, element: <Backup /> },
      { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: <Billing /> },

      { path: PROTECTED_ROUTES.SETTINGS_SECURITY, element: <Navigate to={PROTECTED_ROUTES.SETTINGS} replace /> },
      { path: PROTECTED_ROUTES.SETTINGS_CATEGORIES, element: <Categories /> },
    ],
  },
];


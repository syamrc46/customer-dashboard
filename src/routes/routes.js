import { lazy } from 'react';
import Resubscription from '../pages/reSubscription/Resubscription';
const EditReview = lazy(() => import('../pages/editReview/EditReview'));
const ReviewListing = lazy(() => import('../pages/reviewListing/ReviewListing'));
const Login = lazy(() => import('../pages/login/login'));
const ReviewFromEmail = lazy(() => import('../pages/reviewFromEmail/ReviewFromEmail'));
const Unsubscription = lazy(() => import('../pages/unsubscription/Unsubscription'));

export const REVIEW_LISTING = {
  path: '/',
  element: <ReviewListing />,
};
export const REVIEW_EDIT = {
  path: '/edit/:id', // dynamic route for editing
  element: <EditReview />,
};

export const LOGIN = {
  path: '/login',
  element: <Login />,
};

export const REVIEWFROMEMAIL = {
  path: '/review/create/:params',
  element: <ReviewFromEmail />,
};

export const UNSUBSCRIPTION = {
  path: '/review/unsubscribe/:params',
  element: <Unsubscription />,
};

export const RESUBSCRIPTION = {
  path: '/review/resubscription/:params',
  element: <Resubscription />,
};

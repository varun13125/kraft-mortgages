import { redirect } from 'next/navigation';

export default function OldHomePage() {
  // Permanent redirect to new homepage
  redirect('/');
}

import { Category, Content } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'প্রযুক্তি (Tech)', icon: '📱', color: 'bg-blue-500' },
  { id: '2', name: 'স্বাস্থ্য (Health)', icon: '🏥', color: 'bg-green-500' },
  { id: '3', name: 'শিক্ষা (Education)', icon: '📚', color: 'bg-purple-500' },
  { id: '4', name: 'ভ্রমণ (Travel)', icon: '✈️', color: 'bg-orange-500' }
];

export const INITIAL_CONTENTS: Content[] = [
  {
    id: 'c1',
    categoryId: '1',
    title: '২০২৪ সালের সেরা স্মার্টফোন',
    description: 'এই বছরের সবচেয়ে পাওয়ারফুল এবং স্টাইলিশ স্মার্টফোনগুলোর তালিকা এখানে দেওয়া হলো।',
    imageUrl: 'https://picsum.photos/seed/tech1/800/400',
    createdAt: Date.now()
  },
  {
    id: 'c2',
    categoryId: '2',
    title: 'সুস্থ থাকার ১০টি সহজ উপায়',
    description: 'প্রতিদিনের জীবনযাত্রায় ছোট কিছু পরিবর্তন আপনার স্বাস্থ্যকে উন্নত করতে পারে।',
    imageUrl: 'https://picsum.photos/seed/health1/800/400',
    createdAt: Date.now() - 86400000
  }
];

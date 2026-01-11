
import { Category, InfoItem } from './types';

export const CATEGORIES: Category[] = [
  { id: 'edu', name: 'শিক্ষা প্রতিষ্ঠান', description: 'স্কুল, কলেজ ও মাদ্রাসা', icon: 'GraduationCap', color: 'bg-blue-500' },
  { id: 'hosp', name: 'হাসপাতাল ও ক্লিনিক', description: 'সরকারি ও বেসরকারি সেবা', icon: 'Stethoscope', color: 'bg-red-500' },
  { id: 'doc', name: 'ডাক্তার', description: 'বিশেষজ্ঞ ডাক্তারদের তথ্য', icon: 'UserRound', color: 'bg-emerald-500' },
  { id: 'courier', name: 'কুরিয়ার সার্ভিস', description: 'পার্সেল আদান-প্রদান', icon: 'Truck', color: 'bg-orange-500' },
  { id: 'trans', name: 'পরিবহন', description: 'বাস ও লোকাল রুট', icon: 'Bus', color: 'bg-indigo-500' },
  { id: 'tour', name: 'দর্শনীয় স্থান', description: 'ঘুরতে যাওয়ার জায়গা', icon: 'MapPin', color: 'bg-amber-500' },
  { id: 'emergency', name: 'জরুরি সেবা', description: 'পুলিশ ও ফায়ার সার্ভিস', icon: 'PhoneCall', color: 'bg-rose-600' },
  { id: 'office', name: 'সরকারি অফিস', description: 'থানা ও ইউনিয়ন পরিষদ', icon: 'Building2', color: 'bg-slate-600' },
  { id: 'market', name: 'বাজার ও কেনাকাটা', description: 'প্রধান বাজার সমুহ', icon: 'Store', color: 'bg-cyan-600' }
];

export const INFO_DATA: InfoItem[] = [
  // Education
  { id: 'e1', categoryId: 'edu', title: 'আমিনপুর উচ্চ বিদ্যালয়', type: 'মাধ্যমিক', address: 'আমিনপুর বাজার, পাবনা', established: '১৯৪৫', phone: '০১৭০০-০০০০০০', mapLink: '#' },
  { id: 'e2', categoryId: 'edu', title: 'আমিনপুর সরকারি প্রাথমিক বিদ্যালয়', type: 'প্রাথমিক', address: 'আমিনপুর, পাবনা', established: '১৯৩০', phone: '০১৮০০-০০০০০০' },
  { id: 'e3', categoryId: 'edu', title: 'আমিনপুর দাখিল মাদ্রাসা', type: 'মাদ্রাসা', address: 'আমিনপুর উত্তর পাড়া', established: '১৯৮০', phone: '০১৯০০-০০০০০০' },
  
  // Hospital
  { id: 'h1', categoryId: 'hosp', title: 'আমিনপুর উপ-স্বাস্থ্য কেন্দ্র', type: 'সরকারি', address: 'থানা সংলগ্ন, আমিনপুর', phone: '০১৬০০-০০০০০০', details: 'সাধারণ চিকিৎসা ও টিকা প্রদান' },
  { id: 'h2', categoryId: 'hosp', title: 'মা ও শিশু ক্লিনিক', type: 'বেসরকারি', address: 'বাজার মোড়, আমিনপুর', phone: '০১৫০০-০০০০০০', details: '২৪ ঘণ্টা ডেলিভারি সুবিধা' },

  // Doctors
  { id: 'd1', categoryId: 'doc', title: 'ডাঃ মোঃ আব্দুল কুদ্দুস', specialty: 'মেডিসিন বিশেষজ্ঞ', address: 'আমিনপুর ফার্মেসি মার্কেট', timing: 'বিকাল ৪টা - রাত ৮টা', phone: '০১৭১১-২২৩৩৪৪' },

  // Emergency
  { id: 'em1', categoryId: 'emergency', title: 'আমিনপুর থানা', address: 'আমিনপুর বাজার', phone: '০১৩২০-১২৩৪৫৬', details: 'পুলিশি সহায়তা' },
  { id: 'em2', categoryId: 'emergency', title: 'ফায়ার সার্ভিস (কাশিনাথপুর)', address: 'কাশিনাথপুর বাজার', phone: '০৯৯৯-৯৯৯৯৯৯', details: 'অগ্নিনির্বাপক ও উদ্ধার' },
  
  // Transport
  // Added address property to fix type errors
  { id: 't1', categoryId: 'trans', title: 'পাবনা এক্সপ্রেস', route: 'পাবনা - ঢাকা', timing: 'সকাল ৬টা - রাত ১১টা', phone: '০১৭১২-৩৪৫৬৭৮', type: 'লং রুট', address: 'পাবনা বাস টার্মিনাল' },
  { id: 't2', categoryId: 'trans', title: 'লোকাল অটো সার্ভিস', route: 'আমিনপুর - কাজিরহাট', timing: 'সারাদিন', phone: 'N/A', type: 'শর্ট রুট', address: 'আমিনপুর অটো স্ট্যান্ড' }
];

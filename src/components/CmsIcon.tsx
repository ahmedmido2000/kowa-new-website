'use client';

import React from 'react';
import {
  Award,
  Banknote,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Percent,
  Phone,
  Receipt,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Zap,
  type LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  ShieldCheck,
  Smartphone,
  MapPin,
  Car,
  DollarSign,
  Sparkles,
  UserCheck,
  HeartHandshake,
  Shield,
  CheckCircle: CheckCircle2,
  CheckCircle2,
  CreditCard,
  Receipt,
  Users,
  Clock,
  Wallet,
  TrendingUp,
  Star,
  Percent,
  Banknote,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Award,
  Navigation,
  Zap,
};

interface CmsIconProps extends Omit<LucideProps, 'name'> {
  name?: string | null;
}

export function CmsIcon({ name, ...props }: CmsIconProps) {
  const Component = (name && ICON_MAP[name]) || Sparkles;
  return <Component {...props} />;
}

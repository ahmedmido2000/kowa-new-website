'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DollarSign, Shield, HeartHandshake, CheckCircle, Sparkles, UserCheck } from 'lucide-react';

export const ValuePillars: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const pillars = [
    {
      id: 1,
      icon: DollarSign,
      title: isAr ? 'لا تسعير مفاجئ في الذروة' : 'Zero Surge Pricing in Rush Hours',
      badge: isAr ? 'سعر عادل' : 'Fair Fare',
      badgeColor: 'bg-brand-lime text-neutral-900',
      description: isAr
        ? 'شفافية مطلقة وتثبيت للسعر مهما اشتد الزحام أو ساعات المطر. الرقم الذي تراه في التطبيق عند التأكيد هو المبلغ الفعلي المستحق دون مضاعفات غير مبررة.'
        : 'Absolute transparency with 100% price lock regardless of traffic congestion or rain. The fare shown at booking is the exact amount charged—no sudden multipliers.',
      featureText: isAr ? 'ضمان السعر الثابت 100%' : '100% Fixed Fare Guarantee',
      featureIcon: CheckCircle,
    },
    {
      id: 2,
      icon: Sparkles,
      title: isAr ? 'أسطول معتمد ومكيف 2023+' : 'Modern 2023+ Fleet with Supreme AC',
      badge: isAr ? 'طراز حديث' : 'Modern Models',
      badgeColor: 'bg-neutral-200 text-neutral-800',
      description: isAr
        ? 'سيارات حديثة لا يتجاوز عمرها سنتين، تخضع لفحص دوري أسبوعي ونظافة يومية فائقة، مع تكييف مثالي ملائم لصيف المملكة وشواحن مجانية لكل راكب.'
        : 'Vehicles under 2 years old, undergoing rigorous weekly mechanical inspections and daily sanitization, optimized for Saudi summer climate with complimentary chargers.',
      featureText: isAr ? 'تعقيم وضيافة سعودية معطرة' : 'Scented Sanitization & Hospitality',
      featureIcon: HeartHandshake,
    },
    {
      id: 3,
      icon: UserCheck,
      title: isAr ? 'كباتن سعوديون نخبة' : 'Elite Verified Saudi Captains',
      badge: isAr ? 'معتمد 100%' : '100% Certified',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: isAr
        ? 'تدريب عالي على كرم الضيافة وأصول القيادة الآمنة والخصوصية التامة. جميع الكباتن خضعوا لفحص أمني وطبي ولديهم سجل قيادة نظيف وموثق.'
        : 'Thoroughly vetted with background checks, professional hospitality training, and safe driving records. Complete dedication to family privacy and respect.',
      featureText: isAr ? 'احترام تام للخصوصية العائلية' : 'Full Respect for Family Privacy',
      featureIcon: Shield,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white" id="value-pillars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-brand tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/10">
            {isAr ? 'ميثاق كوا للتنقل' : 'The KOWA Mobility Charter'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mt-3 mb-4">
            {isAr ? 'لماذا يختار عملاء المملكة كوا بديلاً ذكياً؟' : 'Why Commuters Across KSA Choose KOWA'}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'بنينا كوا لتقديم معادلة واضحة: أعلى مستويات الجودة والنظافة، مع تسعيرة عادلة لا تتبدل عند تغير الأحوال الجوية أو ذروة الخروج.'
              : 'Built to deliver a straightforward promise: pristine vehicle comfort and dependable Saudi hospitality with transparent pricing that never surges.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            const FeatureIcon = pillar.featureIcon;
            return (
              <div
                key={pillar.id}
                className="p-8 rounded-3xl bg-neutral-50/70 border border-neutral-200 hover:border-brand/30 hover:bg-white hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand text-brand-lime flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-neutral-900">{pillar.title}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">{pillar.description}</p>
                </div>
                <div className="pt-4 border-t border-neutral-200/60 flex items-center gap-2 text-xs font-bold text-brand">
                  <FeatureIcon className="w-4 h-4 text-brand" />
                  <span>{pillar.featureText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, Phone, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const FaqPage: React.FC = () => {
  const { lang, t, deliveryAreas, formatPrice } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">{t.faq.title}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">{t.faq.subtitle}</p>
      </div>

      {/* Dhaka Delivery Zones Table */}
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-300" />
          <h2 className="font-display text-lg font-bold">{t.faq.zonesTitle}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">{t.faq.colArea}</th>
                <th className="px-6 py-3 font-semibold">{t.faq.colEta}</th>
                <th className="px-6 py-3 font-semibold">{t.faq.colFee}</th>
                <th className="px-6 py-3 font-semibold">{t.faq.colFree}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveryAreas.map((area) => (
                <tr key={area.id} className="hover:bg-emerald-50/40">
                  <td className="px-6 py-3.5 font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    {lang === 'bn' ? area.nameBn : area.name}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    {lang === 'bn' ? area.etaBn : area.eta}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900 tabular-nums">
                    {formatPrice(area.fee)}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-emerald-800 tabular-nums">
                    {formatPrice(area.freeThreshold)}+
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Accordion FAQs */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-3">
          {t.faq.faqHeading}
        </h2>
        {t.faq.items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-semibold text-slate-900 hover:bg-slate-50 cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">{t.faq.helpTitle}</p>
          <p className="text-sm text-slate-700">
            {t.faq.helpDescPrefix}{' '}
            <a href="tel:01722371905" className="font-bold text-emerald-800 underline">
              {formatNum('01722371905', lang)}
            </a>{' '}
            {t.faq.helpDescMid}
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold self-start sm:self-auto"
        >
          <Phone className="w-4 h-4 text-amber-300" />
          {t.faq.shopNow}
        </Link>
      </div>
    </div>
  );
};

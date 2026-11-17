import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const ContactPage: React.FC = () => {
  const { pushToast, lang, t } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      pushToast({
        title: t.contact.formError,
        tone: 'warning',
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || t.contact.formError);
      }
      setSubmitted(true);
      pushToast({
        title: t.contact.toastTitle,
        detail: t.contact.toastDetail,
        tone: 'success',
      });
    } catch (err) {
      pushToast({
        title: (err as Error).message || t.contact.formError,
        tone: 'warning',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="max-w-2xl mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          {t.contact.badge}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
          {t.contact.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">{t.contact.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {t.contact.hubHeading}
            </h2>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.contact.locationLabel}
                </p>
                <p className="font-semibold text-slate-900 mt-0.5">{t.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.contact.helplineLabel}
                </p>
                <a
                  href="tel:01722371905"
                  className="font-bold text-lg text-emerald-800 hover:underline mt-0.5 inline-block tabular-nums"
                >
                  {formatNum('01722371905', lang)}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.contact.emailLabel}
                </p>
                <a
                  href="mailto:hello@avadogrocery.com"
                  className="font-semibold text-slate-900 hover:text-emerald-800 mt-0.5 inline-block"
                >
                  hello@avadogrocery.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.contact.hoursLabel}
                </p>
                <p className="font-semibold text-slate-900 mt-0.5">{t.contact.hoursValue}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href="tel:01722371905"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                {t.contact.callBtn}
              </a>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold"
              >
                <Truck className="w-4 h-4 text-emerald-700" />
                {t.contact.faqBtn}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-950 text-white p-6 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {t.contact.coverageTitle}
            </p>
            <p className="text-sm text-emerald-100 leading-relaxed">{t.contact.coverageDesc}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-slate-900">{t.contact.formTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">{t.contact.formNote}</p>

            {submitted ? (
              <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {t.contact.successTitle}
                </h3>
                <p className="text-sm text-slate-600">
                  {t.contact.successDescPrefix}{' '}
                  <a href="tel:01722371905" className="font-bold text-emerald-800 underline">
                    {formatNum('01722371905', lang)}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold cursor-pointer"
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.contact.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contact.emailOptLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting
                    ? lang === 'bn'
                      ? 'পাঠানো হচ্ছে...'
                      : 'Sending...'
                    : t.contact.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

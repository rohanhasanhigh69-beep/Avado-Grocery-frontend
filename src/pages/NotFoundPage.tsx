import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const NotFoundPage: React.FC = () => {
  const { lang, t } = useStore();

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
        {formatNum('404', lang)}
      </p>
      <h1 className="font-display text-3xl font-bold text-slate-900">{t.notFound.title}</h1>
      <p className="text-sm text-slate-600">{t.notFound.desc}</p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
};

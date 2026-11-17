import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Leaf, Mail, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatNum } from '../i18n/translations';

export const Footer: React.FC = () => {
  const { lang, t, categories } = useStore();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Business Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5" aria-hidden="true" />
              </span>
              <span className="font-display">{t.brandName}</span>
            </Link>
            <p className="text-sm text-emerald-200/85 leading-relaxed">{t.footer.about}</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.footer.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                <a
                  href="tel:01722371905"
                  className="hover:text-amber-300 transition-colors font-semibold tabular-nums"
                >
                  {lang === 'bn' ? '০১৭২২৩৭১৯০৫' : '01722371905'}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:support@avadogrocery.com"
                  className="hover:text-amber-300 transition-colors"
                >
                  support@avadogrocery.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                <span>{t.footer.hours}</span>
              </p>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              {t.footer.popularAisles}
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm text-emerald-200/85">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {lang === 'bn' ? cat.nameBn : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              {t.footer.customerService}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-200/85">
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition-colors">
                  {t.footer.catalogLink}
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-amber-300 transition-colors">
                  {t.footer.dealsLink}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-amber-300 transition-colors">
                  {t.footer.wishlistLink}
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-amber-300 transition-colors">
                  {t.footer.checkoutLink}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  {t.footer.faqLink}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  {t.footer.contactLink}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-300 transition-colors">
                  {lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">{t.footer.deliveryTitle}</h3>
            <p className="text-sm text-emerald-200/85 leading-relaxed">{t.footer.deliveryDesc}</p>
            <div className="text-xs text-emerald-200 space-y-1.5">
              <p className="font-semibold text-amber-300">{t.footer.acceptedPaymentsTitle}</p>
              <p>{t.footer.acceptedPaymentsList}</p>
              <p>{t.footer.pricesNote}</p>
            </div>
            <div className="flex items-center gap-3 pt-1 text-xs">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 transition-colors"
              >
                Instagram
              </a>
              <a
                href="tel:01722371905"
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors"
              >
                {t.footer.callNow}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
          <p>
            © {formatNum(new Date().getFullYear(), lang)} {t.footer.copyright}
          </p>
          <p>{t.footer.showcaseNote}</p>
        </div>
      </div>
    </footer>
  );
};

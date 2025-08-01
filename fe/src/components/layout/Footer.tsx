import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  // Dynamic navigation links with translations
  const quickLinks = [
    { name: t('footer.links.home'), path: '/' },
    { name: t('footer.links.shop'), path: '/shop' },
    { name: t('footer.links.categories'), path: '/categories' },
    { name: t('footer.links.deals'), path: '/deals' },
    { name: t('footer.links.newArrivals'), path: '/new-arrivals' },
    { name: t('footer.links.bestSellers'), path: '/best-sellers' },
  ];

  const customerServiceLinks = [
    { name: t('footer.links.contactUs'), path: '/contact' },
    { name: t('footer.links.faqs'), path: '/faqs' },
    { name: t('footer.links.shippingReturns'), path: '/shipping-returns' },
    { name: t('footer.links.orderTracking'), path: '/track-order' },
    { name: t('footer.links.privacyPolicy'), path: '/privacy-policy' },
    { name: t('footer.links.termsConditions'), path: '/terms' },
  ];

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 pt-12 pb-6">
      <div className="container mx-auto">
        {/* Newsletter */}
        {/* <div className="bg-primary-500 dark:bg-primary-600 rounded-xl p-8 mb-12 text-center md:text-left">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-white dark:text-neutral-900 text-2xl font-bold mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-primary-100 dark:text-primary-900">
                Get the latest updates, deals and exclusive offers directly to
                your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg mb-3 sm:mb-0 sm:mr-2 sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-neutral-900"
              />
              <Button variant="secondary" className="sm:rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div> */}

        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company info */}
          <div>
            <h4 className="text-neutral-800 dark:text-neutral-100 font-bold text-lg mb-4">
              BadmintonShop
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {social === 'facebook' && (
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    )}
                    {social === 'twitter' && (
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    )}
                    {social === 'instagram' && (
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    )}
                    {social === 'youtube' && (
                      <path
                        fillRule="evenodd"
                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-neutral-800 dark:text-neutral-100 font-bold text-lg mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-neutral-800 dark:text-neutral-100 font-bold text-lg mb-4">
              {t('footer.customerService')}
            </h4>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-neutral-800 dark:text-neutral-100 font-bold text-lg mb-4">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t('footer.address')}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300">
                  leeminhkang@gmail.com
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300">
                  +84 877748444
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t('footer.workingHours.weekdays')}
                  <br />
                  {t('footer.workingHours.weekends')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BadmintonShop. {t('footer.copyright')}
          </p>
          <div className="flex items-center flex-wrap justify-center gap-4">
            <img
              src="/images/payment-icons/visa.png"
              alt="Visa"
              className="h-5 object-contain"
            />
            <img
              src="/images/payment-icons/mastercard.png"
              alt="Mastercard"
              className="h-5 object-contain"
            />
            <img
              src="/images/payment-icons/paypal.png"
              alt="PayPal"
              className="h-5 object-contain"
            />
            <img
              src="/images/payment-icons/applepay.png"
              alt="Apple Pay"
              className="h-5 object-contain"
            />
            <img
              src="/images/payment-icons/momo.png"
              alt="MoMo"
              className="h-5 object-contain"
            />
            <img
              src="/images/payment-icons/zalopay.png"
              alt="ZaloPay"
              className="h-5 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

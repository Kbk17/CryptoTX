import { DOCS_URL, BLOG_URL } from '../../shared/constants';
import daBoiAvatar from '../static/da-boi.png';
import avatarPlaceholder from '../static/avatar-placeholder.png';

export const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Open platform', href: DOCS_URL },
];
export const features = [
  {
    name: 'Secure Transactions',
    description: 'Enjoy peace of mind with state-of-the-art security measures protecting every transaction.',
    icon: '🔐',
    href: DOCS_URL,
  },
  {
    name: 'Popular Currencies',
    description: 'Access a wide variety of popular FIAT and cryptocurrencies including Bitcoin (BTC), Tether (USDT), Euro (EUR) and many more.',
    icon: '💰',
    href: DOCS_URL,
  },
  {
    name: 'Ease of Use',
    description: 'Our intuitive platform makes buying cryptocurrency easy, even for beginners.',
    icon: '👌',
    href: DOCS_URL,
  },
  {
    name: 'Fast Transactions',
    description: 'Experience quick transaction processing times, so you can invest when the timing is just right.',
    icon: '⚡',
    href: DOCS_URL,
  },
  {
    name: 'Multiple Payment Methods',
    description: 'Flexibility with numerous payment options to suit your needs including wire transfers.',
    icon: '💳',
    href: DOCS_URL,
  },
  {
    name: 'Reliable Service',
    description: 'Count on our reliable platform to be available when you need it, with 24/7 support.',
    icon: '🤝',
    href: DOCS_URL,
  },
];

export const testimonials = [
  {
    name: 'Registration and Verification',
    role: 'Step 1',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'Sign up and go through a quick verification process to secure your account.',
  },
  {
    name: 'Make and Pay for Transaction',
    role: 'Step 2',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'Place your transaction and pay using a method that suits you best.',
  },
  {
    name: 'Enjoy Your Currency Purchase',
    role: 'Step 3',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'Enjoy your cryptocurrency purchase, securely added to your wallet.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'How can I start buying cryptocurrency on BorCash X Midas Exchange?',
    answer: 'To start purchasing cryptocurrency, simply register an account, complete the verification process, and then you can immediately begin buying popular cryptocurrencies like BTC and USDT using a variety of payment methods.',
  },
  {
    id: 2,
    question: 'What payment methods are accepted?',
    answer: 'We accept payments through bank transfers and several digital payment platforms. You can make payments in various currencies such as Euro (EUR), US Dollar (USD), and Polish Zloty (PLN), providing you with flexibility and convenience.',
  },
  {
    id: 3,
    question: 'Is my personal information secure?',
    answer: 'Yes, your security is our top priority. We implement advanced security measures including SSL encryption and two-factor authentication to protect your personal information and transactions.',
  },
  {
    id: 4,
    question: 'How long do transactions take to process?',
    answer: 'Transaction times can vary depending on network activity and the specific cryptocurrency, but we strive to process transactions as swiftly as possible, typically within minutes.',
  },
  {
    id: 5,
    question: 'Can I access support if I encounter problems?',
    answer: 'Absolutely! Our customer support team is available 24/7 to assist you with any questions or issues. You can reach us through our support portal or by email.',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Open platform', href: DOCS_URL },
  ],
  company: [
    { name: 'About', href: 'https://wasp-lang.dev' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

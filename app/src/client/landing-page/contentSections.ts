import { SIGNUP_PAGE, BLOG_URL } from '../../shared/constants';
import walleticon from '../static/walleticon.svg';
import lightningicon from '../static/lightningicon.svg';
import addusericon from '../static/addusericon.svg';



export const navigation = [
  { name: 'Why Choose Us?', href: '#features' },
  { name: 'Assets', href: '/pricing' },
  { name: 'Open account', href: SIGNUP_PAGE },
];
export const features = [
  {
    name: 'Secure Transactions',
    description: 'Enjoy peace of mind with state-of-the-art security measures protecting every transaction.',
    icon: '🔐',
    href: SIGNUP_PAGE,
  },
  {
    name: 'Popular Currencies',
    description: 'Access a wide variety of popular FIAT and cryptocurrencies including Tether (USDT), Euro (EUR), Polish zloty (PLN) and many more.',
    icon: '💰',
    href: SIGNUP_PAGE,
  },
  {
    name: 'Ease of Use',
    description: 'Our intuitive platform makes buying cryptocurrency easy, even for beginners.',
    icon: '👌',
    href: SIGNUP_PAGE,
  },
  {
    name: 'Fast Transactions',
    description: 'Experience quick transaction processing times, so you can invest when the timing is just right.',
    icon: '⚡',
    href: SIGNUP_PAGE,
  },
  {
    name: 'Cash and wire transfers',
    description: 'Flexibility with numerous payment options to suit your needs including wire transfers and cash deposits in our points of sale.',
    icon: '💳',
    href: SIGNUP_PAGE,
  },
  {
    name: 'Reliable Service',
    description: 'Count on our reliable platform to be available when you need it, with 9 AM to 5 PM on business days support.',
    icon: '🤝',
    href: SIGNUP_PAGE,
  },
];

export const testimonials = [
  {
    name: 'Registration and Verification',
    role: 'Step 1',
    avatarSrc: addusericon,
    socialUrl: '',
    quote: 'Sign up and go through a quick verification process to secure your account.',
  },
  {
    name: 'Create Your Transaction and Pay Seamlessly',
    role: 'Step 2',
    avatarSrc: lightningicon,
    socialUrl: '',
    quote: 'Initiate your transaction and ensure its funded to secure your purchase.',
  },
  {
    name: 'Enjoy Your Currency Purchase',
    role: 'Step 3',
    avatarSrc: walleticon,
    socialUrl: '',
    quote: 'Enjoy your cryptocurrency purchase, securely added to your wallet.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'How can I start buying cryptocurrency on BorCash X Midas Exchange?',
    answer: 'To start purchasing cryptocurrency, simply register an account, complete the verification process, and then you can immediately begin buying popular cryptocurrencies like USDT using a variety of payment methods.',
  },
  {
    id: 2,
    question: 'What payment methods are accepted?',
    answer: 'We accept payments through bank transfers and several digital payment platforms. You can make payments in various currencies such as Euro (EUR), US Dollar (USD), and Polish Zloty (PLN), providing you with flexibility and convenience.',
  },
  {
    id: 3,
    question: 'Is my personal information secure?',
    answer: 'Yes, your security is our top priority. We are committed to protect your personal information and transactions. The data processed is collected solely for verification purposes. Verification is conducted using dedicated tools to ensure your privacy and security',
  },
  {
    id: 4,
    question: 'How long do transactions take to process?',
    answer: 'Transaction processing times may vary based on the accounting period and the payment method selected. Our platform is crafted with user-friendliness in mind, yet we are committed to ensuring that transactions are processed as promptly as possible. It is important to note that payments will be executed immediately upon the successful crediting of funds in the bank.',
  },
  {
    id: 5,
    question: 'Can I access support if I encounter problems?',
    answer: 'Absolutely! Our customer support team is available 9 AM to 5 PM on business days to assist you with any questions or issues. You can reach us through our support portal or by email.',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Open Platform', href: SIGNUP_PAGE },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

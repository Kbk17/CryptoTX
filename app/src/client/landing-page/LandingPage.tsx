import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import { BiLogIn } from 'react-icons/bi';
import logo from '../static/logo.png';
import banerCrypto  from '../static/baner_crypto.png';
import { features, navigation, faqs, footerNavigation, testimonials } from './contentSections';
import DropdownUser from '../components/DropdownUser';
import { SIGNUP_PAGE } from '../../shared/constants';
import { UserMenuItems } from '../components/UserMenuItems';
import DarkModeSwitcher from '../admin/components/DarkModeSwitcher';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useAuth();

  const NavLogo = () => <img className='h-8 w-8' src={logo} alt='BorCash X Midas Exchange' />;

  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      {/* Header */}
      <header className='absolute inset-x-0 top-0 z-50 dark:bg-boxdark-2'>
        <nav className='flex items-center justify-between p-6 lg:px-8' aria-label='Global'>
          <div className='flex items-center lg:flex-1'>
            <a
              href='/'
              className='flex items-center -m-1.5 p-1.5 text-gray-900 duration-300 ease-in-out hover:text-yellow-500'
            >
              <NavLogo />
              <span className='ml-2 text-sm font-semibold leading-6 dark:text-white'>BORCASH</span>
            </a>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <HiBars3 className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:text-yellow-500 dark:text-white'
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:align-end'>
            {/* <!-- Dark Mode Toggler --> */}
            <div className='flex items-center gap-3 2xsm:gap-7'>
              <ul className='flex justify-center items-center gap-2 2xsm:gap-4'>
                <DarkModeSwitcher />
              </ul>
              {isUserLoading ? null : !user ? (
                <Link to='/login'>
                  <div className='flex justify-end items-center duration-300 ease-in-out text-gray-900 hover:text-yellow-500 dark:text-white'>
                    Log in <BiLogIn size='1.1rem' className='ml-1' />
                  </div>
                </Link>
              ) : (
                <DropdownUser user={user} />
              )}
            </div>
          </div>
        </nav>
        <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className='fixed inset-0 z-50' />
          <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-boxdark dark:text-white'>
            <div className='flex items-center justify-between'>
              <a href='/' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Your SaaS</span>
                <NavLogo />
              </a>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-50'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/10'>
                <div className='space-y-2 py-6'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-boxdark-2'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className='py-6'>
                  {isUserLoading ? null : !user ? (
                    <Link to='/login'>
                      <div className='flex justify-start items-center duration-300 ease-in-out text-gray-900 hover:text-yellow-500 dark:text-white'>
                        Log in <BiLogIn size='1.1rem' className='ml-1' />
                      </div>
                    </Link>
                  ) : (
                    <UserMenuItems user={user} />
                  )}
                </div>
                <div className='py-6'>
                  <DarkModeSwitcher />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className='isolate dark:bg-boxdark-2'>
        {/* Hero section */}
        <div className='relative pt-14 w-full '>
          <div
            className='absolute top-0 right-0 -z-10 transform-gpu overflow-hidden w-full blur-3xl sm:top-0 '
            aria-hidden='true'
          >
            <div
              className='aspect-[1020/880] w-[55rem] flex-none sm:right-1/4 sm:translate-x-1/2 dark:hidden bg-gradient-to-tr from-amber-400 to-purple-300 opacity-40'
              style={{
                clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
              }}
            />
          </div>
          <div
            className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] -z-10 transform-gpu overflow-hidden blur-3xl'
            aria-hidden='true'
          >
            <div
              className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 dark:hidden bg-gradient-to-br from-amber-400 to-purple-300  opacity-50 w-[72.1875rem]'
              style={{
                clipPath: 'ellipse(80% 30% at 80% 50%)',
              }}
            />
          </div>
          <div className='py-24 sm:py-32'>
            <div className='mx-auto max-w-8xl px-6 lg:px-8'>
              <div className='lg:mb-18 mx-auto max-w-3xl text-center'><h1 className='text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white'>
                    BorCash <span className='italic'>X</span> Midas Exchange
                    </h1>
                      <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
                        Embark on a seamless journey into the world of cryptocurrency with <strong>BorCash</strong> in collaboration with <strong>Midas Exchange</strong>. Sign up, get verified, and start purchasing cryptocurrency with ease. Choose your currency, select a payment method, and acquire the crypto you need — it's that simple!
                        </p>

                <div className='mt-10 flex items-center justify-center gap-x-6'>
                  <a
                    href={SIGNUP_PAGE}
                    className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-yellow-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
                  >
                    Get Started  <span aria-hidden='true'>→</span>
                  </a>
                </div>
              </div>
              <div className='mt-14 flow-root sm:mt-14 '>
                <div className='-m-2 rounded-xl  lg:-m-4 lg:rounded-2xl lg:p-4'>
                  <img
                    src={banerCrypto}
                    alt='App screenshot'
                    width={2432}
                    height={1442}
                    className='rounded-md shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Feature section */}
        <div id='features' className='mx-auto mt-48 max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
           <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
              Unleashing <span className='text-yellow-500'>Top</span> Features for Effortless Transactions
           </p>
            <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-white'>
               Experience seamless, secure, and rapid transactions.
              <br /> We make buying and managing cryptocurrencies easy.
           </p>
          </div>
          <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
            <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
              {features.map((feature) => (
                <div key={feature.name} className='relative pl-16'>
                  <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
                    <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center border border-yellow-400 bg-yellow-100/50 dark:bg-boxdark rounded-lg'>
                      <div className='text-2xl'>{feature.icon}</div>
                    </div>
                    {feature.name}
                  </dt>
                  <dd className='mt-2 text-base leading-7 text-gray-600 dark:text-white'>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Process */}
        <div className='mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8'>
          <div className='relative sm:left-5 -m-2 rounded-xl bg-yellow-400/20 lg:ring-1 lg:ring-yellow-500/50 lg:-m-4 '>
            <div className='relative sm:top-5 sm:right-5 bg-gray-900 dark:bg-boxdark px-8 py-20 shadow-xl sm:rounded-xl sm:px-10 sm:py-16 md:px-12 lg:px-20'>
              <h2 className='text-left text-xl font-semibold tracking-wide leading-7 text-gray-500 dark:text-white'>
                How to get started
              </h2>
              <div className='relative flex flex-wrap gap-6 w-full mt-6 z-10 justify-between lg:mx-0'>
                {testimonials.map((testimonial) => (
                  
                  <figure className='w-full lg:w-1/4 box-content flex flex-col justify-between p-8 rounded-xl bg-gray-500/5 '>
                    <figcaption className='mt-6 text-base text-white'>
                      <a href={testimonial.socialUrl} className='flex items-center gap-x-2'>
                        <img src={testimonial.avatarSrc} className='h-12 w-12 rounded-full' />
                        <div>
                          <div className='mt-1'>{testimonial.role}</div>
                          <div className='font-semibold hover:underline'>{testimonial.name}</div>
                        </div>
                      </a>
                    </figcaption>
                    <blockquote className='text-lg text-white sm:text-md sm:leading-8'>
                      <p>{testimonial.quote}</p>
                    </blockquote>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className='mt-32 mx-auto max-w-2xl divide-y divide-gray-900/10 dark:divide-gray-200/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:py-32'>
         <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
           Frequently asked questions
         </h2>
         <dl className='mt-10 space-y-8 divide-y divide-gray-900/10'>
           {faqs.map((faq) => (
             <div key={faq.id} className='pt-8 lg:grid lg:grid-cols-12 lg:gap-8'>
               <dt className='text-base font-semibold leading-7 text-gray-900 lg:col-span-5 dark:text-white'>
                 {faq.question}
               </dt>
                     <dd className='mt-4 lg:col-span-7 lg:mt-0'>
                <p className='text-base leading-7 text-gray-600 dark:text-white'>{faq.answer}</p>
               </dd>
             </div>
                 ))}
         </dl>
  </div>
</main>

      {/* Footer */}
      <div className='mx-auto mt-6 max-w-7xl px-6 lg:px-8 dark:bg-boxdark-2'>
        <footer
          aria-labelledby='footer-heading'
          className='relative border-t border-gray-900/10 dark:border-gray-200/10 py-24 sm:mt-32'
        >
          <h2 id='footer-heading' className='sr-only'>
            Footer
          </h2>
          <div className='flex items-start justify-end mt-10 gap-20'>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>App</h3>
              <ul role='list' className='mt-6 space-y-4'>
                {footerNavigation.app.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>Company</h3>
              <ul role='list' className='mt-6 space-y-4'>
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
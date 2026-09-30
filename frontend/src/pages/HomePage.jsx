import Hero from '../components/landing/Hero';
import Partners from '../components/landing/Partners';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import Services from '../components/landing/Services';
import HowItWorks from '../components/landing/HowItWorks';
import Industries from '../components/landing/Industries';
import QuoteForm from '../components/landing/QuoteForm';
import Testimonials from '../components/landing/Testimonials';
import Insights from '../components/landing/Insights';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import './HomePage.css';

const HomePage = () => (
  <div className="landing">
    <Hero />
    <Partners />
    <WhyChooseUs />
    <Services />
    <HowItWorks />
    <Industries />
    <QuoteForm />
    <Testimonials />
    <Insights />
    <FAQ />
    <CTA />
  </div>
);

export default HomePage;

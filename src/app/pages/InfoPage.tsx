import { useEffect } from "react";
import { useLocation } from "react-router";
import { motion } from "motion/react";
import {
  BRAND_NAME,
  BUSINESS_EMAIL,
} from "../components/BrandLogo";

/* ────────── shared styles ────────── */
const eyebrow: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.72rem",
  letterSpacing: "0.25em",
  color: "var(--rose-gold)",
  textTransform: "uppercase",
  fontWeight: 500,
};
const heading: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
  fontWeight: 600,
  color: "var(--foreground)",
  lineHeight: 1.2,
};
const body: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  color: "rgba(240,232,208,0.7)",
  lineHeight: 1.75,
  fontWeight: 300,
};
const subheading: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "var(--foreground)",
  marginBottom: "12px",
};
const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #13100A, #1A1500)",
  border: "1px solid rgba(201,168,76,0.18)",
  borderRadius: "1.5rem",
  padding: "2rem",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};

/* ────────── page content data ────────── */
interface Section {
  title: string;
  content: string;
}

interface PageData {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Section[];
}

const pages: Record<string, PageData> = {
  "/shipping-info": {
    eyebrow: "✦ Delivery ✦",
    title: "Shipping Information",
    subtitle: `At ${BRAND_NAME}, we ensure your precious jewelry arrives safely and on time.`,
    sections: [
      { title: "Domestic Shipping", content: "We offer free standard shipping on all orders above Rs. 5,000 across Pakistan. Standard delivery takes 3–5 business days. Express shipping is available for Rs. 350 with 1–2 business day delivery." },
      { title: "Packaging", content: "Every piece is carefully wrapped in our signature luxury gift box with a velvet pouch, ensuring your jewelry arrives in perfect condition — ready to gift or treasure." },
      { title: "Order Tracking", content: "Once your order ships, you'll receive a confirmation email with a tracking number. You can track your package in real-time through our order history page." },
      { title: "International Shipping", content: "We currently ship within Pakistan only. International shipping options are coming soon. Sign up for our newsletter to be the first to know." },
    ],
  },
  "/returns": {
    eyebrow: "✦ Easy Returns ✦",
    title: "Returns & Exchanges",
    subtitle: "We want you to love every piece. If you're not completely satisfied, we're here to help.",
    sections: [
      { title: "30-Day Return Policy", content: "You may return any unworn, undamaged item within 30 days of delivery for a full refund or exchange. Items must be in their original packaging with all tags attached." },
      { title: "How to Return", content: "Contact our support team via email or WhatsApp with your order number. We'll provide a prepaid return label and guide you through the process." },
      { title: "Refund Processing", content: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method." },
      { title: "Exchanges", content: "Want a different size or style? We offer free exchanges on all orders. Simply initiate a return and place a new order, or contact our team for assistance." },
    ],
  },
  "/size-guide": {
    eyebrow: "✦ Perfect Fit ✦",
    title: "Size Guide",
    subtitle: "Find your perfect fit with our comprehensive sizing guide for all jewelry categories.",
    sections: [
      { title: "Ring Sizing", content: "Wrap a thin strip of paper around the base of your finger. Mark where the paper overlaps and measure the length in millimeters. Compare with our ring size chart: Size 5 (49mm), Size 6 (52mm), Size 7 (54mm), Size 8 (57mm), Size 9 (60mm)." },
      { title: "Bracelet & Bangle Sizing", content: "Measure your wrist with a flexible tape measure just above the wrist bone. Add 1–2cm for a comfortable fit. Our standard bracelet sizes: Small (16cm), Medium (18cm), Large (20cm)." },
      { title: "Necklace Lengths", content: "Choker: 35–40cm sits close to the neck. Princess: 43–48cm the most popular length. Matinee: 50–60cm falls at the bust. Opera: 70–85cm for dramatic styling." },
      { title: "Need Help?", content: "If you're unsure about sizing, our jewelry consultants are happy to help. Contact us via WhatsApp or email for personalized sizing advice." },
    ],
  },
  "/care-instructions": {
    eyebrow: "✦ Jewelry Care ✦",
    title: "Care Instructions",
    subtitle: "Proper care ensures your jewelry stays beautiful for years to come.",
    sections: [
      { title: "Daily Care", content: "Remove jewelry before showering, swimming, exercising, or sleeping. Avoid contact with perfumes, lotions, hairspray, and household chemicals. Put jewelry on last when getting ready and take it off first when undressing." },
      { title: "Cleaning", content: "Gently clean your jewelry with a soft, lint-free cloth after each wear. For deeper cleaning, use warm water with mild soap, rinse thoroughly, and pat dry. Avoid ultrasonic cleaners on delicate pieces." },
      { title: "Storage", content: "Store each piece separately in the provided velvet pouch or a soft-lined jewelry box to prevent scratching. Keep jewelry in a cool, dry place away from direct sunlight." },
      { title: "Tarnish Prevention", content: "Store pieces with anti-tarnish strips. Avoid prolonged exposure to moisture and humidity. Wearing your jewelry regularly can actually help prevent tarnish as natural oils keep the metal polished." },
    ],
  },
  "/faq": {
    eyebrow: "✦ Questions ✦",
    title: "Frequently Asked Questions",
    subtitle: "Find answers to the most common questions about our jewelry and services.",
    sections: [
      { title: "Are your products real gold?", content: "Our collection features premium artificial and fashion jewelry crafted with high-quality materials including gold-plated brass, sterling silver, cubic zirconia, and semi-precious stones. Each piece is designed to deliver luxury aesthetics at accessible prices." },
      { title: "How long does delivery take?", content: "Standard delivery within Pakistan takes 3–5 business days. Express delivery (1–2 business days) is available for Rs. 350. Free shipping on orders above Rs. 5,000." },
      { title: "Can I return or exchange an item?", content: "Yes! We offer a 30-day return and exchange policy. Items must be unworn, undamaged, and in their original packaging. Contact our support team to initiate a return." },
      { title: "Do you offer gift wrapping?", content: "Every order comes in our signature luxury gift box with a velvet pouch — perfect for gifting. Custom gift messages can be added at checkout at no extra charge." },
      { title: "How can I track my order?", content: "Once your order ships, you'll receive an email with a tracking link. You can also check your order status anytime from your account's order history page." },
      { title: "Do you ship internationally?", content: "We currently deliver within Pakistan only. International shipping is coming soon. Subscribe to our newsletter to stay updated." },
    ],
  },
  "/about": {
    eyebrow: `✦ Our Brand ✦`,
    title: "About Us",
    subtitle: `${BRAND_NAME} — where elegance meets affordability. Discover our passion for creating stunning jewelry that celebrates every woman's unique beauty.`,
    sections: [
      { title: "Our Mission", content: "We believe every woman deserves to feel extraordinary. Our mission is to create beautifully crafted jewelry that empowers confidence, celebrates individuality, and makes luxury accessible to all." },
      { title: "Quality Craftsmanship", content: "Every piece in our collection is thoughtfully designed and crafted using premium materials. From the initial sketch to the final polish, our artisans pour dedication into creating jewelry that lasts." },
      { title: "Customer First", content: "With thousands of happy customers across Pakistan, we pride ourselves on exceptional service, fast delivery, and a seamless shopping experience. Your satisfaction is our top priority." },
      { title: "Sustainability", content: "We are committed to responsible practices. Our packaging is eco-friendly, and we continually work to minimize our environmental footprint while delivering premium quality." },
    ],
  },
  "/our-story": {
    eyebrow: "✦ Our Journey ✦",
    title: "Our Story",
    subtitle: `Every great brand begins with a vision. Here's how ${BRAND_NAME} came to be.`,
    sections: [
      { title: "The Beginning", content: "Founded with a simple belief — that luxury jewelry shouldn't come with a luxury price tag. We started as a small family-driven passion project, curating exquisite designs that capture the essence of modern elegance." },
      { title: "Growing Together", content: "What began as a handful of designs has blossomed into a comprehensive collection loved by thousands. Each piece tells a story of artistry, quality, and the timeless beauty of fine jewelry." },
      { title: "Looking Ahead", content: "We're constantly evolving — expanding our collections, embracing new designs, and finding innovative ways to bring you the finest jewelry at the best value. The journey is just beginning." },
    ],
  },
  "/careers": {
    eyebrow: "✦ Join Us ✦",
    title: "Careers",
    subtitle: `Be part of the ${BRAND_NAME} family. We're always looking for passionate individuals who share our love for beautiful jewelry.`,
    sections: [
      { title: "Why Work With Us", content: "At STYLISH FANCY JEWELRY, you'll join a creative, fast-paced team that values innovation, collaboration, and a passion for excellence. We offer competitive salaries, growth opportunities, and a supportive work environment." },
      { title: "Current Openings", content: `We're currently looking for talented individuals in design, marketing, customer support, and operations. Send your resume and portfolio to ${BUSINESS_EMAIL}.` },
      { title: "Internships", content: "We offer internship programs for students and recent graduates in fashion design, digital marketing, and e-commerce. Gain hands-on experience in the luxury jewelry industry." },
    ],
  },
  "/press": {
    eyebrow: "✦ In The News ✦",
    title: "Press & Media",
    subtitle: `Stay up to date with the latest news and features about ${BRAND_NAME}.`,
    sections: [
      { title: "Media Inquiries", content: `For press inquiries, collaborations, or media features, please reach out to our team at ${BUSINESS_EMAIL}. We're happy to provide high-resolution images, product samples, and brand information.` },
      { title: "Brand Assets", content: "Need our logo, product photography, or brand guidelines? Contact our media team and we'll provide a complete press kit tailored to your needs." },
      { title: "Collaborations", content: "We love working with influencers, bloggers, stylists, and media partners who share our passion for fashion and jewelry. Let's create something beautiful together." },
    ],
  },
  "/sustainability": {
    eyebrow: "✦ Our Commitment ✦",
    title: "Sustainability",
    subtitle: "We believe in creating beautiful jewelry while caring for our planet and communities.",
    sections: [
      { title: "Eco-Friendly Packaging", content: "All our packaging is made from recycled and recyclable materials. Our signature gift boxes are FSC-certified, and we use soy-based inks for printing. We're continuously working to reduce packaging waste." },
      { title: "Responsible Sourcing", content: "We carefully select suppliers who share our commitment to ethical practices. Our materials are sourced from verified suppliers who adhere to fair labor standards and environmentally responsible mining practices." },
      { title: "Giving Back", content: "A portion of every sale supports education initiatives for underprivileged communities in Pakistan. We believe in empowering the next generation through the power of education." },
    ],
  },
  "/privacy-policy": {
    eyebrow: "✦ Your Privacy ✦",
    title: "Privacy Policy",
    subtitle: `At ${BRAND_NAME}, we value your privacy and are committed to protecting your personal information.`,
    sections: [
      { title: "Information We Collect", content: "We collect personal information you provide when creating an account, placing an order, or subscribing to our newsletter. This includes your name, email address, shipping address, and payment details." },
      { title: "How We Use Your Data", content: "Your information is used to process orders, deliver products, improve our services, and send you relevant marketing communications (with your consent). We never sell your personal data to third parties." },
      { title: "Data Security", content: "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information." },
      { title: "Your Rights", content: `You have the right to access, correct, or delete your personal data at any time. Contact us at ${BUSINESS_EMAIL} for any privacy-related requests.` },
    ],
  },
  "/terms-of-service": {
    eyebrow: "✦ Terms ✦",
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using our website and services.",
    sections: [
      { title: "Acceptance of Terms", content: "By accessing and using the STYLISH FANCY JEWELRY website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
      { title: "Products & Pricing", content: "All product descriptions, images, and prices are as accurate as possible. We reserve the right to modify prices, discontinue products, or correct errors at any time without prior notice." },
      { title: "Orders & Payment", content: "By placing an order, you agree to provide accurate billing and shipping information. We accept major credit/debit cards, bank transfers, and cash on delivery. All payments are processed securely." },
      { title: "Limitation of Liability", content: "STYLISH FANCY JEWELRY shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability is limited to the amount paid for the product." },
    ],
  },
  "/cookie-policy": {
    eyebrow: "✦ Cookies ✦",
    title: "Cookie Policy",
    subtitle: "This policy explains how we use cookies and similar technologies on our website.",
    sections: [
      { title: "What Are Cookies?", content: "Cookies are small text files stored on your device when you visit our website. They help us provide a better browsing experience by remembering your preferences, login status, and shopping cart contents." },
      { title: "Types of Cookies We Use", content: "Essential cookies: Required for website functionality (cart, checkout, login). Analytics cookies: Help us understand how visitors use our site. Marketing cookies: Used to deliver relevant advertisements and offers." },
      { title: "Managing Cookies", content: "You can control cookies through your browser settings. Disabling essential cookies may affect website functionality. Most browsers allow you to block or delete cookies." },
      { title: "Contact Us", content: `If you have questions about our cookie practices, please contact us at ${BUSINESS_EMAIL}.` },
    ],
  },
};

/* ────────── component ────────── */
export default function InfoPage() {
  const { pathname } = useLocation();
  const data = pages[pathname];

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | ${BRAND_NAME}`;
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060400" }}>
        <p style={{ ...body, textAlign: "center" }}>Page not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" style={{ background: "#060400" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p style={eyebrow}>{data.eyebrow}</p>
          <h1 className="mt-3 mb-4" style={heading}>{data.title}</h1>
          <p
            style={{
              ...body,
              maxWidth: "560px",
              margin: "0 auto",
              fontSize: "1rem",
            }}
          >
            {data.subtitle}
          </p>
        </motion.div>

        {/* Content sections */}
        <div className="flex flex-col gap-6">
          {data.sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: "easeOut" }}
              style={cardStyle}
            >
              <h2 style={subheading}>{section.title}</h2>
              <p style={body}>{section.content}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

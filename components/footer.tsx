import {
  FacebookIcon,
  InstagramIcon,
  MapIcon,
  ThreadsIcon,
  TikTokIcon,
  WebsiteIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/social-icons";
import { SunyaColoredText } from "@/components/sunya-colored-text";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              <SunyaColoredText />
            </h3>
            <p className="text-sm text-muted-foreground">
              Premium dehydrated fruits with no added sugar, no preservatives.
              Naturally delicious.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a
                  href="tel:+9779867333080"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  +977-9867333080
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href="mailto:hello@sunya.com.np"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  hello@sunya.com.np
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/14ShKnnkydq/"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon size={32} />
              </a>
              <a
                href="https://www.instagram.com/the_sunya_official"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon size={32} />
              </a>
              <a
                href="https://www.tiktok.com/@sunyafruits"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="TikTok"
              >
                <TikTokIcon size={32} />
              </a>
              <a
                href="https://x.com/sunyafruits"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="X (Twitter)"
              >
                <XIcon size={32} />
              </a>
              <a
                href="https://www.threads.net/@the_sunya_official"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Threads"
              >
                <ThreadsIcon size={32} />
              </a>
              <a
                href="https://sunya.com.np"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Website"
              >
                <WebsiteIcon size={32} />
              </a>
              <a
                href="https://maps.google.com/?q=Sunya+Fruits+Kathmandu"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Location"
              >
                <MapIcon size={32} />
              </a>
              <a
                href="https://www.youtube.com/@Sunyafruits"
                className="hover:scale-110 transition-transform duration-200"
                aria-label="YouTube"
              >
                <YouTubeIcon size={32} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} <SunyaColoredText />. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

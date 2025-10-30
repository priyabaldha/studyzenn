import React from "react";

const Footer = () => {
  return (
    <footer className="footer-area bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Top Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Top Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Managed Website</a></li>
              <li><a href="#" className="hover:text-white">Manage Reputation</a></li>
              <li><a href="#" className="hover:text-white">Power Tools</a></li>
              <li><a href="#" className="hover:text-white">Marketing Service</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Jobs</a></li>
              <li><a href="#" className="hover:text-white">Brand Assets</a></li>
              <li><a href="#" className="hover:text-white">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Jobs</a></li>
              <li><a href="#" className="hover:text-white">Brand Assets</a></li>
              <li><a href="#" className="hover:text-white">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Guides</a></li>
              <li><a href="#" className="hover:text-white">Research</a></li>
              <li><a href="#" className="hover:text-white">Experts</a></li>
              <li><a href="#" className="hover:text-white">Agencies</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
            <p className="mb-4">You can trust us. We only send promo offers.</p>
            <form
              target="_blank"
              action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
              method="get"
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                name="EMAIL"
                placeholder="Your Email Address"
                required
                className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md uppercase"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400 text-center md:text-left">
            Copyright &copy; {new Date().getFullYear()} All rights reserved | This template is
            made with <i className="fa fa-heart-o text-red-500"></i> by{" "}
            <a
              href="https://colorlib.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Colorlib
            </a>
          </p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white"><i className="fa fa-facebook"></i></a>
            <a href="#" className="hover:text-white"><i className="fa fa-twitter"></i></a>
            <a href="#" className="hover:text-white"><i className="fa fa-dribbble"></i></a>
            <a href="#" className="hover:text-white"><i className="fa fa-behance"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

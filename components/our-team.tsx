import React from 'react';

const OurTeam = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center hover:shadow-xl hover:-translate-y-3 transition-all duration-300 rounded-lg overflow-hidden bg-white p-4 shadow-md">
            <img
              src="/placeholder-user.jpg"
              alt="MR CHESS"
              className="w-full h-64 object-cover rounded-lg mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-900">E</h3>
            <p className="text-gray-600">FOUNDER</p>
          </div>
          <div className="text-center hover:shadow-xl hover:-translate-y-3 transition-all duration-300 rounded-lg overflow-hidden bg-white p-4 shadow-md">
            <img
              src="/placeholder-user.jpg"
              alt="MR MT.EVEREST"
              className="w-full h-64 object-cover rounded-lg mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-900">MR</h3>
            <p className="text-gray-600">CTO</p>
          </div>
          <div className="text-center hover:shadow-xl hover:-translate-y-3 transition-all duration-300 rounded-lg overflow-hidden bg-white p-4 shadow-md">
            <img
              src="/placeholder-user.jpg"
              alt="MR ONLY"
              className="w-full h-64 object-cover rounded-lg mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-900">MR</h3>
            <p className="text-gray-600">COO</p>
          </div>
        </div>
        <div className="bg-slate-900 text-gray-300 p-8 rounded-lg shadow-lg">
          <p className="text-center text-lg">
            We are a future-focused team driven by innovation, precision, and global thinking. Our mission is to build premium products with long-term impact.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
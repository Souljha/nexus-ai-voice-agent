import React from 'react';

interface TestimonialProps {
  company: string;
  industry: string;
  quote: string;
  author: string;
  role: string;
  results: {
    metric: string;
    value: string;
  }[];
  image?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ company, industry, quote, author, role, results }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {company.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{company}</h3>
          <p className="text-blue-400 text-sm">{industry}</p>
        </div>
      </div>

      <div className="mb-6">
        <svg className="h-8 w-8 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-300 text-lg leading-relaxed italic">
          "{quote}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-900 rounded-lg">
        {results.map((result, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-blue-400">{result.value}</div>
            <div className="text-sm text-gray-400">{result.metric}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-4">
        <p className="text-white font-semibold">{author}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  // You can update these with your actual case studies
  const testimonials: TestimonialProps[] = [
    {
      company: "Elite Dental Care",
      industry: "Healthcare / Dental Practice",
      quote: "The AI voice agent handles our appointment bookings 24/7. We've reduced missed calls by 85% and our front desk staff can now focus on in-person patients. The ROI was immediate.",
      author: "Dr. Sarah Mitchell",
      role: "Practice Owner",
      results: [
        { metric: "Calls Answered", value: "85%" },
        { metric: "Time Saved", value: "20hrs/wk" },
        { metric: "New Bookings", value: "+45%" },
        { metric: "ROI", value: "3 months" }
      ]
    },
    {
      company: "Premier Real Estate Group",
      industry: "Real Estate",
      quote: "Our AI agent qualifies leads instantly and schedules property viewings automatically. It's like having a full-time receptionist who never sleeps. Game changer for our business.",
      author: "Marcus Johnson",
      role: "Managing Broker",
      results: [
        { metric: "Lead Response", value: "Instant" },
        { metric: "Qualified Leads", value: "+60%" },
        { metric: "Staff Hours Saved", value: "30/wk" },
        { metric: "Client Satisfaction", value: "4.9/5" }
      ]
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-[#0a192f]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Proven Results for <span className="text-blue-400">Real Businesses</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how businesses like yours are transforming customer service with AI voice agents
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">
            Ready to see similar results in your business?
          </p>
          <a href="#pricing" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            View Pricing Plans
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

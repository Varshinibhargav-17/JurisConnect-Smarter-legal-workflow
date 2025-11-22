const testimonials = [
  {
    quote: 'This CRM has been a game-changer for our firm. We can now manage our cases and clients with ease.',
    author: 'Jane Doe',
    title: 'Lead Attorney, Justice for All',
  },
  {
    quote: 'The ability to track documents and appointments in one place has saved us countless hours.',
    author: 'John Smith',
    title: 'Paralegal, Community Law Center',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Testimonials</h2>
          <p className="mt-4 text-lg text-gray-600">
            What our users are saying.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="p-6 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">"{testimonial.quote}"</p>
              <p className="mt-4 font-bold text-gray-800">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

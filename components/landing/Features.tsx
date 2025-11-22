import { CheckCircleIcon } from '@heroicons/react/24/solid';

const features = [
  {
    name: 'Client Management',
    description: 'Keep track of all your clients and their information in one place.',
  },
  {
    name: 'Case Tracking',
    description: 'Manage case details, status, and documents from a centralized dashboard.',
  },
  {
    name: 'Appointment Scheduling',
    description: 'Schedule and manage appointments with clients and lawyers seamlessly.',
  },
  {
    name: 'Document Management',
    description: 'Upload, store, and share case-related documents securely.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage your nonprofit law firm.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="p-6 bg-white rounded-lg shadow-lg">
              <CheckCircleIcon className="w-8 h-8 text-blue-600" />
              <h3 className="mt-4 text-xl font-bold text-gray-800">{feature.name}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

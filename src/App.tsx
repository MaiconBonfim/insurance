import React, { useState } from 'react';
import { Send, Car, Shield, Phone, User, Mail, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';

type FormData = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  year: string;
  coverage: string;
  message: string;
};

type Step = {
  title: string;
  icon: React.ReactNode;
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    year: '',
    coverage: 'basic',
    message: '',
  });

  const steps: Step[] = [
    { title: 'Dados Pessoais', icon: <User className="w-6 h-6" /> },
    { title: 'Informações do Veículo', icon: <Car className="w-6 h-6" /> },
    { title: 'Mensagem', icon: <MessageSquare className="w-6 h-6" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Olá, gostaria de uma cotação para seguro auto!
Nome: ${formData.name}
Telefone: ${formData.phone}
Email: ${formData.email}
Veículo: ${formData.vehicle}
Ano: ${formData.year}
Cobertura: ${formData.coverage === 'basic' ? 'Básica (Terceiros)' : 'Completa'}
Mensagem: ${formData.message}`;

    const whatsappNumber = '5511976447001';
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (opcional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">Marca e Modelo do Veículo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="vehicle"
                  name="vehicle"
                  required
                  value={formData.vehicle}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Ex: Toyota Corolla"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano do Veículo</label>
              <input
                type="text"
                id="year"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="Ex: 2020"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="coverage" className="block text-sm font-medium text-gray-700">Tipo de Cobertura</label>
              <select
                id="coverage"
                name="coverage"
                required
                value={formData.coverage}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="basic">Básica (Terceiros)</option>
                <option value="full">Completa</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem Adicional (opcional)</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Cotação de Seguro Auto</h1>
                <p className="mt-2 text-red-100">Preencha o formulário abaixo para receber sua cotação via WhatsApp</p>
              </div>
              <Shield className="w-16 h-16 text-red-100" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4 bg-gray-50">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <div className={`ml-3 ${index <= currentStep ? 'text-red-600' : 'text-gray-500'}`}>
                    <p className="text-sm font-medium">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-4 ${
                      index < currentStep ? 'bg-red-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Anterior
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-auto"
                >
                  Próximo
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-auto"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar via WhatsApp
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
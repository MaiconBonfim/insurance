import React, { useState, useEffect } from 'react';
 import { Send, Car, Shield, Phone, User, Mail, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
 
 type FormData = {
   quoteType: string;
   name: string;
   phone: string;
   email: string;
   birthDate: string;
   cpf: string;
   vehicle_type: string;
   vehicle_plate: string;
   vehicle_category: string;
   vehicle_value: string;
   vehicle_usage: string;
   cep: string;
   street: string;
   neighborhood: string;
   number: string;
   complement: string;
   state: string;
   city: string;
   referralCode: string;
 };
 
 type Step = {
   id: string;
   title: string;
   icon: React.ReactNode;
 };
 
 function App() {
   const [currentStep, setCurrentStep] = useState(0);
   const [formData, setFormData] = useState<FormData>({
     quoteType: '',
     name: '',
     phone: '',
     email: '',
     birthDate: '',
     cpf: '',
     vehicle_type: '',
     vehicle_plate: '',
     vehicle_category: '',
     vehicle_value: '',
     vehicle_usage: '',
     cep: '',
     street: '',
     neighborhood: '',
     number: '',
     complement: '',
     state: '',
     city: '',
     referralCode: '',
   });
 
   // Reset vehicle usage when vehicle type changes
   useEffect(() => {
     if (formData.vehicle_type === 'moto' && formData.vehicle_usage === 'transporte_escolar') {
       setFormData(prev => ({ ...prev, vehicle_usage: '' }));
     }
   }, [formData.vehicle_type]);
 
   // Capture referral code from URL on component mount
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const ref = params.get('ref');
     if (ref) {
       setFormData(prev => ({
         ...prev,
         referralCode: ref
       }));
     }
   }, []);
 
   const steps: Step[] = [
     { id: '01', title: 'Seus Dados', icon: <User className="w-6 h-6" /> },
     { id: '02', title: 'Dados do Veículo', icon: <Car className="w-6 h-6" /> },
     { id: '03', title: 'Endereço', icon: <MessageSquare className="w-6 h-6" /> },
   ];
 
   const brazilianStates = [
     'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
     'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
   ];
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     if (currentStep === steps.length - 1 && formData.cep.trim()) {
       const whatsappNumber = '5511976447001';
       const message = `Olá, gostaria de uma cotação!
 ${formData.referralCode ? `Código: ${formData.referralCode}` : ''}
 Tipo de Cotação: ${formData.quoteType}
 Nome: ${formData.name}
 Data de Nascimento: ${formData.birthDate}
 Telefone: ${formData.phone}
 Email: ${formData.email}
 CPF/CNPJ: ${formData.cpf}
 Tipo: ${formData.vehicle_type}
 Placa: ${formData.vehicle_plate}
 Categoria: ${formData.vehicle_category}
 Valor: ${formData.vehicle_value}
 Uso: ${formData.vehicle_usage}
 Endereço: ${formData.street}, ${formData.number}
 Complemento: ${formData.complement}
 Bairro: ${formData.neighborhood}
 Cidade: ${formData.city}
 Estado: ${formData.state}
 CEP: ${formData.cep}`;
       
       const encodedMessage = encodeURIComponent(message);
       window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
     }
   };
 
   const handleWhatsAppClick = () => {
     const whatsappNumber = '5511976447001';
     const message = 'Olá! Gostaria de fazer uma cotação de seguro.';
     const encodedMessage = encodeURIComponent(message);
     window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
   };
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     setFormData(prev => ({
       ...prev,
       [e.target.name]: e.target.value
     }));
   };
 
   const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const cep = e.target.value.replace(/\D/g, '');
     setFormData(prev => ({ ...prev, cep }));
 
     if (cep.length === 8) {
       try {
         const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
         const data = await response.json();
         if (!data.erro) {
           setFormData(prev => ({
             ...prev,
             street: data.logradouro,
             neighborhood: data.bairro,
             city: data.localidade,
             state: data.uf,
           }));
         }
       } catch (error) {
         console.error('Error fetching address:', error);
       }
     }
   };
 
   const canAdvanceFromStep1 = formData.quoteType.trim() && formData.name.trim() && formData.phone.trim() && formData.birthDate.trim();
   const canAdvanceFromStep2 = formData.vehicle_type.trim() && formData.vehicle_plate.trim() && formData.vehicle_usage.trim();
 
   const nextStep = () => {
     if (currentStep === 0 && !canAdvanceFromStep1) {
       return;
     }
     if (currentStep === 1 && !canAdvanceFromStep2) {
       return;
     }
     if (currentStep < steps.length - 1) {
       setCurrentStep(current => current + 1);
     }
   };
 
   const prevStep = () => {
     if (currentStep > 0) {
       setCurrentStep(current => current - 1);
     }
   };
 
   const getVehicleUsageOptions = () => {
     const commonOptions = [
       { value: "locadora", label: "Locadora" },
       { value: "motorista app", label: "Motorista de aplicativo" },
       { value: "lazer / familia", label: "Lazer | família" },
       { value: "representante comercial", label: "Representante comercial" },
       { value: "transporte mercadorias", label: "Transporte de mercadorias" },
       { value: "taxi", label: "Táxi" },
       { value: "auto escola", label: "Auto escola" },
     ];
 
     // Add transporte_escolar only for cars
     if (formData.vehicle_type === 'carro') {
       commonOptions.splice(6, 0, { value: "transporte escolar", label: "Transporte escolar" });
     }
 
     return commonOptions;
   };
 
   const renderStepContent = () => {
     switch (currentStep) {
       case 0:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-semibold text-gray-900">Seus Dados</h2>
             <div className="grid grid-cols-1 gap-6">
               <div>
                 <select
                   name="quoteType"
                   value={formData.quoteType}
                   onChange={handleChange}
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                   required
                 >
                   <option value="">Selecione o tipo de cotação *</option>
                   <option value="seguro e rastreador">Seguro e rastreador</option>
                   <option value="somente seguro">Somente seguro</option>
                   <option value="somente rastreador">Somente rastreador</option>
                 </select>
                 {!formData.quoteType.trim() && (
                   <p className="mt-1 text-sm text-red-500">Tipo de cotação é obrigatório</p>
                 )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <input
                     type="text"
                     name="name"
                     placeholder="Seu Nome *"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     required
                   />
                   {!formData.name.trim() && (
                     <p className="mt-1 text-sm text-red-500">Nome é obrigatório</p>
                   )}
                 </div>
                 <div>
                   <input
                     type="text"
                     name="birthDate"
                     placeholder="Data de Nascimento * (DD/MM/AAAA)"
                     value={formData.birthDate}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     required
                   />
                   {!formData.birthDate.trim() && (
                     <p className="mt-1 text-sm text-red-500">Data de nascimento é obrigatória</p>
                   )}
                 </div>
                 <div>
                   <input
                     type="email"
                     name="email"
                     placeholder="E-mail"
                     value={formData.email}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                   />
                 </div>
                 <div>
                   <input
                     type="tel"
                     name="phone"
                     placeholder="Telefone *"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     required
                   />
                   {!formData.phone.trim() && (
                     <p className="mt-1 text-sm text-red-500">Telefone é obrigatório</p>
                   )}
                 </div>
                 <div>
                   <input
                     type="text"
                     name="cpf"
                     placeholder="CPF ou CNPJ"
                     value={formData.cpf}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                   />
                 </div>
                 {/* Hidden referral code field */}
                 <input
                   type="hidden"
                   name="referralCode"
                   value={formData.referralCode}
                 />
               </div>
             </div>
           </div>
         );
       case 1:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-semibold text-gray-900">Dados do Veículo</h2>
             <div className="space-y-4">
               <select
                 name="vehicle_type"
                 value={formData.vehicle_type}
                 onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                 required
               >
                 <option value="">Tipo do veículo *</option>
                 <option value="carro">Carro</option>
                 <option value="moto">Moto</option>
               </select>
               {!formData.vehicle_type && (
                 <p className="mt-1 text-sm text-red-500">Tipo do veículo é obrigatório</p>
               )}
               <input
                 type="text"
                 name="vehicle_plate"
                 placeholder="Placa do Veículo *"
                 value={formData.vehicle_plate}
                 onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                 required
               />
               {!formData.vehicle_plate && (
                 <p className="mt-1 text-sm text-red-500">Placa do veículo é obrigatória</p>
               )}
               <select
                 name="vehicle_category"
                 value={formData.vehicle_category}
                 onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
               >
                 <option value="">Categoria do veículo</option>
                 {formData.vehicle_type === 'carro' ? (
                   <>
                     <option value="hatch">Hatch</option>
                     <option value="sedan">Sedan</option>
                     <option value="suv">SUV</option>
                   </>
                 ) : formData.vehicle_type === 'moto' ? (
                   <>
                     <option value="street">Street</option>
                     <option value="trail">Trail</option>
                     <option value="scooter">Scooter</option>
                   </>
                 ) : null}
               </select>
               <select
                 name="vehicle_value"
                 value={formData.vehicle_value}
                 onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
               >
                 <option value="">Valor do veículo (FIPE)</option>
                 <option value="30000-">Abaixo de R$ 30.000</option>
                 <option value="30000-50000">R$ 30.000 - R$ 50.000</option>
                 <option value="50000-80000">R$ 50.000 - R$ 80.000</option>
                 <option value="80000+">Acima de R$ 80.000</option>
               </select>
               <select
                 name="vehicle_usage"
                 value={formData.vehicle_usage}
                 onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                 required
               >
                 <option value="">Tipo de uso *</option>
                 {getVehicleUsageOptions().map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
               {!formData.vehicle_usage && (
                 <p className="mt-1 text-sm text-red-500">Tipo de uso é obrigatório</p>
               )}
             </div>
           </div>
         );
       case 2:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-semibold text-gray-900">Endereço</h2>
             <div className="space-y-4">
               <input
                 type="text"
                 name="cep"
                 placeholder="CEP *"
                 value={formData.cep}
                 onChange={handleCepChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                 required
               />
               {!formData.cep.trim() && (
                 <p className="mt-1 text-sm text-red-500">CEP é obrigatório</p>
               )}
               {formData.cep.trim() && (
                 <>
                   <input
                     type="text"
                     name="street"
                     placeholder="Rua"
                     value={formData.street}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                   />
                   <div className="grid grid-cols-2 gap-4">
                     <input
                       type="text"
                       name="number"
                       placeholder="Número"
                       value={formData.number}
                       onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     />
                     <input
                       type="text"
                       name="complement"
                       placeholder="Complemento"
                       value={formData.complement}
                       onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     />
                   </div>
                   <input
                     type="text"
                     name="neighborhood"
                     placeholder="Bairro"
                     value={formData.neighborhood}
                     onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                   />
                   <div className="grid grid-cols-2 gap-4">
                     <select
                       name="state"
                       value={formData.state}
                       onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     >
                       <option value="">Estado</option>
                       {brazilianStates.map(state => (
                         <option key={state} value={state}>{state}</option>
                       ))}
                     </select>
                     <input
                       type="text"
                       name="city"
                       placeholder="Cidade"
                       value={formData.city}
                       onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                     />
                   </div>
                 </>
               )}
             </div>
           </div>
         );
       default:
         return null;
     }
   };
 
   return (
     <div className="min-h-screen bg-white">
       <div className="max-w-4xl mx-auto px-4 py-12">
         <div className="flex justify-center mb-12">
           <div className="text-3xl font-bold text-red-600">
             SIGA · SEGUROS
           </div>
         </div>
 
         <div className="flex justify-center items-center mb-12">
           {steps.map((step, index) => (
             <React.Fragment key={step.id}>
               <div className="flex items-center">
                 <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                   index === currentStep ? 'bg-red-400 text-white' : 
                   index < currentStep ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                 }`}>
                   {step.id}
                 </div>
                 <div className="ml-3">
                   <p className={`text-sm ${
                     index === currentStep ? 'text-red-400' :
                     index < currentStep ? 'text-red-500' : 'text-gray-500'
                   }`}>{step.title}</p>
                 </div>
               </div>
               {index < steps.length - 1 && (
                 <div className="w-24 h-1 mx-4 bg-gray-200">
                   <div className={`h-full ${
                     index < currentStep ? 'bg-red-500' : 'bg-gray-200'
                   }`} style={{ width: index < currentStep ? '100%' : '0%' }} />
                 </div>
               )}
             </React.Fragment>
           ))}
         </div>
 
         <div className="bg-white rounded-2xl p-8">
           <form onSubmit={handleSubmit}>
             {renderStepContent()}
 
             <div className="mt-8 flex justify-between">
               {currentStep > 0 && (
                 <button
                   type="button"
                   onClick={prevStep}
                   className="inline-flex items-center px-8 py-3 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                 >
                   <ChevronLeft className="mr-2 h-5 w-5" />
                   Voltar
                 </button>
               )}
               <div className="ml-auto">
                 {currentStep < steps.length - 1 ? (
                   <button
                     type="button"
                     onClick={nextStep}
                     disabled={currentStep === 0 ? !canAdvanceFromStep1 : currentStep === 1 ? !canAdvanceFromStep2 : false}
                     className={`inline-flex items-center px-8 py-3 rounded-full text-white transition-all ${
                       (currentStep === 0 && canAdvanceFromStep1) || (currentStep === 1 && canAdvanceFromStep2) || currentStep === 2
                         ? 'bg-green-500 hover:bg-green-600'
                         : 'bg-gray-400 cursor-not-allowed'
                     }`}
                   >
                     Avançar
                     <ChevronRight className="ml-2 h-5 w-5" />
                   </button>
                 ) : (
                   <button
                     type="submit"
                     disabled={!formData.cep.trim()}
                     className={`inline-flex items-center px-8 py-3 rounded-full text-white transition-all ${
                       formData.cep.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                     }`}
                   >
                     Finalizar
                     <Send className="ml-2 h-5 w-5" />
                   </button>
                 )}
               </div>
             </div>
           </form>
         </div>
       </div>
 
       <div className="fixed bottom-8 right-8">
         <button
           onClick={handleWhatsAppClick}
           className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
         >
           <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="currentColor"
             className="w-8 h-8"
           >
             <path
               fillRule="evenodd"
               d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.29 22l4.17-1.59C7.88 21.44 9.89 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.03 15.88c-1.37 0-2.69-.39-3.83-1.12l-2.68 1.02.99-2.67c-.78-1.16-1.19-2.52-1.19-3.94 0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7zm3.97-5.19c-.22-.11-1.27-.62-1.47-.69-.2-.07-.34-.1-.49.1-.15.21-.57.69-.7.83-.13.14-.25.16-.47.05-.22-.11-.93-.34-1.77-1.09-.66-.6-1.1-1.34-1.23-1.56-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.14-.22.22-.37.07-.15.03-.28-.02-.39-.05-.11-.49-1.17-.67-1.6-.18-.43-.36-.36-.49-.37-.13-.01-.28-.01-.42-.01-.15 0-.39.06-.6.28-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.35.12.15 1.66 2.53 4.02 3.55.56.24 1 .39 1.34.5.56.18 1.07.15 1.48.09.45-.07 1.27-.52 1.45-1.02.18-.5.18-.93.13-1.02-.05-.08-.19-.14-.41-.25z"
               clipRule="evenodd"
             />
           </svg>
         </button>
       </div>
     </div>
   );
 }
 
 export default App;

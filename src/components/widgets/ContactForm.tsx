import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const MEXICO_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila de Zaragoza',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán de Ocampo',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz de Ignacio de la Llave',
  'Yucatán',
  'Zacatecas',
];

const translations = {
  es: {
    nombre:  { label: 'Nombre completo',       placeholder: 'Tu nombre completo' },
    phone:   { label: 'Número de teléfono',    placeholder: '10 dígitos' },
    email:   { label: 'Correo electrónico',    placeholder: 'tu@correo.com' },
    state:   { label: 'Estado',                placeholder: 'Selecciona tu estado' },
    city:    { label: 'Ciudad',                placeholder: 'Tu ciudad' },
    service: { label: 'Trámite de interés',    placeholder: 'Selecciona un trámite' },
    other:   { label: '¿Qué trámite necesitas?', placeholder: 'Describe brevemente tu situación...' },
    privacy: 'He leído y acepto el',
    privacyLink: 'Aviso de Privacidad',
    marketing: 'Acepto recibir información y promociones por correo electrónico.',
    submit:     'Enviar solicitud',
    submitting: 'Enviando...',
    services: [
      { value: 'work-visa',            label: 'Visa de Trabajo' },
      { value: 'tourist-visa',         label: 'Visa de Turista' },
      { value: 'immigration-waiver',   label: 'Perdón Migratorio' },
      { value: 'family-reunification', label: 'Reunificación Familiar / Visa para Adulto Mayor' },
      { value: 'naturalization',       label: 'Naturalización' },
      { value: 'dual-nationality',     label: 'Doble Nacionalidad' },
      { value: 'marriage-petition',    label: 'Petición por Matrimonio' },
      { value: 'other',                label: 'Otro' },
    ],
    errors: {
      full_name:    'El nombre es obligatorio.',
      phone:        'Ingresa un número de 10 dígitos.',
      email:        'Ingresa un correo electrónico válido.',
      state_mx:     'Selecciona tu estado.',
      city:         'La ciudad es obligatoria.',
      service_type: 'Selecciona un trámite.',
      other:        'Describe el trámite que necesitas.',
      privacy:      'Debes aceptar el Aviso de Privacidad para continuar.',
    },
    success: {
      title:   '¡Solicitud enviada!',
      message: 'Recibimos tu información. Un asesor de ADALA se pondrá en contacto contigo a la brevedad.',
      back:    'Enviar otra solicitud',
    },
    submitError: 'Ocurrió un error al enviar. Intenta de nuevo.',
  },
  en: {
    nombre:  { label: 'Full Name',       placeholder: 'Your full name' },
    phone:   { label: 'Phone Number',    placeholder: '10-digit number' },
    email:   { label: 'Email Address',   placeholder: 'you@email.com' },
    state:   { label: 'State (Mexico)',  placeholder: 'Select your state' },
    city:    { label: 'City',            placeholder: 'Your city' },
    service: { label: 'Service of Interest', placeholder: 'Select a service' },
    other:   { label: 'What do you need?', placeholder: 'Briefly describe your situation...' },
    privacy: 'I have read and accept the',
    privacyLink: 'Privacy Policy',
    marketing: 'I agree to receive information and promotions by email.',
    submit:     'Submit Request',
    submitting: 'Submitting...',
    services: [
      { value: 'work-visa',            label: 'Work Visa' },
      { value: 'tourist-visa',         label: 'Tourist Visa' },
      { value: 'immigration-waiver',   label: 'Immigration Waiver' },
      { value: 'family-reunification', label: 'Family Reunification / Senior Visa' },
      { value: 'naturalization',       label: 'Naturalization' },
      { value: 'dual-nationality',     label: 'Dual Nationality' },
      { value: 'marriage-petition',    label: 'Marriage Petition' },
      { value: 'other',                label: 'Other' },
    ],
    errors: {
      full_name:    'Full name is required.',
      phone:        'Enter a valid 10-digit number.',
      email:        'Enter a valid email address.',
      state_mx:     'Select your state.',
      city:         'City is required.',
      service_type: 'Select a service.',
      other:        'Please describe what you need.',
      privacy:      'You must accept the Privacy Policy to continue.',
    },
    success: {
      title:   'Request Submitted!',
      message: 'We received your information. An ADALA advisor will reach out to you shortly.',
      back:    'Submit another request',
    },
    submitError: 'Something went wrong. Please try again.',
  },
} as const;

interface FormState {
  full_name:        string;
  phone:            string;
  email:            string;
  state_mx:         string;
  city:             string;
  service_type:     string;
  other_description: string;
  accepts_privacy:  boolean;
  accepts_marketing: boolean;
}

interface UtmParams {
  utm_source:   string | null;
  utm_medium:   string | null;
  utm_campaign: string | null;
  utm_content:  string | null;
  origin_url:   string | null;
}

const EMPTY_FORM: FormState = {
  full_name:         '',
  phone:             '',
  email:             '',
  state_mx:          '',
  city:              '',
  service_type:      '',
  other_description: '',
  accepts_privacy:   false,
  accepts_marketing: false,
};

interface Props {
  lang?: 'es' | 'en';
}

export default function ContactForm({ lang = 'es' }: Props) {
  const t = translations[lang];

  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]     = useState<Partial<Record<keyof FormState | 'other', string>>>({});
  const [utms, setUtms]         = useState<UtmParams>({ utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, origin_url: null });
  const [honeypot, setHoneypot]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Read UTM params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtms({
      utm_source:   params.get('utm_source'),
      utm_medium:   params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content:  params.get('utm_content'),
      origin_url:   window.location.href,
    });
  }, []);

  const showOther = form.service_type === 'other';

  const set = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};

    if (!form.full_name.trim())                              e.full_name    = t.errors.full_name;
    if (!/^\d{10}$/.test(form.phone))                       e.phone        = t.errors.phone;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.errors.email;
    if (!form.state_mx)                                      e.state_mx     = t.errors.state_mx;
    if (!form.city.trim())                                   e.city         = t.errors.city;
    if (!form.service_type)                                  e.service_type = t.errors.service_type;
    if (showOther && !form.other_description.trim())         e.other        = t.errors.other;
    if (!form.accepts_privacy)                               e.accepts_privacy = t.errors.privacy;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (honeypot) { setSubmitted(true); return; } // bot — silent fake success
    if (!validate()) return;

    setSubmitting(true);

    const { error } = await supabase.from('prospects').insert({
      full_name:         form.full_name.trim(),
      phone:             form.phone,
      email:             form.email.trim() || null,
      state_mx:          form.state_mx,
      city:              form.city.trim(),
      service_type:      form.service_type,
      other_description: showOther ? form.other_description.trim() : null,
      accepts_privacy:   form.accepts_privacy,
      accepts_marketing: form.accepts_marketing,
      consent_date:      new Date().toISOString(),
      ...utms,
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      setSubmitError(t.submitError);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.success.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">{t.success.message}</p>
        </div>
        <Button variant="outline" onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); setSubmitError(''); }}>
          {t.success.back}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="full_name">{t.nombre.label}</Label>
        <Input id="full_name" type="text" value={form.full_name}
          onChange={(e) => set('full_name', e.target.value)}
          placeholder={t.nombre.placeholder} maxLength={100} />
        {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">{t.phone.label}</Label>
        <Input id="phone" type="tel" inputMode="numeric" value={form.phone}
          onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder={t.phone.placeholder} maxLength={10} />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">{t.email.label}</Label>
        <Input id="email" type="email" value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder={t.email.placeholder} maxLength={150} />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* State + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t.state.label}</Label>
          <Select value={form.state_mx} onValueChange={(v) => set('state_mx', v)}>
            <SelectTrigger><SelectValue placeholder={t.state.placeholder} /></SelectTrigger>
            <SelectContent>
              {MEXICO_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.state_mx && <p className="text-sm text-red-500">{errors.state_mx}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">{t.city.label}</Label>
          <Input id="city" type="text" value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder={t.city.placeholder} maxLength={80} />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
      </div>

      {/* Service type */}
      <div className="space-y-1.5">
        <Label>{t.service.label}</Label>
        <Select value={form.service_type} onValueChange={(v) => set('service_type', v)}>
          <SelectTrigger><SelectValue placeholder={t.service.placeholder} /></SelectTrigger>
          <SelectContent>
            {t.services.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.service_type && <p className="text-sm text-red-500">{errors.service_type}</p>}
      </div>

      {/* Other — conditional accordion */}
      <div className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: showOther ? '200px' : '0px' }}>
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="other_description">{t.other.label}</Label>
          <textarea id="other_description" value={form.other_description}
            onChange={(e) => set('other_description', e.target.value)}
            placeholder={t.other.placeholder} rows={3} maxLength={500}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" />
          {errors.other && <p className="text-sm text-red-500">{errors.other}</p>}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.accepts_privacy}
            onChange={(e) => set('accepts_privacy', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t.privacy}{' '}
            <a href={`/${lang}/privacy`} target="_blank" className="text-primary underline underline-offset-2">
              {t.privacyLink}
            </a>.
          </span>
        </label>
        {errors.accepts_privacy && <p className="text-sm text-red-500 -mt-1">{errors.accepts_privacy}</p>}

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.accepts_marketing}
            onChange={(e) => set('accepts_marketing', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{t.marketing}</span>
        </label>
      </div>

      {submitError && (
        <p className="text-sm text-red-500 text-center">{submitError}</p>
      )}

      {/* Honeypot — invisible to humans, bots will fill it */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? t.submitting : t.submit}
      </Button>

    </form>
  );
}

'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

interface FormDataShape {
  nombre: string;
  email: string;
  nivelIngles: string;
  carrera: string;
  curriculum: File | null;
}

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_BYTES = 500 * 1024; // 500 KB

export default function ApplicationForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formData, setFormData] = useState<FormDataShape>({
    nombre: '',
    email: '',
    nivelIngles: '',
    carrera: '',
    curriculum: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormDataShape, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' })); // limpia error
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (!file) {
      setFormData((p) => ({ ...p, curriculum: null }));
      setFileError('Este campo es obligatorio.');
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Formato no permitido. Sube PDF, JPG o PNG.');
      e.currentTarget.value = '';
      setFormData((p) => ({ ...p, curriculum: null }));
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setFileError(`El archivo supera 500 KB (actual: ${Math.ceil(file.size / 1024)} KB).`);
      e.currentTarget.value = '';
      setFormData((p) => ({ ...p, curriculum: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, curriculum: file }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Este campo es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!formData.nivelIngles) newErrors.nivelIngles = 'Selecciona tu nivel de inglés.';
    if (!formData.carrera.trim()) newErrors.carrera = 'Este campo es obligatorio.';
    if (!formData.curriculum) newErrors.curriculum = 'Este campo es obligatorio.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!validateForm()) return;

    try {
      setSending(true);

      const SERVICE_ID = 'service_p94d2vs';
      const TEMPLATE_ID = 'template_cebdjsx';
      const PUBLIC_KEY = 'OaiN3mSDbR8mvzrZE';

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });

      setFormData({
        nombre: '',
        email: '',
        nivelIngles: '',
        carrera: '',
        curriculum: null,
      });
      formRef.current.reset();
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Ícono de éxito */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Mensaje de éxito */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">¡Aplicación enviada!</h2>
              <p className="text-gray-600">Hemos recibido tu aplicación correctamente. Te contactaremos pronto.</p>
            </div>

            {/* Botón para conocer más sobre Adala */}
            <Button onClick={() => window.open('/')} className="w-full">
              Conoce más sobre Adala
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center font-semibold">Formulario de Aplicación</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate encType="multipart/form-data">
          <input type="hidden" name="to_email" value="axleduardoguillen@gmail.com" />
          <input type="hidden" name="nivelIngles" value={formData.nivelIngles} />

          {/* Nombre */}
          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ingresa tu nombre completo"
              required
              maxLength={80}
            />
            {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              required
              maxLength={120}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Nivel de inglés */}
          <div className="space-y-1">
            <Label htmlFor="nivel-ingles">Nivel de inglés</Label>
            <Select value={formData.nivelIngles} onValueChange={(value) => handleInputChange('nivelIngles', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Intermedio">Intermedio</SelectItem>
                <SelectItem value="Avanzado">Avanzado</SelectItem>
                <SelectItem value="Nativo">Nativo</SelectItem>
              </SelectContent>
            </Select>
            {errors.nivelIngles && <p className="text-sm text-red-600">{errors.nivelIngles}</p>}
          </div>

          {/* Carrera */}
          <div className="space-y-1">
            <Label htmlFor="carrera">Carrera</Label>
            <Input
              id="carrera"
              name="carrera"
              type="text"
              value={formData.carrera}
              onChange={(e) => handleInputChange('carrera', e.target.value)}
              placeholder="Ingresa tu carrera"
              required
              maxLength={100}
            />
            {errors.carrera && <p className="text-sm text-red-600">{errors.carrera}</p>}
          </div>

          {/* CV */}
          <div className="space-y-1">
            <Label htmlFor="my_file">Currículum (PDF/JPG/PNG) — máx 500 KB</Label>
            <Input
              id="my_file"
              name="my_file"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              required
              className="h-max file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#00A1E6] file:text-white file:hover:cursor-pointer"
            />
            {(fileError || errors.curriculum) && (
              <p className="text-sm text-red-600">{fileError || errors.curriculum}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? 'Enviando…' : 'Enviar aplicación'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

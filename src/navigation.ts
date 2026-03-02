/* import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks'; */
import { getPermalink } from './utils/permalinks';


export const getHeaderData = (lang: 'en' | 'es') => ({
  links: [
    { text: lang === 'es' ? 'Pilares' : 'Pillars',   href: `/${lang}#pillars`  },
    { text: lang === 'es' ? 'Servicios' : 'Services', href: `/${lang}#services` },
    { text: lang === 'es' ? 'Proceso' : 'Process',    href: `/${lang}#steps`    },
    { text: 'FAQs',                                    href: `/${lang}#faqs`     },
  ],
  actions: [
    {
      variant: 'primary',
      text: lang === 'es' ? 'Contáctanos' : 'Contact Us',
      href: 'mailto:contacto@adala.mx',
    },
  ],
});

export const getFooterData = (lang: 'en' | 'es') => ({
  links: [],
  secondaryLinks: [
    {
      text: lang === 'es' ? 'Términos' : 'Terms',
      href: getPermalink('/terms', 'page', lang),
    },
    {
      text: lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy',
      href: getPermalink('/privacy', 'page', lang),
    },
  ],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/share/192wVFnnxU/',
    },
  ],
  footNote:
    lang === 'es'
      ? `© ${new Date().getFullYear()} Adala - Todos los derechos reservados.`
      : `© ${new Date().getFullYear()} Adala - All rights reserved.`,
});

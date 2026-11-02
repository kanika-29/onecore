/**
 * Static CMS Page Contents and SEO metadata for Onecore Pharma.
 * Supplies structured sections for all public routes.
 */

export const pagesContent = {
  home: {
    seo_title: 'Onecore Pharma | Prescribing a better tomorrow',
    seo_description: 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality, and the needs of patients and healthcare professionals.',
    sections: {
      hero: {
        title: 'Prescribing a better tomorrow',
        image_url: '/assets/hero-healthcare.jpg',
      },
      about_onecore: {
        eyebrow: '',
        title: 'Healthcare is personal.\nOur approach should be too.',
        body: 'Onecore Pharma is a pharmaceutical company focused on purposeful formulations, dependable quality and the needs of patients and healthcare professionals.',
        cta_text: 'Discover Onecore',
        cta_url: '/about',
        image_url: '/assets/internet/healthcare-team-discussion.jpg',
      },
      areas_of_care: {
        eyebrow: '',
        title: 'Areas of Care',
      },
      our_purpose: {
        eyebrow: '',
        title: 'Improve care through medicines and healthcare solutions that matter.',
        items: [
          {
            title: 'Our Vision',
            desc: 'To become one of India’s most trusted healthcare companies, shaping better health and better lives through quality, innovation and purpose.'
          },
          {
            title: 'Our Mission',
            desc: 'To provide the medical fraternity with trusted medicines and innovative healthcare solutions, while empowering our people and stakeholders through intellectual, professional and financial growth.'
          }
        ]
      },
      quality_assurance: {
        eyebrow: '',
        title: 'Quality is part of the product from the beginning.',
        body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
        subheading: 'Our approach is centered on qualified manufacturing environments, appropriate quality controls and disciplined review before products reach the market.',
        image_url: '/assets/internet/lab-chemistry.jpg',
        items: [
          {
            title: 'Consistent standards',
            desc: 'Quality expectations aligned to the nature and regulatory requirements of each product.'
          },
          {
            title: 'Responsible release',
            desc: 'Review and controls designed to support product consistency and reliability.'
          }
        ]
      },
      sustainability: {
        eyebrow: 'SUSTAINABILITY',
        title: 'Better health and a healthier future belong together.',
        body: 'Our responsibility extends beyond the products we provide. As Onecore grows, we want responsible choices to become part of how we operate, how we source and how we work with our partners.',
        items: [
          {
            eyebrow: 'RESPONSIBLE OPERATIONS',
            title: 'Use resources thoughtfully.',
            desc: 'Work toward more efficient use of energy, water and materials across the operations and manufacturing network that support our products.',
            icon: 'Cpu'
          },
          {
            eyebrow: 'PACKAGING',
            title: 'Reduce what is unnecessary.',
            desc: 'Evaluate packaging choices with the aim of reducing avoidable material use while protecting product quality, safety and stability.',
            icon: 'Leaf'
          },
          {
            eyebrow: 'RESPONSIBLE PARTNERSHIPS',
            title: 'Grow with shared standards.',
            desc: 'Build relationships with partners who share expectations around quality, compliance, ethical conduct and environmental responsibility.',
            icon: 'Users'
          }
        ]
      },
      looking_ahead: {
        eyebrow: 'LOOKING AHEAD',
        title: 'Building depth. \nExpanding thoughtfully.',
        body: 'Our roadmap prioritizes therapeutic rigor, medical dialogue, and disciplined expansion that preserves trust.',
        items: [
          {
            title: 'Deepen therapeutic expertise',
            desc: 'Build stronger portfolios within our core areas of care.'
          },
          {
            title: 'Invest in meaningful differentiation',
            desc: 'Focus on formulations and presentations that provide real practical value.'
          },
          {
            title: 'Strengthen medical engagement',
            desc: 'Work closely with clinicians to understand evolving treatment needs.'
          },
          {
            title: 'Expand geographic reach responsibly',
            desc: 'Grow our presence while keeping quality and reliability at the center.'
          }
        ]
      }
    }
  },

  about: {
    seo_title: 'About Us | Onecore Pharma',
    seo_description: 'Discover Onecore Pharma – our mission, principles, leadership, and unwavering commitment to healthcare centered on people.',
    sections: {
      hero: {
        eyebrow: '',
        title: 'Formulations with purpose. Quality with discipline.',
        body: 'Onecore Pharma is built around a straightforward belief: healthcare works best when science, medical insight and genuine patient needs are closely connected.',
        image_url: '/assets/about-facility.jpg',
      },
      mission_vision: {
        eyebrow: '',
        title: 'Guided by clinical integrity and long-term care.',
        items: [
          {
            title: 'Our Vision',
            desc: 'To become one of India’s most trusted healthcare companies, shaping better health and better lives through quality, innovation and purpose.'
          },
          {
            title: 'Our Mission',
            desc: 'To provide the medical fraternity with trusted medicines and innovative healthcare solutions, while empowering our people and stakeholders through intellectual, professional and financial growth.'
          }
        ]
      },
      video_section: {
        eyebrow: '',
        title: 'A closer look at how we work.',
        body: 'Our commitment to quality, patient-first thinking, and disciplined formulation in motion.',
        poster_url: '/assets/about-video-poster.jpg',
      }
    }
  },

  'quality-manufacturing': {
    seo_title: 'Quality & Manufacturing | Onecore Pharma',
    seo_description: 'Quality is part of the product from the beginning. Learn about Onecore Pharma manufacturing standards and rigorous quality assurance.',
    sections: {
      hero: {
        eyebrow: '',
        title: 'Quality is part of the product from the beginning.',
        body: 'Medicines carry responsibility. That is why quality needs to be considered across manufacturing, testing, review and release, not treated as a final checkpoint.',
        image_url: '/assets/quality.jpg',
      }
    }
  },

  'patients-caregivers': {
    seo_title: 'Patients & Caregivers | Onecore Pharma',
    seo_description: 'Clear, dependable health guidance and therapeutic support for patients and their caregivers from Onecore Pharma.',
    sections: {
      hero: {
        eyebrow: '',
        title: 'Clear information. Supportive care.',
        body: 'Understanding a diagnosis and managing daily treatment can be overwhelming. We provide transparent resources to help you navigate care with confidence.',
        image_url: '/assets/patients-caregivers.jpg',
      }
    }
  },

  news: {
    seo_title: 'News & Insights | Onecore Pharma',
    seo_description: 'Read the latest updates, medical perspectives, formulation insights, and corporate news from Onecore Pharma.',
    sections: {
      hero: {
        eyebrow: '',
        title: 'Perspectives on healthcare and innovation.',
        body: 'Stay updated on our therapeutic developments, formulation research, clinical partnerships, and corporate milestones.',
        image_url: '/assets/news-1.jpg',
      }
    }
  },

  contact: {
    seo_title: 'Contact Us | Onecore Pharma',
    seo_description: 'Get in touch with Onecore Pharma. Connect with our medical information, corporate office, or general inquiries team.',
    sections: {
      hero: {
        eyebrow: '',
        title: 'Connect with Onecore Pharma.',
        body: 'Whether you have inquiries regarding our therapeutic divisions, medical products, or corporate partnerships, our team is ready to assist you.',
        image_url: '/assets/contact-hero.jpg',
      }
    }
  },

  privacy: {
    seo_title: 'Privacy Policy | Onecore Pharma',
    seo_description: 'Onecore Pharma privacy statement, data protection guidelines, and handling of voluntarily submitted user information.',
    sections: {
      banner: {
        eyebrow: 'LEGAL & COMPLIANCE',
        title: 'Privacy Policy',
        heading: 'Privacy Policy',
        subheading: 'How Onecore Pharma collects, protects, and handles personal data.',
        body: 'Onecore Pharma is committed to protecting your privacy and ensuring responsible, transparent handling of all communications and interactions.',
        image_url: '/assets/about-facility.jpg',
      },
      information_collection: {
        eyebrow: 'ARTICLE 01',
        title: '1. Information Collection',
        heading: '1. Information Collection',
        body: 'Onecore Pharma collects information voluntarily submitted through our contact and inquiry forms, including names, professional affiliations, and contact details necessary to respond to product or partnership communications.',
      },
      use_of_information: {
        eyebrow: 'ARTICLE 02',
        title: '2. Use of Information',
        heading: '2. Use of Information',
        body: 'Submitted details are used solely to route inquiries to the appropriate departmental function, such as medical information, business partnerships, or customer support.',
      },
      data_protection: {
        eyebrow: 'ARTICLE 03',
        title: '3. Data Protection & Confidentiality',
        heading: '3. Data Protection & Confidentiality',
        body: 'We maintain reasonable technical and organizational standards to protect communications from unauthorized disclosure, access, or alteration.',
      }
    }
  },

  disclaimer: {
    seo_title: 'Disclaimer | Onecore Pharma',
    seo_description: 'Official medical information notice, product availability specifications, and regulatory disclaimers for Onecore Pharma.',
    sections: {
      banner: {
        eyebrow: 'LEGAL & REGULATORY',
        title: 'Disclaimer',
        heading: 'Disclaimer',
        subheading: 'Regulatory notices, medical boundaries, and conditions of website use.',
        body: 'Please review the following legal disclosures regarding medical information, product specifications, and regulatory frameworks.',
        image_url: '/assets/hero-healthcare.jpg',
      },
      medical_information_notice: {
        eyebrow: 'NOTICE 01',
        title: 'Medical Information Notice',
        heading: 'Medical Information Notice',
        body: 'The content provided on this website is for informational and educational purposes only and is not intended to replace consultation with a qualified medical professional.',
      },
      product_availability: {
        eyebrow: 'NOTICE 02',
        title: 'Product Availability',
        heading: 'Product Availability',
        body: 'Product specifications and availability are subject to local regulatory authorizations and marketed formulation guidelines.',
      }
    }
  }
};

export default pagesContent;

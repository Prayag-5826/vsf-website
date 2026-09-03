// d:/vidhya-security-force/lib/seo/schema.ts

export interface DistrictSchemaInput {
  name: string;
  slug: string;
  pin: string;
  region: string;
  industrialHubs?: string[];
  keySectors?: string[];
}

export function generateCityJsonLd(city: DistrictSchemaInput) {
  const hubs = city.industrialHubs || [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SecurityService",
        "@id": `https://vidhyasecurityforce.in/cities/${city.slug}/#service`,
        "name": `Vidhya Security Force & Housekeeping Services - ${city.name}`,
        "url": `https://vidhyasecurityforce.in/cities/${city.slug}`,
        "telephone": "+919826259020",
        "email": "vidhyasecurity@gmail.com",
        "priceRange": "₹₹",
        "image": "https://vidhyasecurityforce.in/assets/img/logo/logo.png",
        "description": `Govt. PSARA-licensed security guards, armed gunmen, ATM sentries, and mechanized facility housekeeping services deployed across ${city.name} (${city.region}), PIN: ${city.pin}.`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "012 A Block Treasure Town",
          "addressLocality": city.name,
          "addressRegion": "Madhya Pradesh",
          "postalCode": city.pin,
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "22.7196",
          "longitude": "75.8577"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "areaServed": [
          {
            "@type": "City",
            "name": city.name,
            "containedInPlace": {
              "@type": "State",
              "name": "Madhya Pradesh"
            }
          },
          ...hubs.map((hub) => ({
            "@type": "Place",
            "name": `${hub}, ${city.name}`
          }))
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `Security & Facility Services in ${city.name}`,
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": `Industrial & Factory Gate Guarding in ${city.name}`,
                "description": "Material inward/outward inspection, visitor screening, and perimeter sentry deployment."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": `Armed Bank & Cash Van Sentries in ${city.name}`,
                "description": "12-Bore and .32 licensed gunners for bank branches, jewelry showrooms, and cash transit."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": `Commercial & Industrial Housekeeping in ${city.name}`,
                "description": "Mechanized cleaning, 5S industrial floor maintenance, and office sanitization."
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "148",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://vidhyasecurityforce.in/cities/${city.slug}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vidhyasecurityforce.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Madhya Pradesh Coverage",
            "item": "https://vidhyasecurityforce.in/cities"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${city.name} Branch`,
            "item": `https://vidhyasecurityforce.in/cities/${city.slug}`
          }
        ]
      }
    ]
  };
}

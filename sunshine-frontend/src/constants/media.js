/**
 * Site imagery hosted on Cloudinary (folder "paradise-site").
 * Render through getOptimizedCloudinaryUrl() so each device gets a right-sized, compressed file.
 */

export const MEDIA = Object.freeze({
  logo: "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458836/paradise-site/brand-logo.webp",
  hero: "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458837/paradise-site/hero-sinquerim.jpg",
  aboutSinquerimFort:
    "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458827/paradise-site/about-sinquerim-fort.jpg",
  aboutFortAguada:
    "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458825/paradise-site/about-fort-aguada.jpg",
  aboutParasailing:
    "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458826/paradise-site/about-parasailing-calangute.jpg",
  scuba:
    "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458832/paradise-site/activity-scuba.jpg",
  carRentalPromo:
    "https://res.cloudinary.com/dcasib8zl/image/upload/v1791458841/paradise-site/promo-car-rental.webp",
});

export const ABOUT_SLIDES = Object.freeze([
  { src: MEDIA.aboutSinquerimFort, alt: "Fort Aguada walls at Sinquerim Beach, Goa" },
  { src: MEDIA.aboutFortAguada, alt: "Fort Aguada headland seen from the sea, Goa" },
  { src: MEDIA.aboutParasailing, alt: "Parasailing at Calangute Beach, Goa" },
  { src: MEDIA.scuba, alt: "Scuba divers at Havelock, Andaman Islands" },
]);

/** Attribution for third-party photos (Wikimedia Commons). Required by their licences. */
export const PHOTO_CREDITS = Object.freeze([
  {
    subject: "Banana boat ride",
    author: "PattayaPatrol",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:DFC_0972_Four_friends_in_life_vests_ride_a_yellow_inflatable_banana_boat_across_calm_water_at_sunset.jpg",
  },
  {
    subject: "Jet ski riders",
    author: "Julian Lupyan",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source:
      "https://commons.wikimedia.org/wiki/File:Group_of_Jet_Ski_Riders,_Key_West,_Florida,_2025.jpg",
  },
  {
    subject: "Jet ski towing an inflatable ride",
    author: "PattayaPatrol",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:DFC_0523_A_person_riding_a_jet_ski_pulls_an_inflatable_banana_boat_with_riders_across_calm_water.jpg",
  },
  {
    subject: "Tour boat at Coco Beach, Goa",
    author: "Deepak Patil",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Dolphin_Ride_at_Coco_Beach_-_panoramio.jpg",
  },
  {
    subject: "Parasailing over the Goa sea",
    author: "rajeshodayanchal",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Flying_goa_sea.JPG",
  },
  {
    subject: "Scuba divers at Havelock, Andaman Islands",
    author: "AshwiniShinde",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Scuba_Diving_Havelock.jpg",
  },
  {
    subject: "Dolphins off Baga, Goa",
    author: "Amboeing747",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Dolphins_at_baga.JPG",
  },
  {
    subject: "Sunset at Mandrem Beach, Goa",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mandrem_Beach_at_sunset,_Mandrem,_Goa,_India.jpg",
  },
  {
    subject: "Sinquerim Beach from Fort Aguada at sunset, Goa",
    author: "iMahesh",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sinquerim_Beach_from_the_fort_during_Sunset.jpg",
  },
  {
    subject: "Fort Aguada walls at Sinquerim Beach, Goa",
    author: "MaximusPrasad",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Sinquerim_Beach154.jpg",
  },
  {
    subject: "Fort Aguada headland seen from the sea, Goa",
    author: "Nikhilb239",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Fort_Aguada_Remote_view_25012016.jpg",
  },
  {
    subject: "Parasailing at Calangute Beach, Goa",
    author: "Praveen from Bangalore, India",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    source: "https://commons.wikimedia.org/wiki/File:Parasailing_on_the_Calangute_beach,_Goa.jpg",
  },
]);

export const RESPONSIVE_WIDTHS = Object.freeze([640, 960, 1280, 1920, 2560]);

/** Logo rendition: fixed height, original aspect ratio, transparent background kept. */
export const LOGO_SRC = MEDIA.logo.replace("/upload/", "/upload/c_limit,h_160,f_auto,q_auto/");

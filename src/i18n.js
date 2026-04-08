import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        list: 'List',
        nearby: 'Nearby',
        contact: 'Contact us',
        allCategory: 'ALL CATEGORY',
        login: 'Login',
        dashboard: 'Dashboard',
        settings: 'Settings',
        signOut: 'Sign Out'
      },
      hero: {
        titlePrefix: 'GO',
        titleSuffix: 'EAZY',
        subtitle: 'Find your perfect home, wherever you go.',
        desc: 'Rooms · Flats · Hostels · PGs — verified, affordable, and right where you need to be.',
        searchPlaceholder: 'Search by city or area... (e.g. Koramangala, Pune)',
        searchBtn: 'Search',
        trusted: 'Trusted by 50,000+ students & professionals',
        stats: {
          listings: 'Active Listings',
          rating: 'Average Rating',
          verified: 'Verified Landlords'
        }
      },
      search: {
        quoteStart: '"Less searching, more living — that’s',
        quoteEnd: 'Eazy Living',
        resultsFound: 'Explore {{count}} {{type}} ready for you',
        properties: 'Properties',
        filters: 'Filters',
        resetAll: 'Reset All',
        apply: 'Apply Filters',
        sortBy: 'Sort By',
        priceRange: 'Rent Range (₹ / mo)',
        cityArea: 'City & Area',
        allTypes: 'All Types',
        sort: {
          created_at_desc: 'Newest First',
          created_at_asc: 'Oldest First',
          price_asc: 'Price: Low to High',
          price_desc: 'Price: High to Low',
          views_desc: 'Most Popular'
        }
      },
      property: {
        types: {
          Room: 'Room',
          Flat: 'Flat',
          Hostel: 'Hostel',
          PG: 'PG'
        },
        labels: {
          from: 'From',
          guests: 'guests',
          beds: 'beds',
          bedrooms: 'bedrooms',
          views: 'views',
          active: 'Active',
          inactive: 'Inactive',
          back: 'Back to Search'
        },
        sections: {
          about: 'About',
          keyDetails: 'Key Details',
          amenities: 'Amenities',
          nearby: 'Nearby Landmarks',
          agent: 'Listing Agent',
          requestContact: 'Request contact',
          owner: 'Property Owner',
          detailsLocked: 'Details Locked',
          lockDesc: 'Pay a small fee to see the owner\'s exact address and phone number for direct contact.',
          unlockBtn: 'Unlock Details for ₹9',
          processing: 'Processing...',
          signinPrompt: 'Please sign in to unlock owner contact details.',
          callNow: 'Call Now',
          sendEmail: 'Send Email',
          contactLocked: 'Contact details locked. Unlock to view.'
        }
      },
      footer: {
        description: "India's premium platform for students and professionals to find their perfect home away from home.",
        forRenters: 'For Renters',
        forLandlords: 'For Landlords',
        contact: 'Contact',
        allRights: '© 2026 GoEazy. All rights reserved.',
        availableIndia: 'Available across Uttarakhand',
        cities: 'Dehradun · Srinagar · Nainital · Rishikesh · Haridwar · and more...',
        links: {
          rooms: 'Browse Rooms',
          flats: 'Browse Flats',
          hostels: 'Browse Hostels',
          pgs: 'Browse PGs',
          searchCity: 'Search by City',
          list: 'List a Property',
          manage: 'Manage Listings',
          analytics: 'View Analytics',
          dashboard: 'Landlord Dashboard',
          pricing: 'Pricing Plans',
          privacy: 'Privacy Policy',
          terms: 'Terms of Service',
          cookie: 'Cookie Policy',
          refund: 'Refund Policy'
        }
      },
      legal: {
        privacy: {
          title: 'Privacy Policy',
          lastUpdated: 'Last Updated: April 2026',
          intro: 'At GoEazy, we value your privacy. This policy explains how we collect and use your data to provide a better property search experience.',
          sections: [
            { h: 'Data Collection', p: 'We collect your name, email, and phone number when you register or unlock property details.' },
            { h: 'How We Use Data', p: 'Your data is used to provide contact information for property listings and to improve our services.' },
            { h: 'Data Security', p: 'We take industry-standard measures to protect your personal information from unauthorized access.' }
          ]
        },
        terms: {
          title: 'Terms of Service',
          lastUpdated: 'Last Updated: April 2026',
          sections: [
            { h: 'Platform Usage', p: 'Users must provide accurate information when listing or searching for properties.' },
            { h: 'Listing Rules', p: 'Landlords are responsible for the accuracy of their property details and images.' },
            { h: 'Limitation of Liability', p: 'GoEazy is a connector and is not responsible for disputes between landlords and tenants.' }
          ]
        },
        cookies: {
          title: 'Cookie Policy',
          lastUpdated: 'Last Updated: April 2026',
          sections: [
            { h: 'What are Cookies?', p: 'Cookies are small text files used to remember your preferences and login state.' },
            { h: 'Our Usage', p: 'We use cookies for authentication and to save your search filters and favorites.' }
          ]
        },
        refund: {
          title: 'Refund Policy',
          lastUpdated: 'Last Updated: April 2026',
          sections: [
            { h: 'Unlock Fees', p: 'GoEazy charges a small convenience fee (₹9) to unlock property owner contact details.' },
            { h: 'Non-Refundable Policy', p: 'The ₹9 fee is strictly NON-REFUNDABLE. This fee covers the immediate service of providing restricted contact information.' },
            { h: 'Exceptions', p: 'Refunds are only processed in case of technical payment failures where the details were not unlocked despite a successful charge.' }
          ]
        }
      },
      nearbyPage: {
        title: 'Nearby Services',
        comingSoon: 'Coming Soon',
        desc: "We're curating a verified list of laundry, tiffin services, and essential utilities to make your stay even easier.",
        back: 'Back to Explore'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        list: 'लिस्ट करें',
        nearby: 'नज़दीकी',
        contact: 'संपर्क करें',
        allCategory: 'सभी श्रेणियां',
        login: 'लॉगिन',
        dashboard: 'डैशबोर्ड',
        settings: 'सेटिंग्स',
        signOut: 'लॉग आउट'
      },
      hero: {
        titlePrefix: 'GO',
        titleSuffix: 'EAZY',
        subtitle: 'अपना आदर्श घर खोजें, जहाँ भी आप जाएँ।',
        desc: 'कमरे · फ्लैट · हॉस्टल · पीजी — सत्यापित, किफायती और जहाँ आपको ज़रूरत है।',
        searchPlaceholder: 'शहर या क्षेत्र खोजें... (जैसे: कोरामंगला, पुणे)',
        searchBtn: 'खोजें',
        trusted: '50,000+ छात्रों और पेशेवरों द्वारा भरोसेमंद',
        stats: {
          listings: 'सक्रिय लिस्टिंग',
          rating: 'औसत रेटिंग',
          verified: 'सत्यापित मकान मालिक'
        }
      },
      search: {
        quoteStart: '"कम खोजें, ज़्यादा जिएं — यही है',
        quoteEnd: 'ईज़ी लिविंग।',
        resultsFound: 'आपके लिए {{count}} {{type}} तैयार हैं',
        properties: 'प्रॉपर्टीज',
        filters: 'फिल्टर',
        resetAll: 'सब रीसेट करें',
        apply: 'फिल्टर लागू करें',
        sortBy: 'इसके अनुसार क्रमबद्ध करें',
        priceRange: 'किराया सीमा (₹ / माह)',
        cityArea: 'शहर और क्षेत्र',
        allTypes: 'सभी प्रकार',
        sort: {
          created_at_desc: 'नवीनतम पहले',
          created_at_asc: 'पुराना पहले',
          price_asc: 'कीमत: कम से ज्यादा',
          price_desc: 'कीमत: ज्यादा से कम',
          views_desc: 'सबसे लोकप्रिय'
        }
      },
      property: {
        types: {
          Room: 'कमरा',
          Flat: 'फ्लैट',
          Hostel: 'हॉस्टल',
          PG: 'पीजी'
        },
        labels: {
          from: 'से',
          guests: 'मेहमान',
          beds: 'बेड',
          bedrooms: 'बेडरूम',
          views: 'व्यूज',
          active: 'सक्रिय',
          inactive: 'निष्क्रिय',
          back: 'खोज पर वापस जाएं'
        },
        sections: {
          about: 'विवरण',
          keyDetails: 'मुख्य विवरण',
          amenities: 'सुविधाएं',
          nearby: 'नज़दीकी लैंडमार्क',
          agent: 'लिस्टिंग एजेंट',
          requestContact: 'संपर्क के लिए अनुरोध करें',
          owner: 'संपत्ति के मालिक',
          detailsLocked: 'विवरण लॉक हैं',
          lockDesc: 'सीधे संपर्क के लिए मालिक का सटीक पता और फोन नंबर देखने के लिए एक छोटा सा शुल्क भुगतान करें।',
          unlockBtn: '₹9 में विवरण अनलॉक करें',
          processing: 'प्रक्रिया चल रही है...',
          signinPrompt: 'मालिक के संपर्क विवरण अनलॉक करने के लिए कृपया साइन इन करें।',
          callNow: 'अभी कॉल करें',
          sendEmail: 'ईमेल भेजें',
          contactLocked: 'संपर्क विवरण लॉक हैं। देखने के लिए अनलॉक करें।'
        }
      },
      footer: {
        description: 'GoEazy सही आवास खोजने में आपका भरोसेमंद साथी है। हम छात्रों और पेशेवरों को सत्यापित संपत्तियों से जोड़ते हैं।',
        forRenters: 'किरायेदारों के लिए',
        forLandlords: 'मकान मालिकों के लिए',
        contact: 'संपर्क करें',
        allRights: '© 2026 GoEazy. सर्वाधिकार सुरक्षित।',
        availableIndia: 'पूरे उत्तराखंड में उपलब्ध',
        cities: 'देहरादून · श्रीनगर · नैनीताल · ऋषिकेश · हरिद्वार · और अन्य शहर...',
        links: {
          rooms: 'कमरे देखें',
          flats: 'फ्लैट देखें',
          hostels: 'हॉस्टल देखें',
          pgs: 'पीजी देखें',
          searchCity: 'शहर द्वारा खोजें',
          list: 'प्रॉपर्टी लिस्ट करें',
          manage: 'लिस्टिंग प्रबंधित करें',
          analytics: 'एनालिटिक्स देखें',
          dashboard: 'लैंडलॉर्ड डैशबोर्ड',
          pricing: 'कीमत योजनाएं',
          privacy: 'गोपनीयता नीति',
          terms: 'सेवा की शर्तें',
          cookie: 'कुकी नीति',
          refund: 'रिफंड नीति'
        }
      },
      legal: {
        privacy: {
          title: 'गोपनीयता नीति',
          lastUpdated: 'अंतिम अपडेट: अप्रैल 2026',
          intro: 'GoEazy में, हम आपकी गोपनीयता का सम्मान करते हैं। यह नीति बताती है कि हम आपके अनुभव को बेहतर बनाने के लिए डेटा का कैसे उपयोग करते हैं।',
          sections: [
            { h: 'डेटा संग्रह', p: 'जब आप पंजीकरण करते हैं या प्रॉपर्टी विवरण अनलॉक करते हैं, तो हम आपका नाम, ईमेल और फोन नंबर एकत्र करते हैं।' },
            { h: 'डेटा का उपयोग', p: 'आपके डेटा का उपयोग प्रॉपर्टी लिस्टिंग के संपर्क विवरण प्रदान करने और हमारी सेवाओं को बेहतर बनाने के लिए किया जाता है।' },
            { h: 'डेटा सुरक्षा', p: 'हम आपकी व्यक्तिगत जानकारी को सुरक्षित रखने के लिए उद्योग-मानक उपाय करते हैं।' }
          ]
        },
        terms: {
          title: 'सेवा की शर्तें',
          lastUpdated: 'अंतिम अपडेट: अप्रैल 2026',
          sections: [
            { h: 'प्लेटफॉर्म का उपयोग', p: 'प्रॉपर्टी लिस्टिंग या खोजते समय उपयोगकर्ताओं को सटीक जानकारी प्रदान करनी चाहिए।' },
            { h: 'लिस्टिंग नियम', p: 'मकान मालिक अपने प्रॉपर्टी विवरण और छवियों की सटीकता के लिए स्वयं जिम्मेदार हैं।' },
            { h: 'दायित्व की सीमा', p: 'GoEazy एक सुविधा प्रदाता है और मकान मालिकों और किरायेदारों के बीच के विवादों के लिए जिम्मेदार नहीं है।' }
          ]
        },
        cookies: {
          title: 'कुकी नीति',
          lastUpdated: 'अंतिम अपडेट: अप्रैल 2026',
          sections: [
            { h: 'कुकीज़ क्या हैं?', p: 'कुकीज़ छोटी टेक्स्ट फाइलें हैं जिनका उपयोग आपकी प्राथमिकताओं और लॉगिन स्थिति को याद रखने के लिए किया जाता है।' },
            { h: 'उपयोग', p: 'हम प्रमाणीकरण (authentication) और आपके सर्च फिल्टर को सहेजने के लिए कुकीज़ का उपयोग करते हैं।' }
          ]
        },
        refund: {
          title: 'रिफंड नीति',
          lastUpdated: 'अंतिम अपडेट: अप्रैल 2026',
          sections: [
            { h: 'अनलॉक शुल्क', p: 'GoEazy प्रॉपर्टी मालिक के संपर्क विवरण अनलॉक करने के लिए एक छोटा सुविधा शुल्क (₹9) लेता है।' },
            { h: 'नॉन-रिफंडेबल पॉलिसी', p: '₹9 का शुल्क पूरी तरह से नॉन-रिफंडेबल (NON-REFUNDABLE) है। यह शुल्क विवरण प्रदान करने की तत्काल सेवा के लिए है।' },
            { h: 'अपवाद', p: 'रिफंड केवल तकनीकी खराबी के मामलों में दिया जाता है जहां सफलतापूर्वक शुल्क कटने के बावजूद विवरण अनलॉक नहीं हुए हों।' }
          ]
        }
      },
      nearbyPage: {
        title: 'नज़दीकी सेवाएँ',
        comingSoon: 'जल्द आ रहा है',
        desc: 'हम लॉन्ड्री, टिफिन सर्विस और अन्य आवश्यक सेवाओं की एक सत्यापित सूची तैयार कर रहे हैं ताकि आपका रहना और भी आसान हो सके।',
        back: 'होम पर वापस जाएं'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

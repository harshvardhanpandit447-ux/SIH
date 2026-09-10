/**
 * AGRO VISION - Universal Marathi Localization & Translation Engine
 * Provides comprehensive translation mappings for:
 * 1. Entity Names (Farmers, FPOs, Buyers, Admin/Regulator, Contact Persons)
 * 2. Crops, Commodities, Categories & Varieties
 * 3. Mandis, Talukas, Villages & Warehouse Hubs
 * 4. Statuses, Escrow States & Dispute Categories
 * 5. Quality Grades & Agricultural Metrics
 */

export type Language = 'en' | 'mr';

// Entity Name Mappings
const ENTITY_DICTIONARY: Record<string, string> = {
  // Farmers
  'Sopanrao Patil': 'सोपानराव पाटील',
  'Sopanrao': 'सोपानराव',
  'Ramesh Jadhav': 'रमेश जाधव',
  'Ananda Shinde': 'आनंदा शिंदे',
  'Dnyaneshwar Gaikwad': 'ज्ञानेश्वर गायकवाड',
  'Tukaram Shinde': 'तुकाराम शिंदे',
  'Babanrao Pawar': 'बबनराव पवार',
  'Sunil Kadam': 'सुनील कदम',
  'Vitthal Thorat': 'विठ्ठल थोरात',
  'Maruti Shinde': 'मारुती शिंदे',
  'Kisan Baban Jadhav': 'किसन बबन जाधव',
  'Dattatray Kokate': 'दत्तात्रय कोकाटे',
  'Mahadev Landge': 'महादेव लांडगे',
  'Khanderao Thorat': 'खंडेराव थोरात',

  // FPOs
  'Shivneri Agri Farmers Producer Co.': 'शिवनेरी कृषी शेतकरी उत्पादक कंपनी',
  'Shivneri Agri Farmers Producer Co': 'शिवनेरी कृषी शेतकरी उत्पादक कंपनी',
  'Shivneri FPC': 'शिवनेरी एफपीसी',
  'Shivneri': 'शिवनेरी एफपीसी',
  'Junnar Taluka Agro Farmers FPC': 'जुन्नर तालुका ॲग्रो शेतकरी एफपीसी',
  'Junner Agro Producer Co.': 'जुन्नर ॲग्रो शेतकरी उत्पादक कंपनी',
  'Junnar Agro Producer Co.': 'जुन्नर ॲग्रो शेतकरी उत्पादक कंपनी',
  'Junnar FPC': 'जुन्नर एफपीसी',
  'Baramati Agro Vikas FPC': 'बारामती ॲग्रो विकास एफपीसी',
  'Baramati Krishi Producer Co.': 'बारामती कृषी उत्पादक कंपनी',
  'Baramati FPC': 'बारामती एफपीसी',
  'Khed Farmers Producer Co. Ltd.': 'खेड शेतकरी उत्पादक कंपनी लि.',
  'Khed Farmers Producer Co.': 'खेड शेतकरी उत्पादक कंपनी',
  'Khed FPC': 'खेड एफपीसी',
  'Indrayani Agri FPC': 'इंद्रायणी ॲग्री एफपीसी',
  'Daund Farmers Agro FPC': 'दौंड फार्मर्स ॲग्रो एफपीसी',
  'Daund FPC': 'दौंड एफपीसी',
  'Sahyadri Farmer Producer Co.': 'सह्याद्री शेतकरी उत्पादक कंपनी',
  'MahaAgro Farmer Producer Co.': 'महाॲग्रो शेतकरी उत्पादक कंपनी',

  // Buyers
  'Sahyadri Fresh Wholesale Pvt Ltd': 'सह्याद्री फ्रेश होलसेल प्रायव्हेट लिमिटेड',
  'Sahyadri Fresh Wholesale': 'सह्याद्री फ्रेश होलसेल',
  'Sahyadri Fresh': 'सह्याद्री फ्रेश',
  'Sahyadri': 'सह्याद्री',
  'Pune Retail Supermarkets Consortium': 'पुणे रिटेल सुपरमार्केट्स समूह',
  'Pune Retail Supermarkets': 'पुणे रिटेल सुपरमार्केट्स',
  'MahaAgro Export Corporation': 'महाॲग्रो एक्सपोर्ट कॉर्पोरेशन',
  'MahaAgro Exports': 'महाॲग्रो एक्सपोर्ट्स',
  'Metro Cash & Carry Pune Hub': 'मेट्रो कॅश अँड कॅरी पुणे केंद्र',
  'Reliance Retail Agro Procurement': 'रिलायन्स रिटेल ॲग्रो खरेदी विभाग',
  'BigBasket Regional Fulfillment Hub': 'बिगबास्केट प्रादेशिक वितरण केंद्र',
  'Deccan Fresh Supplies': 'डेक्कन फ्रेश सप्लायर्स',

  // Admin & Regulators
  'Maharashtra Agri Marketing Board (MSAMB)': 'महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB)',
  'Maharashtra State Agricultural Marketing Board': 'महाराष्ट्र राज्य कृषी पणन मंडळ',
  'State Agricultural Marketing Board': 'राज्य कृषी पणन मंडळ',
  'MSAMB Pune': 'महाराष्ट्र कृषी पणन मंडळ (पुणे)',
  'MSAMB': 'महाराष्ट्र कृषी पणन मंडळ',
  'Market Regulator (MSAMB)': 'राज्य कृषी बाजार नियामक (MSAMB)',

  // Contact Persons & Designations
  'Sachin Darekar (CEO)': 'सचिन दरेकर (मुख्य कार्यकारी अधिकारी)',
  'Sachin Darekar': 'सचिन दरेकर',
  'Rajesh Mehta': 'राजेश मेहता',
  'Dr. Nitin Thorat (Director of Marketing)': 'डॉ. नितीन थोरात (विपणन संचालक)',
  'Dr. Nitin Thorat': 'डॉ. नितीन थोरात',
  'Dr. Nitin Thorat (Admin)': 'डॉ. नितीन थोरात (प्रशासक)',
  'CEO': 'मुख्य कार्यकारी अधिकारी (CEO)',
  'Director of Marketing': 'विपणन संचालक',
  'State Agricultural Marketing & Dispute Resolution Cell': 'राज्य कृषी पणन व तक्रार निवारण कक्ष',
  'Institutional Wholesaler & Supermarket Supplier': 'संस्थात्मक घाऊक व्यापारी व सुपरमार्केट पुरवठादार'
};

// Crop / Commodity Mappings
const CROP_DICTIONARY: Record<string, string> = {
  'Onion': 'कांदा',
  'onion': 'कांदा',
  'Red Onion': 'लाल कांदा',
  'Summer Onion': 'उन्हाळी कांदा',
  'Tomato': 'टोमॅटो',
  'tomato': 'टोमॅटो',
  'Grapes': 'द्राक्षे',
  'grapes': 'द्राक्षे',
  'Pomegranate': 'डाळिंब',
  'pomegranate': 'डाळिंब',
  'Bhagwa Pomegranate': 'भगवा डाळिंब',
  'Sugarcane': 'ऊस',
  'sugarcane': 'ऊस',
  'Soybean': 'सोयाबीन',
  'soybean': 'सोयाबीन',
  'Wheat': 'गहू',
  'wheat': 'गहू',
  'Ginger': 'आले (अद्रक)',
  'ginger': 'आले (अद्रक)',
  'Turmeric': 'हळद',
  'turmeric': 'हळद',
  'Potato': 'बटाटा',
  'potato': 'बटाटा',
  'Cabbage': 'कोबी',
  'cabbage': 'कोबी',
  'Cauliflower': 'फ्लॉवर',
  'cauliflower': 'फ्लॉवर',
  'Green Chilli': 'हिरवी मिरची',
  'green chilli': 'हिरवी मिरची',
  'Custard Apple': 'सीताफळ',
  'custard apple': 'सीताफळ',
  'Garlic': 'लसूण',
  'garlic': 'लसूण',
  'Gram': 'हरभरा',
  'gram': 'हरभरा',
  'Maize': 'मका',
  'maize': 'मका',
  'Cotton': 'कापूस',
  'cotton': 'कापूस',

  // Categories
  'Vegetables': 'भाजीपाला',
  'vegetables': 'भाजीपाला',
  'Fruits': 'फळे',
  'fruits': 'फळे',
  'Grains': 'धान्य',
  'grains': 'धान्य',
  'Pulses': 'कडधान्ये',
  'pulses': 'कडधान्ये',
  'Spices': 'मसाले',
  'spices': 'मसाले',
  'Cash Crops': 'नगदी पिके',
  'cash crops': 'नगदी पिके'
};

// Mandis & Locations
const MANDI_DICTIONARY: Record<string, string> = {
  // Mandis
  'Pune Gultekdi': 'पुणे गुलटेकडी',
  'pune gultekdi': 'पुणे गुलटेकडी',
  'Gultekdi': 'गुलटेकडी (पुणे)',
  'Narayangaon (Junnar)': 'नारायणगाव (जुन्नर)',
  'narayangaon (junnar)': 'नारायणगाव (जुन्नर)',
  'Narayangaon': 'नारायणगाव',
  'narayangaon': 'नारायणगाव',
  'Baramati APMC': 'बारामती बाजार समिती',
  'baramati apmc': 'बारामती बाजार समिती',
  'Baramati': 'बारामती',
  'baramati': 'बारामती',
  'Khed (Chakan)': 'खेड (चाकण)',
  'khed (chakan)': 'खेड (चाकण)',
  'Khed': 'खेड',
  'khed': 'खेड',
  'Chakan': 'चाकण',
  'Daund APMC': 'दौंड बाजार समिती',
  'daund apmc': 'दौंड बाजार समिती',
  'Daund': 'दौंड',
  'daund': 'दौंड',
  'Shirur APMC': 'शिरूर बाजार समिती',
  'shirur apmc': 'शिरूर बाजार समिती',
  'Shirur': 'शिरूर',
  'shirur': 'शिरूर',
  'Manchar (Ambegaon)': 'मंचर (आंबेगाव)',
  'manchar (ambegaon)': 'मंचर (आंबेगाव)',
  'Manchar': 'मंचर',
  'manchar': 'मंचर',
  'Moshi APMC': 'मोशी उपबाजार',
  'Moshi': 'मोशी',
  'Indapur APMC': 'इंदापूर बाजार समिती',
  'Indapur': 'इंदापूर',
  'Bhor': 'भोर',
  'Haveli': 'हवेली',
  'Saswad': 'सासवड',

  // Hubs & Villages
  'Otur, Junnar, Pune': 'ओतूर, जुन्नर, पुणे',
  'Otur': 'ओतूर',
  'Junnar': 'जुन्नर',
  'Pune': 'पुणे',
  'Maharashtra': 'महाराष्ट्र',
  'Narayangaon Hub, Pune-Nashik Highway': 'नारायणगाव केंद्र, पुणे-नाशिक महामार्ग',
  'Narayangaon, Junnar': 'नारायणगाव, जुन्नर',
  'Narayangaon FPO Aggregation Center, Pune': 'नारायणगाव FPO एकत्रीकरण केंद्र, पुणे',
  'Pune Market Yard, Gultekdi': 'पुणे मार्केट यार्ड, गुलटेकडी',
  'Baramati MIDC Cold Hub': 'बारामती एमआयडीसी शीतगृह केंद्र',
  'Chakan Industrial Hub, Pune': 'चाकण औद्योगिक केंद्र, पुणे',
  '500 MT Ventilated Onion Chawl & Cold Hub': '५०० मे.टन कांदा चाळ व शीतगृह केंद्र',
  '300 MT Pre-cooling & Packhouse': '३०० मे.टन प्री-कूलिंग व पॅकहाऊस'
};

// Statuses & Lifecycle Codes
const STATUS_DICTIONARY: Record<string, string> = {
  'PENDING_FPO_REVIEW': 'FPO पुनरावलोकन प्रलंबित',
  'APPROVED_BY_FPO': 'FPO द्वारे मंजूर',
  'AGGREGATED_INTO_LOT': 'लॉटमध्ये समाविष्ट',
  'REJECTED': 'नाकारले',
  'OPEN': 'सक्रिय / उपलब्ध',
  'MATCHED': 'जुळलेले',
  'OFFER_SENT': 'ऑफर पाठवली',
  'OFFER_ACCEPTED': 'ऑफर मंजूर',
  'ESCROW_LOCKED': 'एस्क्रो सुरक्षित',
  'ESCROW_FUNDED': 'एस्क्रो रक्कम जमा',
  'IN_TRANSIT': 'वाहतुकीत (मार्गावर)',
  'DELIVERED': 'वितरित झाले',
  'COMPLETED': 'यशस्वीरित्या पूर्ण',
  'CANCELLED': 'रद्द केले',
  'VERIFIED_FPC': 'प्रमाणित FPC',
  'VERIFIED': 'पडताळणी पूर्ण ✓',
  'PENDING': 'प्रलंबित',
  'PENDING_KYC': 'केवायसी प्रलंबित',
  'ACTIVE': 'सक्रिय',
  'CLOSED': 'बंद',
  'DISPUTED': 'तक्रार दाखल',
  'RESOLVED': 'तक्रार निवारण पूर्ण'
};

// Quality Grades
const GRADE_DICTIONARY: Record<string, string> = {
  'Grade A': 'A प्रत (उत्कृष्ट दर्जा)',
  'grade a': 'A प्रत (उत्कृष्ट दर्जा)',
  'Grade A+': 'A+ प्रत (निर्यात दर्जा)',
  'grade a+': 'A+ प्रत (निर्यात दर्जा)',
  'A+ Premium Export': 'A+ उत्कृष्ट निर्यात दर्जा',
  'A Grade Mandi Standard': 'A प्रत मानक मंडई',
  'Grade B': 'B प्रत (व्यावसायिक दर्जा)',
  'grade b': 'B प्रत (व्यावसायिक दर्जा)',
  'B Grade Commercial': 'B प्रत व्यावसायिक',
  'Grade C': 'C प्रत (स्थानिक/प्रक्रिया)',
  'grade c': 'C प्रत (स्थानिक/प्रक्रिया)',
  'C Grade Local / Process': 'C प्रत स्थानिक/प्रक्रिया'
};

// Dispute Categories
const DISPUTE_DICTIONARY: Record<string, string> = {
  'QUALITY_MISMATCH': 'गुणवत्ता प्रतवारीतील तफावत',
  'WEIGHT_SHORTAGE': 'वजनात / गोण्यांमध्ये तूट',
  'TRANSIT_DELAY': 'वाहतुकीस विलंब व नुकसान',
  'PACKAGING_DAMAGE': 'पॅकिंग व हाताळणीतील नुकसान',
  'PAYMENT_HOLD': 'पेमेंट संबंधित वाद'
};

/**
 * Translates any Entity name (Farmer, FPO, Buyer, Admin, Person)
 */
export function tEntity(name?: string | null, language: Language = 'en'): string {
  if (!name) return '';
  if (language !== 'mr') return name;
  return ENTITY_DICTIONARY[name] || ENTITY_DICTIONARY[name.trim()] || name;
}

/**
 * Translates any Commodity, Crop, Category or Variety
 */
export function tCrop(crop?: string | null, language: Language = 'en'): string {
  if (!crop) return '';
  if (language !== 'mr') return crop;
  return CROP_DICTIONARY[crop] || CROP_DICTIONARY[crop.trim()] || crop;
}

/**
 * Translates any Mandi, Taluka, Village or Location
 */
export function tMandi(location?: string | null, language: Language = 'en'): string {
  if (!location) return '';
  if (language !== 'mr') return location;
  return MANDI_DICTIONARY[location] || MANDI_DICTIONARY[location.trim()] || location;
}

/**
 * Translates any status or lifecycle badge
 */
export function tStatus(status?: string | null, language: Language = 'en'): string {
  if (!status) return '';
  if (language !== 'mr') return status;
  return STATUS_DICTIONARY[status] || STATUS_DICTIONARY[status.trim()] || status;
}

/**
 * Translates Quality Grade labels
 */
export function tGrade(grade?: string | null, language: Language = 'en'): string {
  if (!grade) return '';
  if (language !== 'mr') return grade;
  return GRADE_DICTIONARY[grade] || GRADE_DICTIONARY[grade.trim()] || grade;
}

/**
 * Translates Dispute categories
 */
export function tDispute(cat?: string | null, language: Language = 'en'): string {
  if (!cat) return '';
  if (language !== 'mr') return cat;
  return DISPUTE_DICTIONARY[cat] || DISPUTE_DICTIONARY[cat.trim()] || cat;
}

/**
 * Helper to format currency numbers
 */
export function formatCurrency(amount: number, _language: Language = 'en'): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

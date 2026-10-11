// Local context for district pages. Facts are general public knowledge about each district
// (industries, institutions, landmarks). They describe the LOCATION, not Vidhya Security Force's
// clients or staff. VERIFY every line before publishing, and add real VSF details where you have them.

export interface DistrictProfile {
  name: string;
  division: string; // revenue division
  highlight: string; // short phrase used in the page tagline
  intro: string; // 1-2 factual sentences about the district's economy/security context
  sectors: string[]; // 4 types of sites likely to need guards / housekeeping here
  areas: string[]; // 4 local areas, institutions or corridors
}

export const districtProfiles: Record<string, DistrictProfile> = {
  'agar-malwa': {
    name: 'Agar Malwa', division: 'Ujjain Division', highlight: 'Agri-Mandi & Temple Town Security',
    intro: 'Agar Malwa was carved out of Shajapur district and is an agriculture-driven district in the Malwa plateau, known for soybean and wheat trade and the Baijnath Mahadev temple at Agar.',
    sectors: ['Agri Mandi Yards & Warehouses', 'Temple Trusts & Pilgrim Facilities', 'Banks, Cooperative Societies & ATMs', 'Schools, Colleges & Hostels'],
    areas: ['Agar Town Mandi Area', 'Baijnath Mahadev Temple Zone', 'Susner & Nalkheda Belts', 'Agra-Mumbai Highway Stretch'],
  },
  alirajpur: {
    name: 'Alirajpur', division: 'Indore Division', highlight: 'Tribal-Belt Institutions & Border Corridor',
    intro: 'Alirajpur is a tribal district in western Madhya Pradesh bordering Gujarat, with an economy built on cotton, maize and government-led development works.',
    sectors: ['Government Offices & Treasury Premises', 'Banks & Cooperative Societies', 'Cotton Ginning & Agri Storage', 'Hostels, Schools & Health Centres'],
    areas: ['Alirajpur District HQ', 'Jobat Town', 'Bhabra & Katthiwada Belts', 'Gujarat-Border Road Corridor'],
  },
  anuppur: {
    name: 'Anuppur', division: 'Shahdol Division', highlight: 'Coalfield, Paper Mill & Amarkantak Pilgrim Security',
    intro: 'Anuppur sits in the Shahdol coal belt and is home to SECL coal mines, the Amlai paper industry and the Amarkantak pilgrim area, where the Narmada rises.',
    sectors: ['Coal Mine Colonies & Washery Sites', 'Paper Mill & Industrial Units', 'Pilgrim Dharamshalas & Temple Trusts', 'Railway Stations & Goods Yards'],
    areas: ['Anuppur Town & Railway Junction', 'Amlai Paper Mill Area', 'Jaithari & Kotma Coal Belt', 'Amarkantak Pilgrim Zone'],
  },
  ashoknagar: {
    name: 'Ashoknagar', division: 'Gwalior Division', highlight: 'Chanderi Textile & Agri-Trade Security',
    intro: 'Ashoknagar district includes Chanderi, famous for its handloom sarees, and is a wheat and soybean producing area along the Gwalior-Bhopal corridor.',
    sectors: ['Handloom Showrooms & Weaving Clusters', 'Agri Mandi & Warehousing', 'Banks & Financial Offices', 'Heritage Sites & Tourist Facilities'],
    areas: ['Ashoknagar Town', 'Chanderi Heritage & Weaver Cluster', 'Isagarh & Mungaoli Belts', 'Gwalior-Bhopal Rail & Road Corridor'],
  },
  balaghat: {
    name: 'Balaghat', division: 'Jabalpur Division', highlight: 'Mining, Forest-Belt & Industrial Security',
    intro: 'Balaghat is known for the Malanjkhand copper mine, manganese deposits and rice cultivation, with forest areas bordering Kanha National Park.',
    sectors: ['Mining Colonies & Ore Handling Yards', 'Rice Mills & Agri Warehouses', 'Hotels & Eco-Tourism Properties', 'Banks, Hospitals & Schools'],
    areas: ['Balaghat Town', 'Malanjkhand Mining Township', 'Baihar & Lanji Belts', 'Kanha Buffer Road Corridor'],
  },
  barwani: {
    name: 'Barwani', division: 'Indore Division', highlight: 'Narmada Valley Cotton & Institutional Security',
    intro: 'Barwani lies on the Narmada in the Nimar region, with cotton farming and trade at Sendhwa and Pansemal, and large Sardar Sarovar-related development works.',
    sectors: ['Cotton Ginning & Trading Yards', 'Banks & Financial Offices', 'Construction & Infrastructure Sites', 'Schools, Hostels & Hospitals'],
    areas: ['Barwani Town', 'Sendhwa Mandi & Industrial Area', 'Pansemal & Rajpur Belts', 'Narmada Valley Road Corridor'],
  },
  betul: {
    name: 'Betul', division: 'Narmadapuram Division', highlight: 'Power Plant, Coal & Highway Corridor Security',
    intro: 'Betul is a forested plateau district on the Nagpur-Bhopal highway corridor, home to the Satpura power station at Sarni, WCL coal mines and the Tapti origin at Multai.',
    sectors: ['Power Plant & Coal Mine Townships', 'Transport Depots & Highway Facilities', 'Timber & Agri Warehousing', 'Banks, Colleges & Hospitals'],
    areas: ['Betul Bazar & Civil Lines', 'Sarni Power & Coal Township', 'Amla & Multai Towns', 'NH-46 Highway Belt'],
  },
  bhind: {
    name: 'Bhind', division: 'Chambal Division', highlight: 'Chambal Region Commercial & Agri Security',
    intro: 'Bhind is in the Chambal region of northern Madhya Pradesh, with mustard and wheat as main crops, a growing logistics role along the Atal Progress Way and strong demand for licensed security.',
    sectors: ['Banks, Jewellers & Cash-Handling Points', 'Agri Mandi & Cold Storage', 'Schools, Colleges & Coaching Institutes', 'Residential Colonies & Hospitals'],
    areas: ['Bhind City Market Area', 'Ater & Gohad Belts', 'Lahar & Mehgaon Towns', 'Atal Progress Way Corridor'],
  },
  burhanpur: {
    name: 'Burhanpur', division: 'Indore Division', highlight: 'Powerloom Textile & Heritage City Security',
    intro: 'Burhanpur is a historic Tapti-river city known for powerloom textiles, banana cultivation and heritage sites like Asirgarh Fort, on the Mumbai-Delhi railway line.',
    sectors: ['Powerloom Units & Textile Godowns', 'Banana & Agri Trade Yards', 'Banks & Jewellery Showrooms', 'Heritage Sites & Tourist Facilities'],
    areas: ['Burhanpur City Textile Market', 'Nepanagar Industrial Area', 'Shahpur & Khaknar Belts', 'Asirgarh Fort Tourism Zone'],
  },
  chhatarpur: {
    name: 'Chhatarpur', division: 'Sagar Division', highlight: 'Khajuraho Tourism & Bundelkhand Security',
    intro: 'Chhatarpur is a Bundelkhand district that includes Khajuraho, a UNESCO World Heritage site, and has granite and stone-mining activity alongside strong hospitality demand.',
    sectors: ['Hotels, Resorts & Tourist Properties', 'Granite & Stone Processing Units', 'Banks, Hospitals & Schools', 'Airport & Transport Facilities'],
    areas: ['Chhatarpur City', 'Khajuraho Temple & Hotel Zone', 'Nowgong & Bijawar Belts', 'Khajuraho Airport Road'],
  },
  chhindwara: {
    name: 'Chhindwara', division: 'Jabalpur Division', highlight: 'Coalfield, Orange Belt & Industrial Security',
    intro: 'Chhindwara has the WCL Pench Valley coalfields at Parasia and Pench National Park, along with orange orchards and a growing industrial base around the city.',
    sectors: ['Coal Mine Colonies & Washery Sites', 'Orange Orchards & Cold Storage', 'Industrial Units & Warehouses', 'Hotels, Banks & Hospitals'],
    areas: ['Chhindwara City & Civil Lines', 'Parasia & Pench Valley Coal Belt', 'Sausar & Tamia Towns', 'Nagpur-Chhindwara Road Corridor'],
  },
  damoh: {
    name: 'Damoh', division: 'Sagar Division', highlight: 'Pilgrim Trust & Bundelkhand Commercial Security',
    intro: 'Damoh is a Bundelkhand district with Kundalpur, an important Jain pilgrimage centre, and a mix of agriculture, tendu-leaf trade and stone quarrying.',
    sectors: ['Jain Temples & Pilgrim Dharamshalas', 'Banks, Hospitals & Schools', 'Agri Mandi & Warehouses', 'Stone Quarry & Processing Units'],
    areas: ['Damoh City Market', 'Kundalpur Pilgrim Zone', 'Hatta & Patera Towns', 'Sagar-Damoh Road Corridor'],
  },
  datia: {
    name: 'Datia', division: 'Gwalior Division', highlight: 'Heritage Town & Delhi-Mumbai Rail Corridor Security',
    intro: 'Datia is a heritage town near Gwalior known for its palace and the Pitambara Peeth shrine, on the Delhi-Jhansi rail and road corridor.',
    sectors: ['Temple Trusts & Pilgrim Facilities', 'Banks & Financial Offices', 'Agri Mandi & Warehouses', 'Schools, Hospitals & Hotels'],
    areas: ['Datia City', 'Pitambara Peeth Pilgrim Zone', 'Bhander & Seondha Towns', 'Gwalior-Jhansi Corridor'],
  },
  dhar: {
    name: 'Dhar', division: 'Indore Division', highlight: 'Industrial, Textile Park & Heritage Security',
    intro: 'Dhar district includes the Pithampur industrial area, the PM MITRA textile park at Bhainsola, the heritage town of Mandu and large auto and pharma manufacturing clusters near Indore.',
    sectors: ['Factories & Manufacturing Plants', 'Textile Park & Warehousing', 'Heritage Hotels & Tourist Properties', 'Banks, Schools & Hospitals'],
    areas: ['Dhar City', 'Pithampur-Sagore Industrial Belt', 'PM MITRA Textile Park, Bhainsola', 'Mandu Heritage Zone'],
  },
  dindori: {
    name: 'Dindori', division: 'Jabalpur Division', highlight: 'Tribal-District Institutional & Forest Belt Security',
    intro: 'Dindori is a largely tribal district on the upper Narmada, with agriculture, forest produce and government welfare programmes forming the core of the local economy.',
    sectors: ['Government Offices & Treasury Premises', 'Banks & Cooperative Societies', 'Hostels, Schools & Health Centres', 'Agri & Forest Produce Storage'],
    areas: ['Dindori District HQ', 'Shahpura Town', 'Amarpur & Bajag Belts', 'Jabalpur-Dindori Road Corridor'],
  },
  guna: {
    name: 'Guna', division: 'Gwalior Division', highlight: 'Agri-Trade & NH Corridor Security',
    intro: 'Guna is an agri-trade district on the Agra-Mumbai corridor with large garlic, wheat and soybean markets and fort and heritage sites at Raghogarh and Bajrangarh.',
    sectors: ['Agri Mandi & Cold Storage', 'Banks, Jewellers & ATMs', 'Highway Transport & Dhaba Facilities', 'Schools, Hospitals & Hostels'],
    areas: ['Guna City & Mandi Area', 'Raghogarh Town', 'Bamori & Aron Belts', 'Agra-Mumbai Highway Corridor'],
  },
  harda: {
    name: 'Harda', division: 'Narmadapuram Division', highlight: 'Narmada Valley Agri & Warehouse Security',
    intro: 'Harda is a fertile Narmada-valley district with wheat, soybean and paddy production, large mandi trade and warehousing near the Itarsi-Khandwa rail line.',
    sectors: ['Agri Mandi & Warehouses', 'Banks & Cooperative Societies', 'Rail & Transport Facilities', 'Schools, Hospitals & Hostels'],
    areas: ['Harda City & Mandi', 'Timarni & Khirkiya Belts', 'Narmada Valley Farm Belt', 'Itarsi-Khandwa Rail Corridor'],
  },
  hoshangabad: {
    name: 'Hoshangabad (Narmadapuram)', division: 'Narmadapuram Division', highlight: 'Security Paper Mill, Itarsi Rail Hub & Narmada Ghat Security',
    intro: 'Narmadapuram (Hoshangabad) hosts the Security Paper Mill, the major Itarsi railway junction and Pachmarhi hill-station access, with large wheat and soybean trade.',
    sectors: ['Security Paper Mill & Industrial Units', 'Railway Junctions & Goods Yards', 'Hotels & Pachmarhi Tourism Properties', 'Banks, Hospitals & Schools'],
    areas: ['Narmadapuram City & Sethani Ghat', 'Itarsi Junction & Industrial Area', 'Pipariya & Sohagpur Towns', 'Pachmarhi Hill Road Corridor'],
  },
  jhabua: {
    name: 'Jhabua', division: 'Indore Division', highlight: 'Tribal-Belt Institutions & Kadaknath Poultry Security',
    intro: 'Jhabua is a tribal district in western Madhya Pradesh, known for the Kadaknath black fowl and for the Meghnagar and Petlawad trading towns on the Gujarat border.',
    sectors: ['Government Offices & Treasury Premises', 'Poultry & Agri Processing Units', 'Banks & Cooperative Societies', 'Schools, Hostels & Hospitals'],
    areas: ['Jhabua Town', 'Meghnagar Commercial Area', 'Petlawad & Thandla Towns', 'Gujarat-Border Road Belt'],
  },
  katni: {
    name: 'Katni', division: 'Jabalpur Division', highlight: 'Limestone, Cement & Rail Junction Security',
    intro: 'Katni is a major rail junction and limestone-mining district with cement and lime industries and mineral processing units around Murwara and Bahoriband.',
    sectors: ['Cement & Lime Industrial Units', 'Mines & Mineral Processing Yards', 'Rail Junctions & Goods Sheds', 'Banks, Hospitals & Schools'],
    areas: ['Katni City & Murwara', 'Katni Junction Rail Hub', 'Bahoriband & Vijayraghavgarh Belts', 'Jabalpur-Katni Road Corridor'],
  },
  khandwa: {
    name: 'Khandwa', division: 'Indore Division', highlight: 'Omkareshwar Pilgrim, Dam & Rail Junction Security',
    intro: 'Khandwa is a Nimar district with the Omkareshwar pilgrim centre, the Indira Sagar Dam at Punasa and the important Khandwa railway junction on the Mumbai-Delhi trunk route.',
    sectors: ['Dam, Power & Irrigation Facilities', 'Pilgrim Temples & Dharamshalas', 'Cotton & Agri Processing Units', 'Railway Junctions, Banks & Hospitals'],
    areas: ['Khandwa City & Junction Area', 'Omkareshwar Pilgrim Zone', 'Indira Sagar Dam Area', 'Burhanpur-Khandwa Highway Belt'],
  },
  khargone: {
    name: 'Khargone', division: 'Indore Division', highlight: 'Power Plant, Cotton & Maheshwar Handloom Security',
    intro: 'Khargone has the NTPC Khargone power plant, a major cotton economy at Sanawad and Bhikangaon, and Maheshwar, known for its handloom sarees and Narmada ghats.',
    sectors: ['Power Plant & Industrial Sites', 'Cotton Ginning & Textile Units', 'Heritage Hotels & Tourist Properties', 'Banks, Hospitals & Schools'],
    areas: ['Khargone City', 'NTPC Khargone Power Plant Belt', 'Maheshwar Ghat & Handloom Zone', 'Sanawad & Barwah Towns'],
  },
  mandla: {
    name: 'Mandla', division: 'Jabalpur Division', highlight: 'Narmada Forest-Belt & Tourism Security',
    intro: 'Mandla is a tribal district on the Narmada with part of Kanha National Park in its limits, and a local economy of agriculture, forest produce and wildlife tourism.',
    sectors: ['Wildlife Resorts & Tourist Properties', 'Government Offices & Treasury Premises', 'Banks & Cooperative Societies', 'Schools, Hostels & Hospitals'],
    areas: ['Mandla Town & Narmada Ghats', 'Kanha Tourism Gateway', 'Niwas & Bichhiya Belts', 'Jabalpur-Mandla Road Corridor'],
  },
  mandsaur: {
    name: 'Mandsaur', division: 'Ujjain Division', highlight: 'Pashupatinath Temple, Slate-Pencil & Agri Security',
    intro: 'Mandsaur is known for the Pashupatinath temple, the slate-pencil industry, large garlic and opium-poppy markets and strong banking and trading activity on the Indore-Kota route.',
    sectors: ['Slate-Pencil & Small Industrial Units', 'Agri Mandi, Garlic & Cold Storage', 'Temple Trusts & Pilgrim Facilities', 'Banks, Hospitals & Schools'],
    areas: ['Mandsaur City & Mandi', 'Pashupatinath Temple Zone', 'Malhargarh & Neemuch-Road Belt', 'Indore-Kota Highway Corridor'],
  },
  morena: {
    name: 'Morena', division: 'Chambal Division', highlight: 'Chambal Expressway, Mustard Trade & Heritage Security',
    intro: 'Morena lies in the Chambal region on the Delhi-Mumbai rail corridor, with mustard trade, sandstone mining, the Chausath Yogini temple at Mitawali and the Atal Progress Way.',
    sectors: ['Mustard Oil Mills & Agri Warehouses', 'Sandstone Quarries & Processing Units', 'Banks, Jewellers & Cash-Handling Points', 'Schools, Hospitals & Hotels'],
    areas: ['Morena City', 'Banmore Industrial Area', 'Sabalgarh & Ambah Towns', 'Atal Progress Way Corridor'],
  },
  narsinghpur: {
    name: 'Narsinghpur', division: 'Jabalpur Division', highlight: 'Power Plant & Tur-Dal Mill Security',
    intro: 'Narsinghpur has the NTPC Gadarwara super thermal power plant and the Gadarwara tur-dal processing industry, on the Narmada-valley route between Jabalpur and Bhopal.',
    sectors: ['Power Plant & Construction Sites', 'Dal Mills & Agri Warehouses', 'Banks & Cooperative Societies', 'Schools, Hospitals & Hostels'],
    areas: ['Narsinghpur City', 'Gadarwara Industrial & Mandi Area', 'NTPC Gadarwara Belt', 'Jabalpur-Bhopal Highway Corridor'],
  },
  neemuch: {
    name: 'Neemuch', division: 'Ujjain Division', highlight: 'Cement, Opium Works & CRPF-Town Security',
    intro: 'Neemuch hosts the Vikram Cement plant at Khor, the Government Opium and Alkaloid Works and a CRPF Group Centre, and is a leading medicinal-poppy and spice trading centre.',
    sectors: ['Cement Plant & Industrial Units', 'Agri Mandi & Warehouses', 'Banks, Jewellers & Cash-Handling Points', 'Schools, Hospitals & Hostels'],
    areas: ['Neemuch City', 'Khor Cement Industrial Belt', 'Jawad & Manasa Towns', 'Rajasthan-Border Highway Corridor'],
  },
  niwari: {
    name: 'Niwari', division: 'Sagar Division', highlight: 'Orchha Heritage & Bundelkhand Hospitality Security',
    intro: 'Niwari is one of the newer districts of Madhya Pradesh and includes Orchha, a major heritage destination on the Betwa river with temples, palaces and a growing hotel sector.',
    sectors: ['Heritage Hotels & Resorts', 'Temple Trusts & Tourist Facilities', 'Banks & Government Offices', 'Agri Mandi & Warehouses'],
    areas: ['Niwari Town', 'Orchha Heritage Zone', 'Prithvipur Town', 'Jhansi-Niwari Road Corridor'],
  },
  panna: {
    name: 'Panna', division: 'Sagar Division', highlight: 'Diamond Mining & Tiger Reserve Security',
    intro: 'Panna is India\'s diamond district, with the NMDC Majhgawan diamond mine, Panna Tiger Reserve and a growing wildlife-tourism sector.',
    sectors: ['Mining Sites & Mineral Handling Yards', 'Wildlife Resorts & Tourist Properties', 'Banks, Jewellers & Cash-Handling Points', 'Schools, Hospitals & Offices'],
    areas: ['Panna Town', 'Majhgawan Diamond Mining Area', 'Panna Tiger Reserve Gateway', 'Pawai & Ajaigarh Belts'],
  },
  raisen: {
    name: 'Raisen', division: 'Bhopal Division', highlight: 'Mandideep Industrial Area & Sanchi Heritage Security',
    intro: 'Raisen district includes the Mandideep and Obaidullaganj industrial areas next to Bhopal, with pharma, engineering and food units, and the UNESCO site of Sanchi.',
    sectors: ['Factories & Manufacturing Plants', 'Pharma, Engineering & Food Units', 'Heritage Sites & Tourist Facilities', 'Banks, Schools & Hospitals'],
    areas: ['Mandideep Industrial Area', 'Obaidullaganj Belt', 'Sanchi Stupa Heritage Zone', 'Bhopal-Raisen Road Corridor'],
  },
  rajgarh: {
    name: 'Rajgarh', division: 'Bhopal Division', highlight: 'Soybean-Trade & Highway Corridor Security',
    intro: 'Rajgarh is a soybean and wheat producing district on the Agra-Mumbai corridor, with trading centres at Biaora and Narsinghgarh and fort and lake heritage at Narsinghgarh.',
    sectors: ['Agri Mandi & Warehouses', 'Banks & Cooperative Societies', 'Highway Transport Facilities', 'Schools, Hospitals & Hostels'],
    areas: ['Rajgarh Town', 'Biaora Mandi Area', 'Narsinghgarh Town', 'Agra-Mumbai Highway Corridor'],
  },
  ratlam: {
    name: 'Ratlam', division: 'Ujjain Division', highlight: 'Rail Hub, Sev & Jewellery Market Security',
    intro: 'Ratlam is a major Western Railway junction and divisional headquarters, famous for its sev snack and gold jewellery market, with industrial units around the Ratlam industrial area.',
    sectors: ['Railway Yards & Logistics Facilities', 'Jewellers, Banks & Cash-Handling Points', 'Namkeen & Food Processing Units', 'Hospitals, Schools & Hotels'],
    areas: ['Ratlam City & Sarafa Bazar', 'Ratlam Junction & Rail Colony', 'Jaora & Alot Towns', 'Ratlam Industrial Area'],
  },
  rewa: {
    name: 'Rewa', division: 'Rewa Division', highlight: 'Solar Park, White Tiger Safari & City Security',
    intro: 'Rewa is the divisional headquarters of the Vindhya region, with the Rewa Ultra Mega Solar Park, the Mukundpur white tiger safari and a growing education and commercial sector.',
    sectors: ['Solar Park & Power Infrastructure', 'Hotels, Safari & Tourist Properties', 'Banks, Hospitals & Universities', 'Commercial Complexes & Warehousing'],
    areas: ['Rewa City & Civil Lines', 'Rewa Ultra Mega Solar Park', 'Mukundpur Safari Zone', 'Gurh & Teonthar Belts'],
  },
  sagar: {
    name: 'Sagar', division: 'Sagar Division', highlight: 'University City, Refinery & Cantonment Belt Security',
    intro: 'Sagar is the divisional headquarters of Bundelkhand, home to Dr Harisingh Gour University, a major army cantonment and the Bina refinery and junction.',
    sectors: ['Refinery & Industrial Facilities', 'Universities, Colleges & Hostels', 'Banks, Hospitals & Commercial Complexes', 'Rail Junctions & Logistics Yards'],
    areas: ['Sagar City & Civil Lines', 'Bina Refinery & Junction Area', 'Rehli & Khurai Towns', 'Bhopal-Sagar Highway Corridor'],
  },
  satna: {
    name: 'Satna', division: 'Rewa Division', highlight: 'Cement Cluster & Chitrakoot Pilgrim Security',
    intro: 'Satna is one of India\'s main cement-producing districts, with a large limestone and cement cluster, a major rail junction and access to the Chitrakoot pilgrim area.',
    sectors: ['Cement Plants & Limestone Mines', 'Industrial Warehouses & Logistics Yards', 'Banks, Hospitals & Schools', 'Hotels & Pilgrim Facilities'],
    areas: ['Satna City & Civil Lines', 'Satna Junction Rail Hub', 'Cement Plant Industrial Belt', 'Chitrakoot Pilgrim Road'],
  },
  sehore: {
    name: 'Sehore', division: 'Bhopal Division', highlight: 'Bhopal-Indore Highway & Sharbati Wheat Belt Security',
    intro: 'Sehore lies next to Bhopal on the Bhopal-Indore corridor and is famous for Sharbati wheat, with industrial units, warehousing and educational institutions around the district.',
    sectors: ['Industrial Units & Warehouses', 'Agri Mandi & Cold Storage', 'Banks, Hospitals & Schools', 'Highway Logistics & Hotels'],
    areas: ['Sehore City', 'Ashta & Ichhawar Towns', 'Bhopal-Indore Highway Belt', 'Sehore Industrial Area'],
  },
  seoni: {
    name: 'Seoni', division: 'Jabalpur Division', highlight: 'Power Plant, Pench Tourism & NH-44 Security',
    intro: 'Seoni lies on the Nagpur-Jabalpur national highway, with the Jhabua Power plant at Barela, the Pench Tiger Reserve and Lakhnadon as a key trading town.',
    sectors: ['Power Plant & Industrial Sites', 'Wildlife Resorts & Tourist Properties', 'Highway Transport & Warehousing', 'Banks, Hospitals & Schools'],
    areas: ['Seoni City', 'Barela Power Plant Area', 'Lakhnadon Town', 'NH-44 Highway Corridor'],
  },
  shahdol: {
    name: 'Shahdol', division: 'Shahdol Division', highlight: 'Coalfield & Divisional HQ Security',
    intro: 'Shahdol is the divisional headquarters of a coal-bearing region, with SECL coalfields near Sohagpur, coalbed-methane activity and a large government and institutional presence.',
    sectors: ['Coal Mine Colonies & Washery Sites', 'Banks & Government Offices', 'Hospitals, Schools & Hostels', 'Railway & Transport Facilities'],
    areas: ['Shahdol City & Civil Lines', 'Sohagpur Coal Belt', 'Burhar & Beohari Towns', 'Katni-Bilaspur Rail Corridor'],
  },
  shajapur: {
    name: 'Shajapur', division: 'Ujjain Division', highlight: 'Agri-Mandi & Malwa Highway Security',
    intro: 'Shajapur is a Malwa agricultural district with large soybean and wheat markets at Shujalpur and Shajapur and good connectivity to Indore, Ujjain and Bhopal.',
    sectors: ['Agri Mandi & Warehouses', 'Banks & Cooperative Societies', 'Highway Transport Facilities', 'Schools, Hospitals & Hostels'],
    areas: ['Shajapur City', 'Shujalpur Mandi Area', 'Kalapipal & Moman Badodiya Belts', 'Agra-Mumbai Highway Corridor'],
  },
  sheopur: {
    name: 'Sheopur', division: 'Chambal Division', highlight: 'Kuno National Park & Chambal Region Security',
    intro: 'Sheopur is the north-western edge of Madhya Pradesh, home to Kuno National Park and its cheetah reintroduction programme, with sandstone and forest-based activity.',
    sectors: ['Wildlife Resorts & Tourist Properties', 'Government Offices & Treasury Premises', 'Banks & Cooperative Societies', 'Stone & Agri Storage Units'],
    areas: ['Sheopur Town & Fort Area', 'Kuno National Park Gateway', 'Vijaypur & Karahal Belts', 'Rajasthan-Border Road Corridor'],
  },
  shivpuri: {
    name: 'Shivpuri', division: 'Gwalior Division', highlight: 'Madhav National Park & Heritage City Security',
    intro: 'Shivpuri is a heritage city on the Agra-Mumbai corridor, with Madhav National Park, royal chhatris and a mix of agri trade, stone industry and tourism.',
    sectors: ['Hotels & Tourist Properties', 'Stone & Small Industrial Units', 'Banks, Hospitals & Schools', 'Agri Mandi & Warehouses'],
    areas: ['Shivpuri City', 'Madhav National Park Gateway', 'Kolaras & Pohri Towns', 'Agra-Mumbai Highway Corridor'],
  },
  sidhi: {
    name: 'Sidhi', division: 'Rewa Division', highlight: 'Tiger Reserve & Power-Belt Security',
    intro: 'Sidhi lies in the Vindhya region next to the Singrauli power belt and includes part of the Sanjay-Dubri Tiger Reserve, with agriculture and government institutions at its core.',
    sectors: ['Power & Infrastructure Construction Sites', 'Wildlife Resorts & Tourist Properties', 'Banks, Hospitals & Schools', 'Agri & Forest Produce Storage'],
    areas: ['Sidhi Town', 'Churhat & Rampur Naikin Belts', 'Sanjay-Dubri Tiger Reserve Zone', 'Rewa-Sidhi Road Corridor'],
  },
  singrauli: {
    name: 'Singrauli', division: 'Rewa Division', highlight: 'Coal & Power Capital Security',
    intro: 'Singrauli is the energy capital of India, with NTPC Vindhyachal, the Sasan Ultra Mega Power Project, Northern Coalfields Limited and a large mining and ash-handling economy.',
    sectors: ['Power Plants & Coal Mine Sites', 'Industrial Townships & Contractor Camps', 'Transport & Coal-Logistics Yards', 'Banks, Hospitals & Schools'],
    areas: ['Waidhan & Jayant Mining Belt', 'NTPC Vindhyachal Township', 'Sasan Power Project Area', 'Singrauli Rail & Road Corridor'],
  },
  tikamgarh: {
    name: 'Tikamgarh', division: 'Sagar Division', highlight: 'Bundelkhand Heritage & Granite Belt Security',
    intro: 'Tikamgarh is a Bundelkhand district with Bundela heritage sites, granite and stone processing, and tobacco and agri trade centred around the district headquarters.',
    sectors: ['Granite & Stone Processing Units', 'Banks, Jewellers & Cash-Handling Points', 'Agri Mandi & Warehouses', 'Hospitals, Schools & Hotels'],
    areas: ['Tikamgarh City', 'Kundeshwar Temple Zone', 'Jatara & Baldeogarh Towns', 'Jhansi-Tikamgarh Road Corridor'],
  },
  umaria: {
    name: 'Umaria', division: 'Shahdol Division', highlight: 'Bandhavgarh Tourism & Coal Belt Security',
    intro: 'Umaria is the gateway to Bandhavgarh Tiger Reserve and has SECL coal mining at Umaria and Pali, making it a mix of wildlife tourism and coal-field industry.',
    sectors: ['Wildlife Resorts & Tourist Properties', 'Coal Mine Colonies & Industrial Sites', 'Banks, Hospitals & Schools', 'Railway & Transport Facilities'],
    areas: ['Umaria Town & Civil Lines', 'Bandhavgarh Tourism Zone', 'Pali & Manpur Towns', 'Katni-Umaria Rail Corridor'],
  },
  vidisha: {
    name: 'Vidisha', division: 'Bhopal Division', highlight: 'Heritage City & Wheat-Mandi Security',
    intro: 'Vidisha is a historic city on the Betwa river near Bhopal, with Udayagiri caves and the Heliodorus pillar, and large wheat, soybean and pulses trade through its mandis.',
    sectors: ['Agri Mandi & Warehouses', 'Heritage Hotels & Tourist Facilities', 'Banks, Hospitals & Schools', 'Small Industrial Units'],
    areas: ['Vidisha City', 'Udayagiri Heritage Zone', 'Basoda & Sironj Towns', 'Bhopal-Vidisha Highway Corridor'],
  },
  mauganj: {
    name: 'Mauganj', division: 'Rewa Division', highlight: 'New District Institutions & Vindhya Belt Security',
    intro: 'Mauganj was created in 2023 from Rewa district as part of Madhya Pradesh\'s new district restructuring, with new government, banking and institutional buildings coming up in the Vindhya region.',
    sectors: ['New Government Offices & Treasury Premises', 'Banks & Cooperative Societies', 'Construction & Infrastructure Sites', 'Schools, Hospitals & Hostels'],
    areas: ['Mauganj Town', 'Hanumana & Naigarhi Belts', 'Rewa-Prayagraj Road Corridor', 'Waterfall & Tourism Zones'],
  },
  pandhurna: {
    name: 'Pandhurna', division: 'Jabalpur Division', highlight: 'Orange-Belt & Gotmar Fair Security',
    intro: 'Pandhurna was created in 2023 from Chhindwara district and is known for the annual Gotmar fair, orange orchards and cotton trade near the Maharashtra border.',
    sectors: ['Fair & Large-Event Crowd Management', 'Orange & Cotton Trade Yards', 'Banks & Government Offices', 'Schools, Hospitals & Hostels'],
    areas: ['Pandhurna Town', 'Sausar Belt', 'Gotmar Fair Ground', 'Nagpur-Chhindwara Road Corridor'],
  },
  maihar: {
    name: 'Maihar', division: 'Rewa Division', highlight: 'Sharda Devi Pilgrim & Cement Belt Security',
    intro: 'Maihar was created in 2023 from Satna district and is known worldwide for the Sharda Devi temple, with a major cement plant and many pilgrim facilities.',
    sectors: ['Pilgrim Temple & Dharamshala Facilities', 'Cement Plant & Industrial Units', 'Banks, Hospitals & Schools', 'Hotels & Transport Facilities'],
    areas: ['Maihar Town', 'Sharda Devi Temple Zone', 'Cement Plant Industrial Belt', 'Satna-Katni Rail Corridor'],
  },
};

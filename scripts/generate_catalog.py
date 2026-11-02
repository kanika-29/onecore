import os, sys, re, json, subprocess, zipfile, xml.etree.ElementTree as ET

ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

EXCEL_FILE = 'Onecore_Website_Product_Content_By_Specialization.xlsx'
IMG_DIR = 'drive-download-20261022T075842Z-1-001'
PUBLIC_PRODUCTS_DIR = 'public/assets/products'

os.makedirs(PUBLIC_PRODUCTS_DIR, exist_ok=True)

# 1. Therapeutic Area Mapping
# 1 = Women’s Health (womens-health)
# 2 = Paediatrics (paediatrics)
# 3 = Orthopaedics (orthopaedics)
# 4 = Neurology (neurology)
# 5 = Ophthalmology (ophthalmology)
# 6 = Dermatology (dermatology)
# 7 = ENT (ent)
# 8 = General Medicine (general-medicine)
# 9 = Oncology (oncology)

SPEC_TO_AREA_ID = {
    'femme': 1,
    'pediaplus': 2,
    'ortheon': 3,
    'neurix': 4,
    'eyrix': 5,
    'vellis': 6,
    'otira': 7,
    'omnara': 8,
    'cytos': 9,
}

AREA_METADATA = {
    1: {'slug': 'womens-health', 'name': "Women's Health"},
    2: {'slug': 'paediatrics', 'name': 'Paediatrics'},
    3: {'slug': 'orthopaedics', 'name': 'Orthopaedics'},
    4: {'slug': 'neurology', 'name': 'Neurology'},
    5: {'slug': 'ophthalmology', 'name': 'Ophthalmology'},
    6: {'slug': 'dermatology', 'name': 'Dermatology'},
    7: {'slug': 'ent', 'name': 'ENT'},
    8: {'slug': 'general-medicine', 'name': 'General Medicine'},
    9: {'slug': 'oncology', 'name': 'Oncology'},
}

def extract_excel_sheets(filepath):
    with zipfile.ZipFile(filepath) as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('m:si', ns):
                text = ''.join(t.text for t in si.findall('.//m:t', ns) if t.text)
                shared_strings.append(text)
        
        rels_tree = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        rels = {r.attrib['Id']: r.attrib['Target'].lstrip('/') for r in rels_tree.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')}
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = wb_tree.findall('m:sheets/m:sheet', ns)

        def get_sheet_rows(name):
            matching = [s for s in sheets if s.attrib['name'].strip().lower() == name.strip().lower()]
            if not matching: return []
            s = matching[0]
            rid = s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            target = rels[rid]
            sheet_path = target if target.startswith('xl/') else 'xl/' + target
            sheet_tree = ET.fromstring(z.read(sheet_path))
            rows = sheet_tree.findall('m:sheetData/m:row', ns)
            data = []
            for r in rows:
                row_vals = []
                for c in r.findall('m:c', ns):
                    t = c.attrib.get('t')
                    v_el = c.find('m:v', ns)
                    val = shared_strings[int(v_el.text)] if (t == 's' and v_el is not None and v_el.text) else (v_el.text if v_el is not None else '')
                    row_vals.append(val)
                data.append(row_vals)
            return data

        all_sheets = {}
        for s in sheets:
            sname = s.attrib['name']
            all_sheets[sname] = get_sheet_rows(sname)
        return all_sheets

print("Reading Excel sheets...")
sheets_data = extract_excel_sheets(EXCEL_FILE)

# Build S.No to Spec mapping from specialization sheets
sno_to_spec = {}
for spec_sheet, area_id in SPEC_TO_AREA_ID.items():
    for sheet_name, rows in sheets_data.items():
        if sheet_name.strip().lower() == spec_sheet:
            for r in rows[1:]:
                if r and r[0]:
                    sno_to_spec[r[0].strip()] = area_id

# Specific overrides for Unmatched items
unmatched_overrides = {
    '1': 1,   # Glypocal-LP Tablets -> Women's Health (Femme)
    '3': 1,   # Folatis-D -> Women's Health (Femme)
    '14': 1,  # Ferticore -> Women's Health (PCOS)
    '21': 1,  # Folatis-CA -> Women's Health (Femme)
    '30': 8,  # Doxicent-100 -> General Medicine (Omnara)
    '31': 8,  # Doxicent-200 -> General Medicine (Omnara)
    '96': 5,  # Fixtear-PG -> Ophthalmology (Eyrix)
    '125': 4, # Citirix 250 -> Neurology (Neurix)
    '151': 2, # Glypocal-LP Syrup -> Paediatrics (Pediaplus)
    '158': 2, # Wayomega-LC -> Paediatrics (Pediaplus)
}
sno_to_spec.update(unmatched_overrides)

def slugify(text):
    text = text.replace('™', '').replace('®', '')
    text = re.sub(r'[\(\)]', '', text)
    text = re.sub(r'[^a-zA-Z0-9]+', '-', text).strip('-').lower()
    return text

drive_images = os.listdir(IMG_DIR) if os.path.exists(IMG_DIR) else []
pub_images = os.listdir(PUBLIC_PRODUCTS_DIR) if os.path.exists(PUBLIC_PRODUCTS_DIR) else []

CUSTOM_IMAGE_MAP = {
    'glypocal-lp-tablets': 'Glypocal LP blister with 15 tablets.png',
    'glypocal-lp': 'Clean, straightened Onecore Glypocal LP box.png',
    'glypocal-junior': 'Glypocal.jpg',
    'glypocal-gummies': 'Glypocal Gummies.png',
    'folatis': 'Folatis tablet carton with blister.png',
    'folatis-d': 'Folatis-D carton with silver blister.png',
    'folatis-ca': 'Folatis™-CA carton with 15-tablet strip.png',
    'folatis-et': 'Folatis™-ET carton with amber blister strip.png',
    'feoma-xt': 'FEOMA-XT carton, left-side three-quarter view.png',
    'feoma-fcm': 'FEOMA™-FCM pharmaceutical carton and vial.png',
    'feoma-plus': 'Feoma-Plus carton with fifteen softgels.png',
    'gestemme-300': 'Blue Gestemme-300 carton and blister.png',
    'humiphin': 'humiphin-5000.jpeg',
    'humiphin-5000': 'humiphin-5000.jpeg',
    'throfree': 'Refined Throfree carton mockup.png',
    'easefate': 'Realistic Easefate Suspension Bottle and Carton.png',
    'clindaone-c': 'Clindaone-C Carton with Three-Unit Softgel Strip.png',
    'clindaone-n': 'ClindaOne-N gel carton and tube.png',
    'clindaone-ct': 'clindaone-ct.jpeg',
    'noretio-10': 'NORETIO™-10 carton with blister pack.png',
    'ovamme-m': 'Ovamme-M.png',
    'ovamme': 'Ovamme™ carton with silver softgel strip.png',
    'traxpause-750': 'Traxpause™-750 Carton with Silver Blister Strip.png',
    'traxpause-mf': 'traxpause-mf.jpeg',
    'cranly': 'Cranly carton with official Onecore logo.png',
    'womento': 'Womento Nutrition Pouch with ONECORE Logo.png',
    'fosfomycin': 'Fosfomycin Powder Carton and Sachet.png',
    'stomazo-d': 'STOMAZO-D carton and blister.png',
    'stomazo-40': 'Stomazo 40.png',
    'panflat-dsr': 'PANFLAT-DSR carton and Alu-Alu pack.png',
    'rabeprazole': 'Rabeprazole Injection Kit Packaging.png',
    'frecox-p': 'FRECOX-P carton and blister pack.png',
    'frecox-sp': 'FRECOX-SP carton with alu-alu blister.png',
    'frecox-th': 'FRECOX-TH Box with 10-Tablet Blister.png',
    'frecox-r': 'Crimson FRECOX-R carton with Alu-Alu strip.png',
    'cefvanta-250': 'Blue CEFVANTA-250 medicine box.png',
    'cefvanta-500': 'CEFVANTA-500 box and blister pack.png',
    'cefvanta-cv': 'Corrected CEFVANTA-CV carton lettering.png',
    'rabtico-20': 'Rabtico 20.jpeg',
    'rabtico-dsr': 'Rabtico DSR.png',
    'oneriv-d3-60k': 'Oneriv Vitamin D3 carton front.png',
    'oneriv-d3-drops': 'Oneriv D3.jpg',
    'ekabro': 'EKABRO™ acebrophylline carton mockup.png',
    'ekabro-od': 'Ekabro-OD.png',
    'ekabro-ac': 'EKABRO-AC Emerald Carton and Strip.png',
    'sultics-375': 'sultics-375.jpeg',
    'sultics-750': 'sultics-750.jpeg',
    'deftos-6': 'deftos-6.jpeg',
    'oneq10-lm': 'oneq10-lm.jpeg',
    'melacore': 'Melacore cream tube and carton.png',
    'clobtos-s': 'CLOBTOS-S ointment carton and tube.png',
    'flutiriv': 'FLUTIRIV NS box and nasal spray.png',
    'flutiriv-ns': 'FLUTIRIV NS box and nasal spray.png',
    'flutiriv-az': 'Flutiriv-AZ carton and bottle redesign.png',
    'otomentin-625': 'otomentin-625.jpeg',
    'otomentin-ds': 'OTOMENTIN DS.png',
    'otomentin-duo': 'OTOMENTIN DUO.png',
    'bilariv': 'BILARIV violet carton and tablet strip.png',
    'moxable': 'Moxable™ Periwinkle Eye Drops Mockup.png',
    'moxable-k': 'Moxable-K purple ophthalmic packaging mockup.png',
    'moxable-df': 'Moxable-DF eye drops packaging.png',
    'moxable-lp': 'Moxable™-LP teal carton and dropper.png',
    'lotovo': 'Lotovo packaging with cool teal wave accents.png',
    'lotovo-t': 'Lotovo-T packaging with strength line removed.png',
    'tobraway-f': 'Tobraway-F sterile eye drops packaging.png',
    'anglecent-tm': 'Anglecent TM eye drops with corrected branding.png',
    'angelcent-tm': 'Anglecent TM eye drops with corrected branding.png',
    'brimway-tm': 'Brimway-TM eye drops carton and bottle.png',
    'brimway': 'Brimway eye drops carton and bottle (1).png',
    'nepsolve': 'Nepsolve™ Green Wave Eye Drop Mockup.png',
    'olgerix': 'Olgerix .png',
    'olgerix-max': 'Olgerix Max.jpeg',
    'olgerix-kt': 'Olgerix-KT ophthalmic packaging mockup.png',
    'fixtear-pg': 'Fixtear PG.png',
    'fixtear': 'Fixtear PG.png',
    'fixtear-plus': 'Fixteam Plus.png',
    'fixtear-eye-ointment': 'Fixtear Sky-Blue Ointment Tube and Carton.png',
    'ocuvion': 'Ocuvion Eye Drops Packaging Set.png',
    'brosolve': 'Brosolve.jpeg',
    'brinstar': 'Brinstar brinzolamide eye drop packaging.png',
    'brinstar-bt': 'Brinstar-BT.jpeg',
    'brinstar-tm': 'Brinstar-TM.jpeg',
    'rixtear-f': 'Rixtear-F ophthalmic carton and dropper bottle.png',
    'natvue': 'Natvue Ophthalmic Dropper Packaging.png',
    'ikarix': 'Ikarix Eye Drops Carton and Bottle.png',
    'predtos': 'Predtos ophthalmic drops packaging mockup.png',
    'vorcore': 'Centered Vorcore carton on clean background.png',
    'gonvir': 'Gonvir ophthalmic gel carton and tube.png',
    'phenicort': 'Phenicort™ eye ointment packaging mockup.png',
    'nervia': 'NERVIA™ carton with amber insert.png',
    'nervia-g': 'NERVIA™-GM Carton and Silver Strip.png',
    'nervia-od': 'Nervia-OD capsule packaging mockup.png',
    'nervia-forte': 'NERVIA FORTE with amber molded tray.png',
    'nervia-plus': 'Nervia Plus carton and capsule strip.png',
    'nervia-nx': 'NERVIA-NX box beside 10-tablet blister.png',
    'nervia-pg': 'NERVIA-PG carton with silver blister strip.png',
    'citirix-p': 'CITIRIX™-P carton and silver tablet strip.png',
    'citirix': 'Indigo Citirix Carton with Silver Blister.png',
    'citirix-250': 'Citirix-250 carton above amber tray.png',
    'pulsorex': 'Turquoise PULSOREX Carton and Tablet Strip.png',
    'neurorelax': 'Premium Neurorelax Sleep Probiotic Carton.png',
    'fracway': 'Onecore Fracway Carton and Plain Blister.png',
    'curajoy': 'Onecore Curajoy carton with side blister.png',
    'curajoy-q10': 'Curajoy™-Q10 carton and bottle mockup.png',
    'curajoy-forte': 'Curajoy Forte.jpeg',
    'jorelax': 'JORELAX carton with blister card.png',
    'oneflexo': 'oneflexo-packshot.png',
    'duodk': 'Onecore DuoDK box and blister pack.png',
    'trypcor': 'trypcor.jpeg',
    'trypcor-br': 'trypcor-br.jpeg',
    'gemcore': 'Premium GEMCORE-1000 carton mockup.png',
    'oxalitos-50': 'Forest green Oxalitos-50 carton.png',
    'oxalitos-100': 'Oxalitos -100.jpeg',
    'bevacore-100': 'Bevacore-100.jpeg',
    'bevacore-400': 'Bevacore-400.jpeg',
    'oncogras': 'Onegras.jpeg',
    'temzoro-100': 'Temzora-100.jpeg',
    'temzoro-250': 'Temzora-250.jpeg',
    'pacli-one-30': 'Paclione 30.jpeg',
    'pacli-one-100': 'Paclione 300.jpeg',
    'pacli-one-260': 'Paclione 260.jpeg',
    'zincolys-syrup': 'Zincolys Syrup.jpg',
    'zincolys-plus': 'Zincolys Plus.jpg',
    'dozokid': 'Dozo Kid Syrup.jpg',
    'appyone': 'Appyone Gummies.png',
    'doxicent-ds': 'Doxicient DS.jpg',
    'doxicent-100': 'Doxicient 100.png',
    'doxicent-200': 'Doxicient 200.png',
    'wayomega-lc': 'wayomega-lc.jpeg',
    'vitatots-400g': 'Clean Vitatots vanilla protein powder jar.png',
    'vitatots-200g': 'Votatots Belgian Chocolate Protein Powder Tub.png',
    'g-g-shield': 'Onecore GG Shield probiotic kit.png',
    'dermatio-cream': 'Dermatio Repairaderm carton and bottle.png',
    'tacrolis': 'Tacrolis.png',
    'onebeto': 'Onebeto.jpeg',
    'fexostill-120': 'FEXOSTILL 120.jpeg',
    'fexostill-180': 'FEXOSTILL 180.jpeg',
    'fexostill-mk': 'FEXOSTILL-MK.jpeg',
}

def find_image(slug, brand_name):
    if slug == 'frecox-gel':
        return None
    if slug in CUSTOM_IMAGE_MAP:
        return CUSTOM_IMAGE_MAP[slug]
    for k, v in CUSTOM_IMAGE_MAP.items():
        if k in slug or slug in k:
            return v
    clean_b = re.sub(r'[^a-z0-9]', '', brand_name.replace('™', '').lower())
    for f in drive_images:
        if f.startswith('IMG-'): continue
        clean_f = re.sub(r'[^a-z0-9]', '', f.lower())
        if clean_b in clean_f or (len(clean_b) > 4 and clean_b[:5] in clean_f):
            return f
    for f in pub_images:
        clean_f = re.sub(r'[^a-z0-9]', '', f.lower())
        if clean_b in clean_f:
            return f
    return None

def optimize_image(src_filename, target_slug):
    dest_path = os.path.join(PUBLIC_PRODUCTS_DIR, f"{target_slug}.jpg")
    src_drive = os.path.join(IMG_DIR, src_filename)
    src_pub = os.path.join(PUBLIC_PRODUCTS_DIR, src_filename)
    
    src = None
    if os.path.exists(src_drive):
        src = src_drive
    elif os.path.exists(src_pub):
        src = src_pub
    if not src:
        return None
        
    ext = os.path.splitext(src)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png']:
        try:
            cmd = ['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', src, '--out', dest_path]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            return f"/assets/products/{target_slug}.jpg"
        except Exception:
            import shutil
            shutil.copyfile(src, dest_path)
            return f"/assets/products/{target_slug}.jpg"
    return None

web_upload_rows = sheets_data.get('Website Upload', [])
products_list = []
used_slugs = set()

for row in web_upload_rows[1:]:
    if not row or not row[0]: continue
    sno = row[0].strip()
    raw_brand = row[1].strip() if len(row) > 1 else ''
    comp = row[2].strip() if len(row) > 2 else ''
    prod_type = row[3].strip() if len(row) > 3 else 'Drug'
    desc = row[4].strip() if len(row) > 4 else ''
    indic = row[5].strip() if len(row) > 5 else ''
    dosage = row[6].strip() if len(row) > 6 else ''
    moa = row[7].strip() if len(row) > 7 else ''
    safety = row[8].strip() if len(row) > 8 else ''
    
    # Normalize TM: strictly on first brand word only
    pure_name = raw_brand.replace('™', '').strip()
    brand_match = re.match(r'^([A-Za-z0-9]+)(.*)$', pure_name)
    if brand_match:
        normalized_brand = f"{brand_match.group(1)}™{brand_match.group(2)}"
    else:
        normalized_brand = raw_brand.strip()
    
    # Extract first complete sentence for short_description to avoid awkward word truncation
    short_desc = ''
    if desc:
        sent_m = re.match(r'^(.*?\.)(?:\s|$)', desc.strip())
        if sent_m and len(sent_m.group(1)) > 30:
            short_desc = sent_m.group(1).strip()
        else:
            short_desc = desc.strip()
    elif comp:
        short_desc = comp.strip()
    
    area_id = sno_to_spec.get(sno, 8)
    area_meta = AREA_METADATA.get(area_id, AREA_METADATA[8])
    
    base_slug = slugify(normalized_brand)
    slug = base_slug
    idx = 2
    while slug in used_slugs:
        slug = f"{base_slug}-{idx}"
        idx += 1
    used_slugs.add(slug)
    
    matched_img = find_image(slug, normalized_brand)
    packshot_url = None
    if matched_img:
        packshot_url = optimize_image(matched_img, slug)
        
    if not packshot_url:
        packshot_url = f"/assets/therapeutic-{area_meta['slug']}.jpg"
        
    benefits = []
    if indic:
        parts = re.split(r'\n\s*\n', indic)
        for p in parts:
            p = p.strip()
            if not p: continue
            lines = p.split('\n')
            btitle = lines[0].strip()
            bdesc = ' '.join(l.strip() for l in lines[1:]) if len(lines) > 1 else btitle
            benefits.append({'title': btitle[:150], 'description': bdesc})
            
    mechanisms = []
    if moa:
        parts = re.split(r'\n\s*\n', moa)
        for p in parts:
            p = p.strip()
            if not p: continue
            lines = p.split('\n')
            mtitle = lines[0].strip()
            mdesc = ' '.join(l.strip() for l in lines[1:]) if len(lines) > 1 else mtitle
            mechanisms.append({'title': mtitle[:150], 'description': mdesc})
            
    safety_sections = []
    if safety:
        parts = re.split(r'\n\s*\n', safety)
        for p in parts:
            p = p.strip()
            if not p: continue
            lines = p.split('\n')
            stitle = lines[0].strip()
            sdesc = ' '.join(l.strip() for l in lines[1:]) if len(lines) > 1 else stitle
            safety_sections.append({'section_key': slugify(stitle)[:50], 'title': stitle[:150], 'description': sdesc})
            
    products_list.append({
        'sno': int(sno) if sno.isdigit() else 0,
        'brand_name': normalized_brand,
        'display_brand': normalized_brand,
        'slug': slug,
        'therapeutic_area_id': area_id,
        'therapeutic_area_name': area_meta['name'],
        'therapeutic_area_slug': area_meta['slug'],
        'composition_summary': comp,
        'product_type': prod_type,
        'short_description': short_desc,
        'full_description': desc,
        'packshot_url': packshot_url,
        'dosage_guidance': dosage,
        'benefits': benefits,
        'mechanisms': mechanisms,
        'safety_sections': safety_sections,
    })

print(f"Processed {len(products_list)} products successfully!")
images_linked = sum(1 for p in products_list if not p['packshot_url'].startswith('/assets/therapeutic-'))
print(f"Products with custom packshot image: {images_linked} / {len(products_list)}")

os.makedirs('server/data', exist_ok=True)
with open('server/data/productsCatalog.json', 'w', encoding='utf-8') as f:
    json.dump(products_list, f, indent=2, ensure_ascii=False)
print("Saved server/data/productsCatalog.json")

sql_file = 'sync-products-2026.sql'
with open(sql_file, 'w', encoding='utf-8') as f:
    f.write("-- ============================================================================\n")
    f.write("-- Complete Onecore Pharma Product Catalog Synchronization (2026)\n")
    f.write(f"-- Total Products: {len(products_list)}\n")
    f.write("-- ============================================================================\n\n")
    f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
    f.write("TRUNCATE TABLE `product_safety_sections`;\n")
    f.write("TRUNCATE TABLE `product_mechanisms`;\n")
    f.write("TRUNCATE TABLE `product_dosage`;\n")
    f.write("TRUNCATE TABLE `product_benefits`;\n")
    f.write("TRUNCATE TABLE `product_compositions`;\n")
    f.write("TRUNCATE TABLE `products`;\n")
    f.write("SET FOREIGN_KEY_CHECKS = 1;\n\n")

    def escape(s):
        if s is None: return "NULL"
        return "'" + str(s).replace("\\", "\\\\").replace("'", "''").replace("\r", "").replace("\n", "\\n") + "'"

    for idx, p in enumerate(products_list, 1):
        pid = idx
        bname = escape(p['brand_name'])
        slug = escape(p['slug'])
        sdesc = escape(p['short_description'])
        fdesc = escape(p['full_description'])
        comp = escape(p['composition_summary'])
        packshot = escape(p['packshot_url'])
        seo_title = escape(f"{p['brand_name']} | Onecore Pharma")
        seo_desc = escape(p['short_description'])

        f.write(f"INSERT INTO `products` (`id`, `therapeutic_area_id`, `brand_name`, `slug`, `short_description`, `full_description`, `composition_summary`, `packshot_url`, `status`, `display_order`, `seo_title`, `seo_description`) VALUES\n")
        f.write(f"({pid}, {p['therapeutic_area_id']}, {bname}, {slug}, {sdesc}, {fdesc}, {comp}, {packshot}, 'published', {pid}, {seo_title}, {seo_desc});\n")

        if p['composition_summary']:
            f.write(f"INSERT INTO `product_compositions` (`product_id`, `ingredient_name`, `strength`, `display_order`) VALUES\n")
            f.write(f"({pid}, {comp}, '', 1);\n")

        if p['dosage_guidance']:
            dosage_val = escape(p['dosage_guidance'])
            f.write(f"INSERT INTO `product_dosage` (`product_id`, `heading`, `description`) VALUES\n")
            f.write(f"({pid}, 'Administration and Dosage Guidance', {dosage_val});\n")

        for b_idx, b in enumerate(p['benefits'], 1):
            btitle = escape(b['title'])
            bdesc = escape(b['description'])
            f.write(f"INSERT INTO `product_benefits` (`product_id`, `title`, `description`, `display_order`) VALUES\n")
            f.write(f"({pid}, {btitle}, {bdesc}, {b_idx});\n")

        for m_idx, m in enumerate(p['mechanisms'], 1):
            mtitle = escape(m['title'])
            mdesc = escape(m['description'])
            f.write(f"INSERT INTO `product_mechanisms` (`product_id`, `title`, `description`, `display_order`) VALUES\n")
            f.write(f"({pid}, {mtitle}, {mdesc}, {m_idx});\n")

        for s_idx, s in enumerate(p['safety_sections'], 1):
            skey = escape(s['section_key'])
            stitle = escape(s['title'])
            sdesc = escape(s['description'])
            f.write(f"INSERT INTO `product_safety_sections` (`product_id`, `section_key`, `title`, `description`, `display_order`) VALUES\n")
            f.write(f"({pid}, {skey}, {stitle}, {sdesc}, {s_idx});\n")

        f.write("\n")

print(f"Generated {sql_file} successfully!")

#!/usr/bin/env python3
import os
import re
import json
import shutil
import openpyxl

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXCEL_PATH = os.path.join(BASE_DIR, "Onecore_Website_Product_Content_Redrafted.xlsx")
IMAGES_DIR = os.path.join(BASE_DIR, "Onecore Images")
PUBLIC_PRODUCTS_DIR = os.path.join(BASE_DIR, "public", "assets", "products")
CATALOG_PATH = os.path.join(BASE_DIR, "server", "data", "productsCatalog.json")

os.makedirs(PUBLIC_PRODUCTS_DIR, exist_ok=True)

# Division fallback artwork
DIVISION_FALLBACKS = {
    1: "/assets/therapeutic-womens-health.jpg",     # Femme
    2: "/assets/pediaplus.jpg",                     # Pediaplus
    3: "/assets/therapeutic-orthopedics.jpg",       # Ortheon
    4: "/assets/therapeutic-neurology.jpg",         # Neurix
    5: "/assets/therapeutic-ophthalmology.jpg",     # Eyrix
    6: "/assets/therapeutic-dermatology.jpg",       # Vellis
    7: "/assets/therapeutic-ent.jpg",               # Otira
    8: "/assets/therapeutic-general-health.jpg",    # Omnara
    9: "/assets/therapeutic-oncology.jpg",          # Cytos
}

# Image mapping from "Onecore Images" filename to product slug
IMAGE_MAPPING = {
    "Anglecent TM eye drops with corrected branding.png": "angelcent-tm",
    "Appyone Gummies.png": "appyone",
    "Enhanced APPYONE Gummies Jar.png": "appyone",
    "BILARIV violet carton and tablet strip.png": "bilariv",
    "Bevacore-100.jpeg": "bevacore-100",
    "Bevacore-400.jpeg": "bevacore-400",
    "Bilariv-M .png": "bilariv-m",
    "Blue CEFVANTA-250 medicine box.png": "cefvanta-250",
    "Brimway eye drops carton and bottle (1).png": "brimway",
    "Brimway-TM eye drops carton and bottle.png": "brimway-tm",
    "Brinstar brinzolamide eye drop packaging.png": "brinstar",
    "Brinstar-BT.jpeg": "brinstar-bt",
    "Brinstar-TM.jpeg": "brinstar-tm",
    "Brosolve.jpeg": "brosolve",
    "CEFVANTA-500 box and blister pack.png": "cefvanta-500",
    "CITIRIX™-P carton and silver tablet strip.png": "citirix-p",
    "CLOBTOS-S ointment carton and tube.png": "clobtos-ad",
    "Centered Vorcore carton on clean background.png": "vorcore",
    "Citirix-250 carton above amber tray.png": "citirix-250",
    "Clean Vitatots vanilla protein powder jar.png": "vitatots-200g",
    "ClindaOne-N gel carton and tube.png": "clindaone-n",
    "Clindaone-AD.jpg": "clindaone-ad",
    "Clindaone-C Carton with Three-Unit Softgel Strip.png": "clindaone-ct",
    "Clobtos-M.jpg": "clobtos-m",
    "Corrected CEFVANTA-CV carton lettering.png": "cefvanta-cv",
    "Cranly carton with official Onecore logo.png": "cranly",
    "Crimson FRECOX-R carton with Alu-Alu strip.png": "frecox-r",
    "Curajoy Forte.jpeg": "curajoy",
    "Curajoy.png": "curajoy",
    "Curajoy™-Q10 carton and bottle mockup.png": "curajoy-q10",
    "Dermatio Repairaderm carton and bottle.png": "dermatio-cream",
    "Doxicent CV .png": "doxicent-cv",
    "Doxicient 100.png": "doxicent-100",
    "Doxicient 200.png": "doxicent-200",
    "Doxicient DS.jpg": "doxicent-ds",
    "Dozo Kid Syrup.jpg": "dozokid",
    "EKABRO-AC Emerald Carton and Strip.png": "ekabro",
    "EKABRO™ acebrophylline carton mockup.png": "ekabro",
    "Ekabro-OD.png": "ekabro",
    "FEOMA-XT carton, left-side three-quarter view.png": "feoma-xt",
    "FEXOSTILL 120.jpeg": "fexostil-120",
    "FEXOSTILL 180.jpeg": "fexostil-180",
    "FEXOSTILL-MK.jpeg": "fexostil-m",
    "FLUTIRIV NS box and nasal spray.png": "flutiriv-ns",
    "Flutriv NS.jpeg": "flutiriv-ns",
    "FRECOX-P carton and blister pack.png": "frecox",
    "FRECOX-SP carton with alu-alu blister.png": "frecox-sp",
    "FRECOX-TH Box with 10-Tablet Blister.png": "frecox-th",
    "Feoma-Plus carton with fifteen softgels.png": "feoma-plus",
    "Fixteam Plus.png": "fixtear-plus",
    "Fixtear Eye Ointment.png": "fixtear-eye-ointment",
    "Fixtear PG.png": "fixtear-pg",
    "Fixtear.png": "fixtear",
    "Flutiriv-AZ carton and bottle redesign.png": "flutiriv-az",
    "Flutriv.jpg": "flutiriv",
    "Folatis tablet carton with blister.png": "folatis",
    "Folatis-D carton with silver blister.png": "folatis-d",
    "Folatis.png": "folatis",
    "Folatis™-CA carton with 15-tablet strip.png": "folatis-ca",
    "Folatis™-ET carton with amber blister strip.png": "folatis-et",
    "Forest green Oxalitos-50 carton.png": "oxalitos-50",
    "Foscore.png": "foscore",
    "GEMCORE-200 pharmaceutical carton mockup.png": "gemcore",
    "Gemcore-1000.png": "gemcore",
    "Gestemme-200.jpg": "gestemme-200",
    "Gestemme-300 .png": "gestemme-300",
    "Glypocal Junior.png": "glypocal-junior",
    "Glypocal LP Syrup.jpg": "glypocal-lp-syrup",
    "Glypocal LP.png": "glypocal-lp-tablets",
    "Glypocal-CZ.png": "glypocal-cz",
    "IMG-20260927-WA0005.jpg": "otomentin-625",
    "IMG-20260927-WA0017.jpg": "traxpause-mf",
    "IMG-20260929-WA0004.jpg": "trypcor",
    "IMG-20260929-WA0019.jpg": "trypcor-br",
    "IMG-20260930-WA0002.jpg": "oneq10-lm",
    "IMG-20260930-WA0005.jpg": "deftos-6",
    "IMG-20261001-WA0006(1).jpg": "wayomega-lc",
    "IMG-20261001-WA0011.jpg": "sultics-750",
    "IMG-20261001-WA0015.jpg": "sultics-375",
    "IMG-20261002-WA0003.jpg": "humiphin",
    "IMG-20261004-WA0043.jpg": "oneriv-d3-60k",
    "IMG-20261005-WA0009.jpg": "lulifite",
    "IMG-20261006-WA0038.jpg": "brinstar-bt",
    "IMG-20261006-WA0039.jpg": "brinstar-tm",
    "IMG-20261021-WA0010.jpg": "brosolve",
    "Ikarix Eye Drops Carton and Bottle.png": "ikarix",
    "Indigo Citirix Carton with Silver Blister.png": "citirix",
    "JORELAX carton with blister card.png": "jorelax",
    "Lotovo packaging with cool teal wave accents.png": "lotovo",
    "Lotovo-T packaging with strength line removed.png": "lotovo-t",
    "Melacore cream tube and carton.png": "melacore",
    "Moxable-DF eye drops packaging.png": "moxable-df",
    "Moxable-K purple ophthalmic packaging mockup.png": "moxable-k",
    "Moxable™ Periwinkle Eye Drops Mockup.png": "moxable",
    "Moxable™-DM .png": "moxable-dm",
    "NERVIA FORTE with amber molded tray.png": "nervia-forte",
    "NERVIA-NX box beside 10-tablet blister.png": "nervia-nx",
    "NERVIA-PG carton with silver blister strip.png": "nervia-pg",
    "NERVIA™-GM .png": "nervia-g",
    "NERVIA™.png": "nervia",
    "Natvue Ophthalmic Dropper Packaging.png": "natvue",
    "Nepsolve™ Green Wave Eye Drop Mockup.png": "nepsolve",
    "Nervia Plus carton and capsule strip.png": "nervia-plus",
    "Nervia-NX.png": "nervia-nx",
    "Nervia-OD capsule packaging mockup.png": "nervia-od",
    "Neurorelax.png": "neurorelax",
    "OTOMENTIN DS.png": "otomentin-ds",
    "OTOMENTIN DUO.png": "otomentin-duo",
    "Ocuvion Eye Drops Packaging Set.png": "ocuvion",
    "Olgerix .png": "olgerix",
    "Olgerix Max.jpeg": "olgerix-max",
    "Olgerix-KT .png": "olgerix-kt",
    "Omnagut.jpg": "omnagut",
    "Onecore DuoDK box and blister pack.png": "duodk",
    "Onecore Fracway Carton and Plain Blister.png": "fracway",
    "Onecore GG Shield probiotic kit.png": "g-g-shield",
    "Onegras.jpeg": "oncogras",
    "Oneriv D3 Drops.jpg": "oneriv-d3-drops",
    "Oneriv Vitamin D3 Softgel.png": "oneriv-d3-60k",
    "Optivra.jpg": "optivro",
    "Oxalitos -100.jpeg": "oxalitos-100",
    "PANFLAT-DSR carton and Alu-Alu pack.png": "panflat-dsr",
    "Paclione 260.jpeg": "pacli-one-260",
    "Paclione 30.jpeg": "pacli-one-30",
    "Paclione 300.jpeg": "pacli-one-100",
    "Panflat-40.jpg": "panflat-40",
    "Predtos ophthalmic drops packaging mockup.png": "predtos",
    "Rabtico 20.jpeg": "rabtico-20",
    "Rabtico DSR.png": "rabtico-dsr",
    "Rabtico-IT.jpg": "rabtico-it",
    "Rabtico-L.jpg": "rabtico-l",
    "Rabeprazol-20 Injection.png": "rabtico-20",
    "Rixtear-F .png": "rixtear-f",
    "STOMAZO-D carton and blister.png": "stomazo-d",
    "Stomazo 40.png": "stomazo-40",
    "Tacrolis.png": "tracore",
    "Temzora-100.jpeg": "temzoro-100",
    "Temzora-250.jpeg": "temzoro-250",
    "Throfree .png": "throfree",
    "Tobraway-F .png": "tobraway-f",
    "Turquoise PULSOREX Carton and Tablet Strip.png": "pulsorex",
    "Votatots Belgian Chocolate Protein Powder Tub.png": "vitatots-400g",
    "Womento.png": "womento",
    "Zincolys Plus.jpg": "zincolys-plus",
    "Zincolys Syrup.jpg": "zincolys-syrup",
}

def clean_text(s):
    if not s:
        return ""
    # Normalize unicode whitespace and quotes
    s = str(s).replace("\r\n", "\n").replace("\r", "\n")
    return s.strip()

def parse_paired_sections(text):
    """
    Parses sections formatted as:
    Heading 1
    Description 1
    
    Heading 2
    Description 2
    """
    if not text:
        return []
    
    blocks = [b.strip() for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
    results = []
    
    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue
        if len(lines) == 1:
            results.append({"title": lines[0], "description": lines[0]})
        else:
            title = lines[0]
            desc = " ".join(lines[1:])
            results.append({"title": title, "description": desc})
            
    return results

def parse_mechanisms(text):
    """
    Parses mechanism of action blocks, stripping leading '01 — ' or '01: ' from the title.
    """
    if not text:
        return []
        
    blocks = [b.strip() for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
    mechanisms = []
    
    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue
        
        raw_title = lines[0]
        # Strip leading numbering like '01 — ' or '01. ' or '01: '
        clean_title = re.sub(r"^\d+[\s—:.-]+", "", raw_title).strip()
        if not clean_title:
            clean_title = raw_title
            
        desc = " ".join(lines[1:]) if len(lines) > 1 else clean_title
        # Also clean leading numbering from description if present
        desc = re.sub(r"^\d+[\s—:.-]+", "", desc).strip()
        
        mechanisms.append({
            "title": clean_title,
            "description": desc
        })
        
    return mechanisms

def parse_safety_sections(text):
    items = parse_paired_sections(text)
    sections = []
    for item in items:
        key = re.sub(r"[^a-z0-9]+", "-", item["title"].lower()).strip("-")
        sections.append({
            "section_key": key or "safety-note",
            "title": item["title"],
            "description": item["description"]
        })
    return sections

def main():
    print("🚀 Starting Complete Catalog Rebuild & Image Ingestion...")
    
    # 1. Load existing catalog to preserve metadata (slugs, therapeutic area mappings)
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        old_catalog = json.load(f)
    print(f"📦 Loaded {len(old_catalog)} existing catalog records.")
    
    # 2. Copy images into public/assets/products
    slug_to_copied_image = {}
    print(f"🖼️ Copying packshot images from '{IMAGES_DIR}' to '{PUBLIC_PRODUCTS_DIR}'...")
    
    for img_name, slug in IMAGE_MAPPING.items():
        src_path = os.path.join(IMAGES_DIR, img_name)
        if not os.path.exists(src_path):
            print(f"  ⚠️ Warning: Source image missing: {src_path}")
            continue
            
        ext = os.path.splitext(img_name)[1].lower()
        if ext == ".jpeg":
            ext = ".jpg"
            
        dest_filename = f"{slug}{ext}"
        dest_path = os.path.join(PUBLIC_PRODUCTS_DIR, dest_filename)
        
        shutil.copy2(src_path, dest_path)
        slug_to_copied_image[slug] = f"/assets/products/{dest_filename}"
        
    print(f"✅ Successfully copied verified packshots for {len(slug_to_copied_image)} products.")
    
    # 3. Read Excel Workbook
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    ws = wb["Website Upload"]
    
    new_catalog = []
    
    for i in range(len(old_catalog)):
        old_p = old_catalog[i]
        row_num = i + 2
        
        # Read Excel row
        brand_val = clean_text(ws.cell(row_num, 2).value)
        comp_val = clean_text(ws.cell(row_num, 3).value)
        type_val = clean_text(ws.cell(row_num, 4).value)
        desc_val = clean_text(ws.cell(row_num, 5).value)
        indic_val = clean_text(ws.cell(row_num, 6).value)
        dosage_val = clean_text(ws.cell(row_num, 7).value)
        mech_val = clean_text(ws.cell(row_num, 8).value)
        safety_val = clean_text(ws.cell(row_num, 9).value)
        
        slug = old_p["slug"]
        area_id = old_p["therapeutic_area_id"]
        
        # Determine Packshot URL
        if slug in slug_to_copied_image:
            packshot_url = slug_to_copied_image[slug]
        elif old_p.get("packshot_url") and not old_p["packshot_url"].startswith("/assets/therapeutic-"):
            packshot_url = old_p["packshot_url"]
        else:
            packshot_url = DIVISION_FALLBACKS.get(area_id, "/assets/therapeutic-general-health.jpg")
            
        # Parse Indications / Benefits
        benefits = parse_paired_sections(indic_val)
        if not benefits:
            benefits = old_p.get("benefits", [])
            
        # Parse Mechanisms
        mechanisms = parse_mechanisms(mech_val)
        if not mechanisms:
            mechanisms = old_p.get("mechanisms", [])
            
        # Parse Safety
        safety = parse_safety_sections(safety_val)
        if not safety:
            safety = old_p.get("safety_sections", [])
            
        # Short description fallback
        short_desc = desc_val.split(".")[0] + "." if desc_val else old_p.get("short_description", "")
        
        product_entry = {
            "sno": i + 1,
            "brand_name": brand_val or old_p["brand_name"],
            "display_brand": brand_val or old_p["display_brand"],
            "slug": slug,
            "therapeutic_area_id": area_id,
            "therapeutic_area_name": old_p["therapeutic_area_name"],
            "therapeutic_area_slug": old_p["therapeutic_area_slug"],
            "composition_summary": comp_val or old_p.get("composition_summary", ""),
            "product_type": type_val or old_p.get("product_type", "Drug"),
            "short_description": short_desc,
            "full_description": desc_val or old_p.get("full_description", ""),
            "packshot_url": packshot_url,
            "dosage_guidance": dosage_val or old_p.get("dosage_guidance", ""),
            "benefits": benefits,
            "mechanisms": mechanisms,
            "safety_sections": safety
        }
        
        new_catalog.append(product_entry)
        
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(new_catalog, f, indent=2, ensure_ascii=False)
        
    print(f"✨ Successfully generated new products catalog at '{CATALOG_PATH}' with {len(new_catalog)} products.")

if __name__ == "__main__":
    main()

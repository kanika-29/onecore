#!/usr/bin/env python3
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXCEL_PATH = os.path.join(BASE_DIR, "Onecore_Website_Product_Content_Redrafted.xlsx")
PUBLIC_PRODUCTS_DIR = os.path.join(BASE_DIR, "public", "assets", "products")
CATALOG_PATH = os.path.join(BASE_DIR, "server", "data", "productsCatalog.json")

# Category Sheets and their corresponding metadata
CATEGORY_SHEETS = [
    {
        "sheet_name": "Femme",
        "area_id": 1,
        "area_slug": "womens-health",
        "area_name": "Women's Health",
        "division": "Femme"
    },
    {
        "sheet_name": "Pediaplus",
        "area_id": 2,
        "area_slug": "paediatrics",
        "area_name": "Paediatrics",
        "division": "Pediaplus"
    },
    {
        "sheet_name": "Ortheon",
        "area_id": 3,
        "area_slug": "orthopaedics",
        "area_name": "Orthopaedics",
        "division": "Ortheon"
    },
    {
        "sheet_name": "Neurix",
        "area_id": 4,
        "area_slug": "neurology",
        "area_name": "Neurology",
        "division": "Neurix"
    },
    {
        "sheet_name": "Eyrix",
        "area_id": 5,
        "area_slug": "ophthalmology",
        "area_name": "Ophthalmology",
        "division": "Eyrix"
    },
    {
        "sheet_name": "Vellis",
        "area_id": 6,
        "area_slug": "dermatology",
        "area_name": "Dermatology",
        "division": "Vellis"
    },
    {
        "sheet_name": "Otira",
        "area_id": 7,
        "area_slug": "ent",
        "area_name": "ENT",
        "division": "Otira"
    },
    {
        "sheet_name": "Omnara",
        "area_id": 8,
        "area_slug": "general-medicine",
        "area_name": "General Medicine",
        "division": "Omnara"
    },
    {
        "sheet_name": "Cytos",
        "area_id": 9,
        "area_slug": "oncology",
        "area_name": "Oncology",
        "division": "Cytos"
    }
]

def clean_text(s):
    if not s:
        return ""
    return str(s).replace("\r\n", "\n").replace("\r", "\n").strip()

def slugify(text):
    text = text.replace("™", "").replace("®", "")
    text = re.sub(r"[\(\)]", "", text)
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text

def parse_paired_sections(text):
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
    if not text:
        return []
    blocks = [b.strip() for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
    mechanisms = []
    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue
        raw_title = lines[0]
        clean_title = re.sub(r"^\d+[\s—:.-]+", "", raw_title).strip() or raw_title
        desc = " ".join(lines[1:]) if len(lines) > 1 else clean_title
        desc = re.sub(r"^\d+[\s—:.-]+", "", desc).strip()
        mechanisms.append({"title": clean_title, "description": desc})
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

def get_sheet_rows(filename, sheet_name):
    with zipfile.ZipFile(filename) as z:
        shared_strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            ss_root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
            for si in ss_root.findall("main:si", ns):
                text = "".join([t.text for t in si.findall(".//main:t", ns) if t.text])
                shared_strings.append(text)
        
        wb_root = ET.fromstring(z.read("xl/workbook.xml"))
        ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        rId = None
        for s in wb_root.findall("main:sheets/main:sheet", ns):
            if s.attrib.get("name") == sheet_name:
                rId = s.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
                break
        
        rels_root = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        ns_rel = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}
        target_path = None
        for r in rels_root.findall("rel:Relationship", ns_rel):
            if r.attrib.get("Id") == rId:
                target_path = "xl/" + r.attrib.get("Target")
                break
        
        sheet_root = ET.fromstring(z.read(target_path))
        rows = []
        for row in sheet_root.findall(".//main:row", ns):
            row_dict = {}
            for c in row.findall("main:c", ns):
                cell_ref = c.attrib.get("r")
                col = "".join([ch for ch in cell_ref if ch.isalpha()])
                t = c.attrib.get("t")
                v = c.find("main:v", ns)
                val = v.text if v is not None else ""
                if t == "s" and val.isdigit():
                    val = shared_strings[int(val)]
                row_dict[col] = val
            rows.append(row_dict)
        return rows

def resolve_packshot(slug):
    # oneflexo was a synthetic vector mockup, no real photo in Onecore Images
    if slug == "oneflexo":
        return None
    pub_files = set(os.listdir(PUBLIC_PRODUCTS_DIR))
    # Exclude synthetic mockups or stock photos
    for ext in [".png", ".jpg", ".jpeg", ".webp"]:
        filename = f"{slug}{ext}"
        if filename in pub_files:
            return f"/assets/products/{filename}"
    return None

def build_catalog():
    print(f"📖 Reading category sheets from '{EXCEL_PATH}'...")
    
    products_by_slug = {}
    ordered_slugs = []
    
    total_category_entries = 0
    
    for cat in CATEGORY_SHEETS:
        sheet_name = cat["sheet_name"]
        area_id = cat["area_id"]
        area_slug = cat["area_slug"]
        area_name = cat["area_name"]
        division = cat["division"]
        
        rows = get_sheet_rows(EXCEL_PATH, sheet_name)
        if not rows:
            print(f"⚠️ Warning: Sheet '{sheet_name}' is empty or not found.")
            continue
            
        prods = rows[1:]
        print(f"  • {sheet_name:<10}: {len(prods)} products found")
        
        for idx, r in enumerate(prods, 1):
            total_category_entries += 1
            brand_val = clean_text(r.get("B", ""))
            if not brand_val:
                continue
                
            comp_val = clean_text(r.get("C", ""))
            type_val = clean_text(r.get("D", "Drug"))
            desc_val = clean_text(r.get("E", ""))
            indic_val = clean_text(r.get("F", ""))
            dosage_val = clean_text(r.get("G", ""))
            mech_val = clean_text(r.get("H", ""))
            safety_val = clean_text(r.get("I", ""))
            
            slug = slugify(brand_val)
            
            # Special slug override for Oneflexo
            if "oneflexo" in slug:
                slug = "oneflexo"
                
            packshot_url = resolve_packshot(slug)
            
            area_entry = {
                "id": area_id,
                "name": area_name,
                "slug": area_slug,
                "division": division,
                "display_order": idx
            }
            
            if slug not in products_by_slug:
                short_desc = desc_val.split(".")[0] + "." if desc_val else comp_val
                
                products_by_slug[slug] = {
                    "brand_name": brand_val,
                    "display_brand": brand_val,
                    "slug": slug,
                    "therapeutic_area_id": area_id,
                    "therapeutic_area_name": area_name,
                    "therapeutic_area_slug": area_slug,
                    "therapeutic_area_ids": [area_id],
                    "therapeutic_areas": [area_entry],
                    "composition_summary": comp_val,
                    "product_type": type_val or "Drug",
                    "short_description": short_desc,
                    "full_description": desc_val,
                    "packshot_url": packshot_url,
                    "dosage_guidance": dosage_val,
                    "benefits": parse_paired_sections(indic_val),
                    "mechanisms": parse_mechanisms(mech_val),
                    "safety_sections": parse_safety_sections(safety_val)
                }
                ordered_slugs.append(slug)
            else:
                # Add additional area assignment
                existing = products_by_slug[slug]
                if area_id not in existing["therapeutic_area_ids"]:
                    existing["therapeutic_area_ids"].append(area_id)
                    existing["therapeutic_areas"].append(area_entry)
                    
                # If existing had empty fields, backfill
                if not existing["composition_summary"] and comp_val:
                    existing["composition_summary"] = comp_val
                if not existing["full_description"] and desc_val:
                    existing["full_description"] = desc_val
                if not existing["dosage_guidance"] and dosage_val:
                    existing["dosage_guidance"] = dosage_val
                if not existing["benefits"] and indic_val:
                    existing["benefits"] = parse_paired_sections(indic_val)
                if not existing["mechanisms"] and mech_val:
                    existing["mechanisms"] = parse_mechanisms(mech_val)
                if not existing["safety_sections"] and safety_val:
                    existing["safety_sections"] = parse_safety_sections(safety_val)
                    
    catalog = []
    for i, slug in enumerate(ordered_slugs, 1):
        item = products_by_slug[slug]
        item["sno"] = i
        item["id"] = i
        catalog.append(item)
        
    print(f"\n✅ Total category entries processed: {total_category_entries}")
    print(f"✅ Total unique products generated: {len(catalog)}")
    
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Catalog successfully written to: {CATALOG_PATH}")

if __name__ == "__main__":
    build_catalog()

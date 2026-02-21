#!/usr/bin/env python3
"""
sync_images.py — Auto-scans client/public/images/ and injects image references
into manual-data.json so photos appear in the correct sections automatically.

Usage:
    python3 sync_images.py

How it works:
    1. Reads client/src/data/manual-data.json
    2. Scans client/public/images/<section-id>/<subsection-id>/ for image files
    3. Updates each subsection's "images" array with found files
    4. Writes the updated JSON back

Image naming convention (optional but helpful for captions):
    Any image file works. If the filename (without extension) contains underscores,
    they are converted to spaces for the caption.
    Example: well_pump_pressure_tank.jpg → caption: "well pump pressure tank"
"""

import json
import os
import re

MANUAL_JSON = os.path.join(os.path.dirname(__file__), "client/src/data/manual-data.json")
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "client/public/images")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

def filename_to_caption(filename):
    """Convert a filename like 'well_pump_01.jpg' to 'well pump 01'"""
    name = os.path.splitext(filename)[0]
    # Replace underscores and hyphens with spaces
    name = name.replace("_", " ").replace("-", " ")
    # Remove leading numbers like "01 " 
    name = re.sub(r"^\d+\s*", "", name)
    return name.strip().title() if name.strip() else None

def scan_images_for_subsection(section_id, subsection_id):
    """Return list of image dicts for a given section/subsection folder."""
    folder = os.path.join(IMAGES_DIR, section_id, subsection_id)
    if not os.path.isdir(folder):
        return []
    images = []
    for fname in sorted(os.listdir(folder)):
        ext = os.path.splitext(fname)[1].lower()
        if ext in IMAGE_EXTENSIONS:
            url = f"/images/{section_id}/{subsection_id}/{fname}"
            caption = filename_to_caption(fname)
            entry = {"url": url}
            if caption:
                entry["caption"] = caption
            images.append(entry)
    return images

def main():
    with open(MANUAL_JSON, "r") as f:
        data = json.load(f)

    total_images = 0
    for section in data["sections"]:
        section_id = section["id"]
        for subsection in section.get("subsections", []):
            subsection_id = subsection["id"]
            images = scan_images_for_subsection(section_id, subsection_id)
            if images:
                subsection["images"] = images
                total_images += len(images)
                print(f"  ✓ {section_id}/{subsection_id}: {len(images)} image(s)")
            else:
                # Remove images key if no images found (clean up)
                subsection.pop("images", None)

    with open(MANUAL_JSON, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\nDone. {total_images} total image(s) added to manual-data.json")

if __name__ == "__main__":
    main()

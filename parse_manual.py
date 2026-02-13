import re
import json
import os

def parse_property_manual(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Split into sections based on H2 headers
    sections = re.split(r'^##\s+(.+)$', content, flags=re.MULTILINE)
    
    # The first element is the title/intro before the first H2
    intro = sections[0]
    data = {
        "title": "San Juan County, Washington - Private Property",
        "metadata": {},
        "sections": []
    }

    # Parse metadata from intro
    metadata_patterns = {
        "created": r"\*\*Document Created:\*\*\s+(.+)",
        "updated": r"\*\*Last Updated:\*\*\s+(.+)",
        "owner": r"\*\*Property Owner:\*\*\s+(.+)"
    }
    
    for key, pattern in metadata_patterns.items():
        match = re.search(pattern, intro)
        if match:
            data["metadata"][key] = match.group(1).strip()

    # Process sections (title, content pairs)
    for i in range(1, len(sections), 2):
        title = sections[i].strip()
        content_block = sections[i+1].strip()
        
        # Skip Table of Contents
        if title == "Table of Contents":
            continue
            
        section_data = {
            "id": title.lower().replace(" ", "-").replace("&", "and"),
            "title": title,
            "content": content_block,
            "subsections": []
        }
        
        # Split into subsections based on H3 headers
        subsections = re.split(r'^###\s+(.+)$', content_block, flags=re.MULTILINE)
        
        # First part is content before first H3
        if subsections[0].strip():
            section_data["intro"] = subsections[0].strip()
            
        for j in range(1, len(subsections), 2):
            subtitle = subsections[j].strip()
            subcontent = subsections[j+1].strip()
            
            subsection_data = {
                "id": subtitle.lower().replace(" ", "-").replace("&", "and"),
                "title": subtitle,
                "content": subcontent,
                "items": [] # For H4 items
            }
            
            # Split into items based on H4 headers
            items = re.split(r'^####\s+(.+)$', subcontent, flags=re.MULTILINE)
            
            if items[0].strip():
                subsection_data["intro"] = items[0].strip()
                
            for k in range(1, len(items), 2):
                item_title = items[k].strip()
                item_content = items[k+1].strip()
                
                subsection_data["items"].append({
                    "title": item_title,
                    "content": item_content
                })
                
            section_data["subsections"].append(subsection_data)
            
        data["sections"].append(section_data)

    return data

def main():
    manual_path = "/home/ubuntu/Property_Manual.md"
    output_path = "/home/ubuntu/property-manual-website/client/src/data/manual-data.json"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        data = parse_property_manual(manual_path)
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully parsed manual to {output_path}")
    except Exception as e:
        print(f"Error parsing manual: {e}")

if __name__ == "__main__":
    main()

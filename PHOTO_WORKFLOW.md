# Photo Integration Workflow

**Single Source of Truth:** GitHub Repository (`joe5955/property-manual`)

## Overview

All property manual photos are stored in the GitHub repository and integrated into the website through a standardized workflow. This ensures clean, professional photos without text overlays or composite images.

## Directory Structure

```
client/public/images/
├── beach-house/
│   ├── appliances/
│   ├── laundry/
│   └── water-heater/
├── caretaker/
│   ├── electrical/
│   ├── heating/
│   ├── fuel/
│   ├── appliances/
│   ├── laundry/
│   ├── structure/
│   └── water-heater/
├── farm-house/
│   ├── appliances/
│   ├── exterior/
│   ├── interior/
│   └── root-cellar/
└── [other buildings...]
```

## Photo Naming Convention

Photos should follow this pattern:
```
##_descriptive_name.jpg
```

Examples:
- `01_dishwasher_bosch_closed.jpg`
- `02_dishwasher_bosch_control_panel.jpg`
- `03_range_bosch_full_view.jpg`

## Integration Workflow

### Step 1: Add Photos to GitHub

1. Take photos of equipment, buildings, or systems
2. Organize photos into appropriate building/category directories
3. Name photos following the naming convention
4. Commit and push to GitHub repository

### Step 2: Fresh Clone Repository

```bash
cd /tmp
rm -rf property-manual-github
gh repo clone joe5955/property-manual property-manual-github
```

### Step 3: Upload Photos to CDN

```bash
cd /tmp/property-manual-github/client/public/images
find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) ! -name ".gitkeep" -exec manus-upload-file {} \; > /home/ubuntu/photo_uploads.txt 2>&1
```

### Step 4: Parse Upload Results

```python
import json
import re

mappings = {}
with open('/home/ubuntu/photo_uploads.txt', 'r') as f:
    lines = f.readlines()
    
current_file = None
for line in lines:
    if line.startswith('Uploading file:'):
        match = re.search(r'Uploading file: (\./[^\s]+)', line)
        if match:
            current_file = match.group(1).lstrip('./')
    elif line.startswith('CDN URL:') and current_file:
        url = line.split('CDN URL:')[1].strip()
        mappings[current_file] = url
        current_file = None

with open('/home/ubuntu/photo_mappings.json', 'w') as f:
    json.dump(mappings, f, indent=2)
```

### Step 5: Update manual-data.json

The integration script matches GitHub directory structure to manual-data.json subsections and updates the `images` arrays with CDN URLs and auto-generated captions.

## Subsection Matching

The workflow automatically matches GitHub photo categories to manual subsections:

| GitHub Category | Manual Subsection |
|----------------|-------------------|
| appliances | Appliances, Kitchen Appliances |
| laundry | Laundry, Laundry Room |
| water-heater | Water Heater, Water Systems |
| electrical | Electrical, Electrical Systems |
| heating | Heating, Heating Systems |
| fuel | Fuel, Fuel Storage |
| exterior | Exterior, Building Exterior |
| interior | Interior, Building Interior |

## Important Notes

1. **No Photo Upload Form**: The website does not use a photo upload form. All photos must go through GitHub.

2. **Clean Photos Only**: Photos should show only the equipment/building without text overlays or composite images.

3. **Fresh Clone Required**: Always do a fresh clone to ensure you have the latest photos from the repository.

4. **Caption Generation**: Captions are auto-generated from filenames by:
   - Removing numbering prefix (e.g., `01_`)
   - Converting underscores to spaces
   - Title-casing each word

5. **Unmatched Categories**: If a GitHub category doesn't match any subsection, create the appropriate subsection in manual-data.json first.

## Troubleshooting

### Photos Not Displaying

1. Verify photos are in the GitHub repository
2. Check that subsection names in manual-data.json match the category mapping
3. Ensure `images` array exists in the subsection
4. Verify CDN URLs are accessible

### Missing Subsections

If photos can't be matched to subsections, either:
- Create the missing subsection in manual-data.json, or
- Reorganize GitHub directory structure to match existing subsections

## Future Improvements

- Create a skill in `/home/ubuntu/skills/` for automated photo integration
- Add validation to ensure all GitHub photos are integrated
- Implement automatic caption editing for special cases

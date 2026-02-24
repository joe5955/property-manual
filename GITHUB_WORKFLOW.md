# GitHub Integration Workflow - Best Practices

## Property Manual Photo Integration Process

### Critical Rule: Always Use Fresh Clone

**ALWAYS clone the GitHub repository fresh before checking for new photos.** This ensures you get the absolute latest uploads and prevents missing any updates.

### Step-by-Step Workflow

#### 1. Remove Old Clone (if exists)
```bash
rm -rf /home/ubuntu/property-manual-repo
```

#### 2. Fresh Clone from GitHub
```bash
cd /home/ubuntu
gh repo clone joe5955/property-manual property-manual-repo
```

#### 3. Explore New Photos
```bash
# List all directories to see what buildings have photos
find /home/ubuntu/property-manual-repo -type d | sort

# Count photos in each directory
find /home/ubuntu/property-manual-repo -type f -name "*.jpg" -o -name "*.png" | wc -l

# List photos by building
ls -lh /home/ubuntu/property-manual-repo/*/
```

#### 4. Upload Photos to CDN
```bash
# Navigate to the building directory
cd /home/ubuntu/property-manual-repo/[building-name]

# Upload all photos in a subdirectory
cd [subdirectory-name]
for file in *.jpg; do [ -f "$file" ] && manus-upload-file "$file"; done
```

#### 5. Move Uploaded Photos to Archive
```bash
# After uploading, move photos to static assets archive
mkdir -p /home/ubuntu/webdev-static-assets/[building-name]
mv /home/ubuntu/property-manual-repo/[building-name]/* /home/ubuntu/webdev-static-assets/[building-name]/
```

#### 6. Update manual-data.json
- Add CDN URLs to the appropriate building section
- Use the `images` array in subsections
- Include descriptive captions for each photo

#### 7. Verify Photos Display
- Check the website to ensure all photos render correctly
- Scroll through each subsection to verify image loading

### Why Fresh Clone Matters

1. **Latest Updates**: GitHub repository may have new photos uploaded since last clone
2. **No Stale Data**: Prevents working with outdated directory listings
3. **Clean State**: Avoids confusion from previously moved or processed files
4. **Reliability**: Ensures consistency between what's in GitHub and what you're integrating

### Common Mistakes to Avoid

❌ **Don't reuse old clones** - Always start fresh
❌ **Don't assume directory structure** - Always explore first
❌ **Don't skip verification** - Always check photos display on website
❌ **Don't forget to archive** - Move processed photos to webdev-static-assets

### Photo Organization in GitHub

Expected structure:
```
property-manual/
├── main-house/
│   ├── electrical/
│   ├── heating/
│   └── water-systems/
├── chalet/
│   ├── electrical/
│   ├── heating-and-comfort/
│   └── structure-exterior/
├── caretaker/
│   ├── electrical/
│   ├── heating/
│   └── water-heater/
└── [other-buildings]/
```

### Checkpoint Workflow

After integrating photos:
1. Mark tasks complete in todo.md
2. Verify all photos display correctly
3. Save checkpoint with descriptive message
4. Include photo count and building names in checkpoint description

---

**Last Updated**: February 24, 2026
**Repository**: joe5955/property-manual

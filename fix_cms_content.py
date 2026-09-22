#!/usr/bin/env python3
# Script untuk mengganti konten CMS section di StaffDashboard.tsx

import re

# Baca file
with open('src/components/dashboard/StaffDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Temukan baris berapa CMS section dimulai dan berakhir
lines = content.split('\n')
cms_start_line = None
cms_end_line = None

for i, line in enumerate(lines):
    if 'CMS / PENGATURAN WEBSITE TAB' in line:
        cms_start_line = i
    elif cms_start_line and 'PESAN & MASUKAN USER TAB' in line:
        cms_end_line = i
        break

if cms_start_line and cms_end_line:
    print(f"Found CMS section: lines {cms_start_line+1} to {cms_end_line}")
    print(f"Lines to replace: {cms_end_line - cms_start_line}")
else:
    print("Could not find CMS section markers")
    print(f"CMS start: {cms_start_line}, CMS end: {cms_end_line}")

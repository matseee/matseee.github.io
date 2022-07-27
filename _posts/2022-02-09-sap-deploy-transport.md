---
layout: post
title:  "SAP Transport to customer"
date: 2022-02-09 08:35:00 +0200
categories: ["Programming", "SAP"]
---

Origin system:
1. `se10` to release the transport
2. Download Cofile and Data files with filezilla or `CG3Y`

Customer system:
1. `al11` to read the upload folder (`DIR_TRANS`)
2. `cg3z` to upload file (data = R*, cofiles = K*)
3. `stms` -> `additions` -> `other jobs` -> `attach` -> enter transport 
4. select order -> `order` -> `import order`

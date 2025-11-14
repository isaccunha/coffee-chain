#!/bin/bash

curl -X POST http://localhost:5000/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "farm_name": "Fazenda Monte Verde",
    "location": "Minas Gerais, Brasil",
    "harvest_date": "2025-06-15",
    "quality_grade": "A",
    "weight": "2500kg",
    "processing_method": "Washed",
    "coffe_variety": "Bourbon Vermelho",
    "altitude": "1200m",
    "certifications": [
      {"organic": "Yes"},
      {"fair_trade": "Yes"}
    ],
    "notes": "Excellent bean size and color, low defect rate"
  }' | jq .

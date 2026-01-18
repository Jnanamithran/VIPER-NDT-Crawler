import json
import os
import random
from datetime import datetime, timedelta

# Define path to history.json (same as in main.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

labels = ["Crack", "Corrosion", "Spalling", "Exposed Rebar"]

data = []
# Generate 15 fake entries
for i in range(15):
    # Random time in the last 7 days
    dt = datetime.now() - timedelta(days=random.randint(0, 7), hours=random.randint(0, 23))
    
    entry = {
        "time": dt.strftime("%H:%M"),
        "date": dt.strftime("%Y-%m-%d"),
        "label": random.choice(labels),
        "confidence": round(random.uniform(0.65, 0.98), 2),
        "image": "simulation.jpg" 
    }
    data.append(entry)

# Save to file
with open(HISTORY_FILE, "w") as f:
    json.dump(data, f, indent=2)

print(f"✅ Database seeded! Created {HISTORY_FILE} with {len(data)} entries.")
print("Refresh your Frontend Analytics page to see the data.")
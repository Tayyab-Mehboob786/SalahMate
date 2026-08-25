import urllib.request
import json
import os

url = 'http://api.aladhan.com/v1/asmaAlHusna'
response = urllib.request.urlopen(url)
data = json.loads(response.read())['data']

ts_content = """export interface AsmaUlHusna {
  id: number;
  arabic: string;
  transliteration: string;
  englishMeaning: string;
  description?: string;
}

export const ASMA_UL_HUSNA: AsmaUlHusna[] = [
"""

for item in data:
    ts_content += f"""  {{
    id: {item['number']},
    arabic: '{item['name']}',
    transliteration: '{item['transliteration'].replace("'", "\\'")}',
    englishMeaning: '{item['en']['meaning'].replace("'", "\\'")}',
  }},
"""

ts_content += '];\n'

os.makedirs(os.path.join(os.getcwd(), 'src', 'data'), exist_ok=True)
with open(os.path.join(os.getcwd(), 'src', 'data', 'asma-ul-husna.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Successfully generated src/data/asma-ul-husna.ts with 99 names')

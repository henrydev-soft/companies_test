import requests
from django.conf import settings


import requests
from django.conf import settings

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct"

headers = {
    "Authorization": f"Bearer {settings.IA_API_KEY}"
}

def limpiar_respuesta(texto):
    if "respuesta" in texto.lower():
        texto = texto.split("respuesta:")[-1]
    if "¡descubre" in texto.lower():
        return texto[texto.lower().index("¡descubre"):]
    return texto.strip()


def generate_ad_text(product_name, characteristics):
    prompt = f"""
    Redacta un texto publicitario breve (1 o 2 frases) para redes sociales, sin incluir explicaciones ni instrucciones.
    El texto debe ser atractivo y persuasivo, destacando las características del producto sin incluir el precio.
    Incluye hashtags relevantes al final del texto.
    Nombre del producto: {product_name}
    Descripción: {characteristics}
    """

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7,
            "stop": ["\n\n", "###", "Respuesta:"]
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Error HF: {response.status_code} - {response.text}")

    generated_text = response.json()[0]["generated_text"]
    # Extraer solo lo nuevo (a veces el modelo repite el prompt)
    texto_nuevo = generated_text.replace(prompt, "").strip()
    
    # Limpiar la respuesta antes de devolverla
    texto_limpio = limpiar_respuesta(texto_nuevo)
    return texto_limpio

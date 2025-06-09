from django.template.loader import get_template
from xhtml2pdf import pisa
from io import BytesIO

def render_inventory_pdf(empresa, productos):
    #print(productos)
    template = get_template('pdf/inventory.html')
    html = template.render({'empresa': empresa, 'productos_con_precios': productos})
    result = BytesIO()
    pisa.CreatePDF(html, dest=result)
    return result

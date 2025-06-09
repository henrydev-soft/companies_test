from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings
import requests

from django.http import HttpResponse, Http404
from products.models import Product
from companies.models import Company
from ..pdf.generators import render_inventory_pdf

from ..models import Company
from products.models import ProductCurrencyPrice
from ..serializers.v1 import CompanySerializer
from ..permissions.v1 import IsCompanyAdministrator
from ..filters.v1 import CompanyFilter



# --- Helper para el Envío de Correo con Mailgun  ---
def send_email_with_pdf_mailgun(to_email, subject, text_content, pdf_bytes, company_name="Inventario"):
    if not settings.MAILGUN_API_KEY or not settings.MAILGUN_DOMAIN:
        raise Exception("Credenciales de Mailgun no configuradas.")

    return requests.post(
        f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
        auth=("api", settings.MAILGUN_API_KEY),
        data={
            "from": f"{settings.DEFAULT_FROM_EMAIL}",
            "to": to_email,
            "subject": subject,
            "text": text_content,
        },
        files={
            # Importante: pdf_bytes.getvalue() para obtener los bytes del BytesIO
            "attachment": (f"inventario_{company_name.replace(' ', '_')}.pdf", pdf_bytes.getvalue(), "application/pdf")
        }
    )



class CompanyPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública: lista todas las compañías. Permite solo GET.(Vista para usuario no autenticado)
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CompanyFilter
    search_fields = ['nit', 'name']
    ordering_fields = ['nit', 'name', 'created_at']
    ordering = ['-created_at']

class CompanyAdminViewSet(viewsets.ModelViewSet):
    """
    Vista privada para administración:
    Solo permite ver y gestionar empresas donde el usuario es administrador.
    """
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdministrator]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CompanyFilter
    search_fields = ['nit', 'name']
    ordering_fields = ['nit', 'name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Company.objects.filter(administrator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(administrator=self.request.user)

"""
#End Point para Generación de PDF de inventario
def generate_inventory_pdf(request, nit):
    try:
        company = Company.objects.get(nit=nit)
        productos = Product.objects.filter(company=company).prefetch_related('productcurrencyprice_set__currency')
        productos_con_precios = []
        for producto in productos:
            precios = ProductCurrencyPrice.objects.filter(product=producto).select_related('currency')
            productos_con_precios.append({
                'producto': producto,
                'precios': precios
            })
        
    except Company.DoesNotExist:
        return HttpResponse("Empresa no encontrada", status=404)

    pdf_file = render_inventory_pdf(company, productos_con_precios)
    response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="inventario_{nit}.pdf"'
    return response
"""

# --- Vista API para la Descarga de PDF ---
class CompanyPdfDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, nit, *args, **kwargs):
        try:
            # Lógica para obtener la empresa y sus productos
            company = get_object_or_404(Company, nit=nit)
            productos = Product.objects.filter(company=company).prefetch_related('productcurrencyprice_set__currency')
            
            productos_con_precios = []
            for producto in productos:
                precios = ProductCurrencyPrice.objects.filter(product=producto).select_related('currency')
                productos_con_precios.append({
                    'producto': producto,
                    'precios': precios
                })
            
            # Llama a tu función render_inventory_pdf con los datos preparados
            pdf_buffer = render_inventory_pdf(company, productos_con_precios)
            
            # Prepara la respuesta HTTP
            response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="inventario_{company.name.replace(" ", "_")}.pdf"'
            return response
        
        except Http404:
            # get_object_or_404 lanza Http404 si no encuentra la empresa
            return Response({"detail": "Empresa no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Captura cualquier otro error (ej. al renderizar el PDF)
            print(f"Error en CompanyPdfDownloadView: {e}")
            return Response({"detail": f"Error al generar el PDF para descarga: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Vista API para Enviar PDF por Correo  ---
class CompanyPdfEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, nit, *args, **kwargs):
        email_to = request.data.get('email_to')

        if not email_to:
            return Response({"detail": "Correo electrónico del destinatario es requerido."}, status=status.HTTP_400_BAD_REQUEST)
        
        import re
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email_to):
            return Response({"detail": "Formato de correo electrónico inválido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Lógica para obtener la empresa y sus productos
            company = get_object_or_404(Company, nit=nit)
            products = Product.objects.filter(company=company).prefetch_related('productcurrencyprice_set__currency')
            productos_con_precios = []
            for producto in products:
                precios = ProductCurrencyPrice.objects.filter(product=producto).select_related('currency')
                productos_con_precios.append({
                    'producto': producto,
                    'precios': precios
                })
            
            # 1. Generar el PDF como un buffer de BytesIO usando tu función `render_inventory_pdf`
            pdf_buffer = render_inventory_pdf(company, productos_con_precios)
            
            company_name = company.name if company else "Inventario"
            
            subject = f"Inventario de {company_name}"
            text_content = f"Adjunto encontrarás el informe de inventario de la empresa {company_name}."

            # 3. Enviar el correo usando Mailgun (pasando el buffer)
            mailgun_response = send_email_with_pdf_mailgun(
                to_email=email_to,
                subject=subject,
                text_content=text_content,
                pdf_bytes=pdf_buffer,
                company_name=company_name
            )

            if mailgun_response.status_code == 200:
                return Response({"message": "PDF enviado exitosamente por correo."}, status=status.HTTP_200_OK)
            else:
                print(f"Error de Mailgun: {mailgun_response.status_code} - {mailgun_response.text}")
                return Response(
                    {"detail": f"Error al enviar el correo: {mailgun_response.text}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Http404:
            return Response({"detail": "Empresa no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error en CompanyPdfEmailView: {e}")
            return Response({"detail": f"Error general al procesar la solicitud: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
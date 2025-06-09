// src/components/organisms/AdModal/AdModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal'; 
import Button from '../../atoms/Button/Button'; 
import Spinner from '../../atoms/Spinner/Spinner'; 
import { generateProductAd } from '../../../services/productsService';

const AdModal = ({ isOpen, onClose, product, initialAd, onAdGenerated }) => {
    const [currentAd, setCurrentAd] = useState(initialAd);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Actualiza el texto si initialAd cambia (ej. cuando se abre el modal con un nuevo producto)
    useEffect(() => {
        setCurrentAd(initialAd);
    }, [initialAd]);

    const handleGenerateAd = async () => {
        if (!product || !product.code) {
            setError("No hay código de producto para generar publicidad.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await generateProductAd(product.code);
            const newAd = response.generated_add || "Texto no disponible.";
            setCurrentAd(newAd);
            if (onAdGenerated) {
                // Notifica a la vista padre para que actualice el producto en la tabla/estado
                onAdGenerated(product.code, newAd);
            }
        } catch (err) {
            console.error("Error al generar publicidad:", err);
            setError(err.message || "Error al generar publicidad. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Publicidad para: ${product?.name || 'Producto'}`}
        >
            <div className="flex flex-col gap-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md min-h-[150px] flex items-center justify-center relative">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">
                            {currentAd || "No hay publicidad generada aún. Haz clic en 'Generar Nuevo Texto' para crear una."}
                        </p>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={handleGenerateAd}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        {loading ? 'Generando...' : 'Generar Nuevo Texto'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AdModal;
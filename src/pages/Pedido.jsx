import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Articulos } from './Articulos';
import axios from '../api/axios';

export const Pedido = () => {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pedidoResponse = await axios.get(`/pedidos/${id}`);
                setPedido(pedidoResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [id]);

    const handleBackClick = () => {
        navigate('/pedidos');
    };

    if (!pedido) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-center bg-gray-300 rounded-md p-1">Pedido #{pedido.numero_pedido}</h1>
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Volver
                    </button>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Artículos</h2>
                    <Articulos pedidoId={id} />
                </div>
            </div>
        </div>
    );
};

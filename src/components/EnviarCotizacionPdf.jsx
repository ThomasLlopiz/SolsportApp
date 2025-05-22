import jsPDF from "jspdf";

export const GenerarCotizacionPdf = ({ pedido, articulos }) => {
  const doc = new jsPDF();

  const imgData = "./solsport/solsport.png";
  try {
    doc.addImage(imgData, 'PNG', 15, 10, 40, 20);
  } catch (e) {
    console.error('Error al añadir imagen:', e);
  } doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(
    'Cooperativa de Trabajo el Progreso Devoto Ltda. "SolSport"',
    60,
    15
  );

  doc.setFont("helvetica", "normal");
  doc.text("Correo Electrónico: Solsportindumentaria@gmail.com", 60, 22);
  doc.text("Dirección: Bv. 25 de Mayo 850", 60, 29);
  doc.text("Horarios de atención: Lunes a Viernes de 7 a 16 hrs.", 60, 36);
  doc.text(`CUIT: 30-66915469-7`, 60, 43);
  doc.text(`Teléfonos: (3564) 482356/588395`, 60, 50);
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 55, 195, 55);
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente: ${pedido.nombre_cliente}`, 15, 60);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 140, 60);
  doc.text(`Validez: 5 DÍAS`, 140, 68);
  doc.text(`Contacto: ${pedido.telefono}`, 15, 68);
  doc.text(`Número de pedido: ${pedido.numero_pedido}`, 15, 75);
  doc.line(15, 82, 195, 82);
  doc.setFontSize(14);
  doc.text("Presupuesto", 15, 95);
  doc.line(15, 100, 50, 100);

  let y = 110;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const headers = ["Prenda", "Tela", "Agregados", "Precio"];
  headers.forEach((header, index) => {
    doc.text(header, 15 + index * 45, y);
  });

  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  doc.setFont("helvetica", "normal");
  articulos.forEach((articulo) => {
    const row = [
      articulo.nombre,
      articulo.tela,
      "", // Dejar vacío para no mostrar agregados en la misma fila
      `$${articulo.precio}`,
    ];

    row.forEach((cell, index) => {
      const safeText = typeof cell === "string" || typeof cell === "number" ? String(cell) : "";
      doc.text(safeText, 15 + index * 45, y);
    });

    // Mostrar agregados uno debajo del otro
    if (Array.isArray(articulo.agregados) && articulo.agregados.length > 0) {
      y += 5;
      articulo.agregados.forEach((agregado) => {
        doc.text(agregado, 105, y); // Ajusta 105 según la columna de "Agregados"
        y += 5;
      });
    }

    if (articulo.comentario) {
      const splitComentario = doc.splitTextToSize(articulo.comentario, 180);
      y += 5;
      doc.text(splitComentario, 15, y);
      y += splitComentario.length * 5;
    } else {
      y += 10;
    }
    // Agregar línea divisoria entre artículos
    doc.setDrawColor(0, 0, 0);
    doc.line(15, y, 195, y); // Línea horizontal después de cada artículo
    y += 5; // Espacio después de la línea
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });

  doc.setFont("helvetica", "bold");
  const total = articulos
    .reduce((sum, item) => sum + (parseFloat(item.precio) || 0), 0)
    .toFixed(2);

  doc.text(`Total: $${total}`, 150, y + 10);

  y += 30;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Plazo de entrega: a convenir", 15, y);
  doc.text("Precios unitarios no incluyen IVA - Son + IVA", 15, y + 8);
  doc.text(
    "Condición de pago: 50% al confirmar el pedido y el resto contra entrega",
    15,
    y + 16
  );
  doc.text(
    "Forma de pagos: Efectivo. Valores máximos a 30 días de entrega",
    15,
    y + 24
  );

  return doc;
};

export const EnviarCotizacionPorEmail = async ({
  pedido,
  articulos,
  email,
  pedidoId,
  API_URL,
  setIsSending,
  setSendStatus,
}) => {
  if (!email) {
    alert("Por favor ingrese un email válido");
    return;
  }

  setIsSending(true);
  setSendStatus(null);

  try {
    const doc = GenerarCotizacionPdf({ pedido, articulos });
    const pdfBlob = doc.output("blob");
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];

        try {
          const response = await fetch(`${API_URL}/enviar-cotizacion`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              email,
              pedidoId,
              pdfBase64: base64data,
              fileName: `cotizacion_pedido_${pedido.numero_pedido}.pdf`,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al enviar la cotización");
          }

          const data = await response.json();
          setSendStatus({
            success: true,
            message: data.message || "Cotización enviada correctamente",
          });
          resolve();
        } catch (error) {
          setSendStatus({
            success: false,
            message: error.message.includes("<!DOCTYPE html>")
              ? "Error en el servidor al procesar la solicitud"
              : error.message,
          });
          reject(error);
        } finally {
          setIsSending(false);
        }
      };

      reader.onerror = () => {
        const error = new Error("Error al convertir el PDF");
        setSendStatus({
          success: false,
          message: error.message,
        });
        setIsSending(false);
        reject(error);
      };
    });
  } catch (error) {
    console.error("Error al generar PDF:", error);
    setSendStatus({
      success: false,
      message: "Error al generar el PDF: " + error.message,
    });
    setIsSending(false);
    throw error;
  }
};

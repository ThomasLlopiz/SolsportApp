import jsPDF from "jspdf";
import logo from "../../public/faviconsolsports.png";

export const GenerarCotizacionPdf = async ({
  pedido,
  articulos,
  isEnviar = false,
}) => {
  const doc = new jsPDF();

  const talleOrden = [
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
  ];

  const talleRanges = {
    "2 a 8": ["2", "4", "6", "8"],
    "10 a XS": ["10", "XS"],
    "S a XL": ["S", "M", "L", "XL"],
    "2XL a 3XL": ["2XL", "3XL"],
  };

  const getTallesInRange = (talle) => {
    return talleRanges[talle] || [talle];
  };

  const getLargestTalle = (talles) => {
    return talles.reduce((largest, current) => {
      const currentIdx = talleOrden.indexOf(current);
      const largestIdx = talleOrden.indexOf(largest);
      return currentIdx > largestIdx ? current : largest;
    }, talles[0]);
  };

  const groupedArticulos = articulos.reduce((acc, articulo) => {
    const agregadosArray = Array.isArray(articulo.agregados)
      ? articulo.agregados
      : typeof articulo.agregados === "string" && articulo.agregados
      ? articulo.agregados.split(/[,;]/).map((item) => item.trim())
      : [];

    const key = `${articulo.nombre}|${
      articulo.tela || ""
    }|${agregadosArray.join(",")}`;
    if (!acc[key]) {
      acc[key] = {
        nombre: articulo.nombre,
        tela: articulo.tela || "",
        agregados: agregadosArray,
        talles: [],
        precios: [],
        cantidades: [],
        ganancia: articulo.ganancia || 0,
        comentario: articulo.comentario || "",
      };
    }
    acc[key].talles.push(articulo.talle);
    acc[key].precios.push(parseFloat(articulo.precio) || 0);
    acc[key].cantidades.push(parseInt(articulo.cantidad) || 1);
    return acc;
  }, {});

  const formattedArticulos = Object.values(groupedArticulos).map((group) => {
    const allTalles = group.talles.flatMap((talle) => getTallesInRange(talle));
    const matchingRange = Object.entries(talleRanges).find(
      ([range, rangeTalles]) => {
        return (
          allTalles.every((t) => rangeTalles.includes(t)) &&
          rangeTalles.length === new Set(allTalles).size
        );
      }
    );
    const talleDisplay = matchingRange
      ? matchingRange[0]
      : [...new Set(allTalles)].join(", ");

    const largestTalle = getLargestTalle(allTalles);
    const talleIndex = group.talles.findIndex((t) =>
      getTallesInRange(t).includes(largestTalle)
    );
    const basePrice = group.precios[talleIndex] || 0;
    const ganancia = parseFloat(group.ganancia) || 0;
    const precioConGanancia = basePrice * (1 + ganancia / 100);

    const totalCantidad = group.cantidades.reduce((sum, qty) => sum + qty, 0);

    return {
      ...group,
      talle: talleDisplay,
      precio: isNaN(precioConGanancia) ? 0 : precioConGanancia,
      cantidad: totalCantidad,
    };
  });

  const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgUrl;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = () =>
        reject(new Error(`No se pudo cargar la imagen: ${imgUrl}`));
    });
  };

  try {
    const base64Img = await getBase64Image(logo);
    doc.addImage(base64Img, "PNG", 17.5, 14, 40, 40);
  } catch (e) {}

  doc.setFontSize(12);
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

  const headers = isEnviar
    ? ["Prenda", "Talle", "Precio"]
    : ["Cantidad", "Prenda", "Talle", "Agregados", "Precio"];
  const headerXPositions = isEnviar ? [15, 75, 150] : [15, 35, 80, 125, 180];

  headers.forEach((header, index) => {
    doc.text(header, headerXPositions[index], y);
  });

  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  doc.setFont("helvetica", "normal");
  if (isEnviar) {
    formattedArticulos.forEach((articulo) => {
      const row = isEnviar
        ? [articulo.nombre, articulo.talle, `$${articulo.precio.toFixed(2)}`]
        : [
            articulo.cantidad,
            articulo.nombre,
            articulo.talle,
            "",
            `$${articulo.precio.toFixed(2)}`,
          ];

      row.forEach((cell, index) => {
        const safeText =
          typeof cell === "string" || typeof cell === "number"
            ? String(cell)
            : "";
        doc.text(safeText, headerXPositions[index], y);
      });

      let rowHeight = 10;

      if (!isEnviar) {
        let agregadosHeight = 0;
        if (articulo.agregados.length > 0) {
          articulo.agregados.forEach((agregado, index) => {
            const offsetY = y + index * 5;
            const splitAgregado = doc.splitTextToSize(agregado, 36);
            splitAgregado.forEach((line, lineIndex) => {
              doc.text(line, 125, offsetY + lineIndex * 5);
            });
            agregadosHeight = (index + 1 + (splitAgregado.length - 1)) * 5;
          });
        }
        rowHeight = Math.max(10, agregadosHeight);

        if (articulo.tela) {
          y += rowHeight;
          doc.text(`Tela: ${articulo.tela}`, 15, y);
          y += 5;
          rowHeight += 5;
        }
      }

      y += rowHeight;

      if (articulo.comentario) {
        const splitComentario = doc.splitTextToSize(articulo.comentario, 180);
        y += 5;
        doc.text(splitComentario, 15, y);
        y += splitComentario.length * 5;
      }

      doc.setDrawColor(0, 0, 0);
      doc.line(15, y, 195, y);
      y += 5;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });
  } else {
    articulos.forEach((articulo) => {
      const basePrice = parseFloat(articulo.precio) || 0;
      const ganancia = parseFloat(articulo.ganancia) || 0;
      const precioConGanancia = basePrice * (1 + ganancia / 100);
      const cantidad = parseInt(articulo.cantidad) || 1;
      const talles = getTallesInRange(articulo.talle);

      talles.forEach((talle) => {
        const row = [
          cantidad,
          articulo.nombre,
          talle,
          "",
          `$${precioConGanancia.toFixed(2)}`,
        ];

        row.forEach((cell, index) => {
          const safeText =
            typeof cell === "string" || typeof cell === "number"
              ? String(cell)
              : "";
          doc.text(safeText, headerXPositions[index], y);
        });

        let rowHeight = 10;

        let agregadosHeight = 0;
        if (articulo.agregados && articulo.agregados.length > 0) {
          articulo.agregados.forEach((agregado, index) => {
            const offsetY = y + index * 5;
            const splitAgregado = doc.splitTextToSize(agregado, 36);
            splitAgregado.forEach((line, lineIndex) => {
              doc.text(line, 125, offsetY + lineIndex * 5);
            });
            agregadosHeight = (index + 1 + (splitAgregado.length - 1)) * 5;
          });
        }
        rowHeight = Math.max(10, agregadosHeight);

        if (articulo.tela) {
          y += rowHeight;
          doc.text(`Tela: ${articulo.tela}`, 15, y);
          y += 5;
          rowHeight += 5;
        }

        y += rowHeight;

        if (articulo.comentario) {
          const splitComentario = doc.splitTextToSize(articulo.comentario, 180);
          y += 5;
          doc.text(splitComentario, 15, y);
          y += splitComentario.length * 5;
        }

        doc.setDrawColor(0, 0, 0);
        doc.line(15, y, 195, y);
        y += 5;

        if (y > 250) {
          doc.addPage();
          y = 20;
        }
      });
    });
  }

  doc.setFont("helvetica", "bold");
  const total = isEnviar
    ? formattedArticulos
        .reduce((sum, articulo) => sum + articulo.precio, 0)
        .toFixed(2)
        .replace(".", ",")
    : articulos
        .reduce(
          (sum, articulo) =>
            sum +
            parseFloat(articulo.precio) *
              (parseInt(articulo.cantidad) || 1) *
              getTallesInRange(articulo.talle).length,
          0
        )
        .toFixed(2)
        .replace(".", ",");

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
    const doc = await GenerarCotizacionPdf({
      pedido,
      articulos,
      isEnviar: true,
    });
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
    setSendStatus({
      success: false,
      message: "Error al generar el PDF: " + error.message,
    });
    setIsSending(false);
    throw error;
  }
};

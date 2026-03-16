package com.financial.score.service;

import com.financial.score.model.Pago;
import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.repository.PagoRepository;
import com.financial.score.repository.TransaccionRepository;
import com.financial.score.repository.TransaccionDetalleRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.BorderRadius;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

/**
 * Genera los dos tipos de comprobante PDF del sistema:
 *
 *  1. ORDEN DE PAGO  (GET /api/transacciones/{id}/pdf)
 *     — Siempre disponible.
 *     — Si está PENDIENTE: muestra tabla de ítems + saldo pendiente + banner dorado.
 *     — Si está PAGADO:    muestra tabla de ítems + tabla de pagos recibidos +
 *                          banner verde "PAGADO". El ajuste desaparece porque ya
 *                          no hay saldo sobre el que aplicar nada.
 *
 *  2. COMPROBANTE DE CIERRE  (GET /api/transacciones/{id}/pdf/cierre)
 *     — Solo disponible cuando estadoPago = "pagado".
 *     — Documento formal para auditoría: incluye tabla de pagos,
 *       sello LIQUIDADO y nota certificativa.
 *     — NO incluye sección de ajuste (no aplica post-liquidación).
 */
@Service
public class TransaccionPdfService {

    // ── Paleta ────────────────────────────────────────────────────────────────
    private static final DeviceRgb C_ACCENT    = new DeviceRgb(0x1a, 0x3a, 0x2a);
    private static final DeviceRgb C_ACCENT2   = new DeviceRgb(0x2d, 0x6a, 0x4f);
    private static final DeviceRgb C_ACCENT_LT = new DeviceRgb(0xe8, 0xf0, 0xeb);
    private static final DeviceRgb C_BG        = new DeviceRgb(0xf4, 0xf1, 0xeb);
    private static final DeviceRgb C_SURFACE   = new DeviceRgb(0xff, 0xfe, 0xfb);
    private static final DeviceRgb C_BORDER    = new DeviceRgb(0xe2, 0xdd, 0xd4);
    private static final DeviceRgb C_TEXT      = new DeviceRgb(0x1a, 0x17, 0x14);
    private static final DeviceRgb C_MUTED     = new DeviceRgb(0x8a, 0x82, 0x78);
    private static final DeviceRgb C_GOLD      = new DeviceRgb(0xb8, 0x95, 0x2a);
    private static final DeviceRgb C_GOLD_LT   = new DeviceRgb(0xfa, 0xf4, 0xe1);
    private static final DeviceRgb C_GREEN     = new DeviceRgb(0x16, 0xa3, 0x4a);
    private static final DeviceRgb C_GREEN_LT  = new DeviceRgb(0xf0, 0xfd, 0xf4);
    private static final DeviceRgb C_BLUE      = new DeviceRgb(0x1e, 0x40, 0xaf);
    private static final DeviceRgb C_BLUE_LT   = new DeviceRgb(0xef, 0xf6, 0xff);

    private static final DateTimeFormatter FMT_LARGO =
            DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", new Locale("es", "PE"));
    private static final DateTimeFormatter FMT_CORTO =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final TransaccionRepository        transaccionRepo;
    private final TransaccionDetalleRepository detalleRepo;
    private final PagoRepository               pagoRepository;

    public TransaccionPdfService(TransaccionRepository        transaccionRepo,
                                 TransaccionDetalleRepository detalleRepo,
                                 PagoRepository               pagoRepository) {
        this.transaccionRepo  = transaccionRepo;
        this.detalleRepo      = detalleRepo;
        this.pagoRepository   = pagoRepository;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Método 1 — ORDEN DE PAGO
    // Comportamiento diferente según si está pagado o pendiente
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public byte[] generarOrdenPago(Long transaccionId) {
        Transaccion              trx      = findOrThrow(transaccionId);
        List<TransaccionDetalle> detalles = detalleRepo.findByTransaccionId(transaccionId);
        List<Pago>               pagos    = pagoRepository.findByTransaccionId(transaccionId);

        boolean esPagado = "pagado".equalsIgnoreCase(trx.getEstadoPago());
        return buildPdf(trx, detalles, pagos, esPagado ? TipoDoc.ORDEN_PAGADA : TipoDoc.ORDEN_PENDIENTE);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Método 2 — COMPROBANTE DE CIERRE (solo si pagado)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public byte[] generarComprobanteCierre(Long transaccionId) {
        Transaccion trx = findOrThrow(transaccionId);
        if (!"pagado".equalsIgnoreCase(trx.getEstadoPago())) {
            throw new IllegalStateException(
                    "Comprobante de cierre solo disponible para transacciones pagadas. Estado: "
                            + trx.getEstadoPago());
        }
        List<TransaccionDetalle> detalles = detalleRepo.findByTransaccionId(transaccionId);
        List<Pago>               pagos    = pagoRepository.findByTransaccionId(transaccionId);
        return buildPdf(trx, detalles, pagos, TipoDoc.CIERRE);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Enum interno para diferenciar los 3 estados del documento
    // ─────────────────────────────────────────────────────────────────────────
    private enum TipoDoc {
        ORDEN_PENDIENTE,  // Orden de pago con saldo pendiente
        ORDEN_PAGADA,     // Orden de pago ya liquidada (sin sección ajuste)
        CIERRE            // Comprobante formal de cierre para auditoría
    }

    private Transaccion findOrThrow(Long id) {
        return transaccionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaccion no encontrada: " + id));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Builder principal — enruta según TipoDoc
    // ─────────────────────────────────────────────────────────────────────────
    private byte[] buildPdf(Transaccion trx,
                            List<TransaccionDetalle> detalles,
                            List<Pago> pagos,
                            TipoDoc tipo) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            Document doc = new Document(new PdfDocument(new PdfWriter(baos)), PageSize.A4);
            doc.setMargins(36f, 40f, 36f, 40f);

            PdfFont fontReg      = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontBold     = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont fontMono     = PdfFontFactory.createFont(StandardFonts.COURIER);
            PdfFont fontMonoBold = PdfFontFactory.createFont(StandardFonts.COURIER_BOLD);

            // Secciones compartidas
            addHeader(doc, trx, tipo, fontBold, fontReg, fontMono, fontMonoBold);
            addLineDivider(doc, C_BORDER, 0.5f, 8f, 8f);
            addEmpresaInfo(doc, trx, fontBold, fontReg, fontMono);
            addLineDivider(doc, C_BORDER, 0.5f, 6f, 10f);
            addTransaccionInfo(doc, trx, fontBold, fontReg, fontMono);
            addSpacing(doc, 10f);
            addTablaItems(doc, detalles, fontBold, fontReg, fontMono, fontMonoBold);
            addSpacing(doc, 12f);
            addTotales(doc, trx, detalles, fontBold, fontReg, fontMono);
            addSpacing(doc, 14f);

            // Secciones que cambian según tipo
            if (tipo == TipoDoc.ORDEN_PENDIENTE) {
                // Solo muestra el estado pendiente — el ajuste se gestiona desde la UI
                addBannerEstado(doc, trx, fontBold, fontMono);

            } else if (tipo == TipoDoc.ORDEN_PAGADA) {
                // Muestra la tabla de pagos recibidos + banner verde
                addTablaPagos(doc, pagos, fontBold, fontReg, fontMono, fontMonoBold);
                addSpacing(doc, 10f);
                addBannerPagado(doc, pagos, fontBold, fontMono);

            } else { // CIERRE
                // Tabla de pagos + banner liquidado + nota certificativa
                addTablaPagos(doc, pagos, fontBold, fontReg, fontMono, fontMonoBold);
                addSpacing(doc, 10f);
                addBannerCierre(doc, trx, fontBold, fontMono);
                addSpacing(doc, 8f);
                addNotaCertificativa(doc, trx, fontReg, fontMono);
            }

            addFooter(doc, trx, tipo, fontReg, fontMono, fontMonoBold);
            doc.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF transaccion " + trx.getId(), e);
        }
        return baos.toByteArray();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 1 — Header
    // ─────────────────────────────────────────────────────────────────────────
    private void addHeader(Document doc, Transaccion trx, TipoDoc tipo,
                           PdfFont fontBold, PdfFont fontReg, PdfFont fontMono, PdfFont fontMonoBold) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
                .setWidth(UnitValue.createPercentValue(100)).setBorder(Border.NO_BORDER);

        Cell left = new Cell().setBorder(Border.NO_BORDER).setVerticalAlignment(VerticalAlignment.MIDDLE);
        left.add(new Paragraph("ScoreCredit").setFont(fontBold).setFontSize(20)
                .setFontColor(C_ACCENT).setMarginBottom(2));
        left.add(new Paragraph("SISTEMA DE SCORING CREDITICIO").setFont(fontMono).setFontSize(7)
                .setFontColor(C_MUTED).setCharacterSpacing(0.6f));
        t.addCell(left);

        Cell right = new Cell().setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT).setVerticalAlignment(VerticalAlignment.MIDDLE);

        String titulo;
        DeviceRgb colorTitulo;
        switch (tipo) {
            case ORDEN_PAGADA  -> { titulo = "ORDEN DE PAGO — LIQUIDADA";          colorTitulo = C_GREEN; }
            case CIERRE        -> { titulo = "COMPROBANTE DE CIERRE / LIQUIDACION"; colorTitulo = C_GREEN; }
            default            -> { titulo = "ORDEN DE PAGO";                       colorTitulo = C_ACCENT; }
        }

        right.add(new Paragraph(titulo).setFont(fontBold).setFontSize(9.5f)
                .setFontColor(colorTitulo).setCharacterSpacing(0.4f));
        right.add(new Paragraph(trx.getCodigoTransaccion()).setFont(fontMonoBold).setFontSize(8.5f)
                .setFontColor(C_ACCENT2).setMarginTop(4));
        right.add(new Paragraph("Emitido: " + formatCorto(trx.getFechaVenta()))
                .setFont(fontReg).setFontSize(8).setFontColor(C_MUTED).setMarginTop(2));
        t.addCell(right);

        doc.add(t);
        addSpacing(doc, 10f);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 2 — Empresa
    // ─────────────────────────────────────────────────────────────────────────
    private void addEmpresaInfo(Document doc, Transaccion trx,
                                PdfFont fontBold, PdfFont fontReg, PdfFont fontMono) {
        doc.add(labelSeccion("DATOS DEL CLIENTE", fontMono));
        Table t = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100)).setBorder(Border.NO_BORDER)
                .setBackgroundColor(C_BG).setBorderRadius(new BorderRadius(8));
        infoRow(t, "Razon Social",  trx.getEmpresa().getRazonSocial(), fontBold, fontReg,  true);
        infoRow(t, "RUC",           trx.getEmpresa().getRuc(),         fontBold, fontMono, false);
        infoRow(t, "Direccion",     nvl(trx.getEmpresa().getDireccion()), fontBold, fontReg, false);
        infoRow(t, "Rubro",         nvl(trx.getEmpresa().getRubro()),     fontBold, fontReg, false);
        if (trx.getEmpresa().getCorreoContacto() != null)
            infoRow(t, "Correo", trx.getEmpresa().getCorreoContacto(), fontBold, fontMono, false);
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 3 — Fechas y estado
    // ─────────────────────────────────────────────────────────────────────────
    private void addTransaccionInfo(Document doc, Transaccion trx,
                                    PdfFont fontBold, PdfFont fontReg, PdfFont fontMono) {
        doc.add(labelSeccion("DETALLES DE LA TRANSACCION", fontMono));
        Table t = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
                .setWidth(UnitValue.createPercentValue(100)).setBorder(Border.NO_BORDER);

        String estadoTexto = "pagado".equalsIgnoreCase(trx.getEstadoPago()) ? "PAGADO" :
                trx.getEstadoPago() != null ? trx.getEstadoPago().toUpperCase() : "PENDIENTE";
        DeviceRgb estadoColor = "PAGADO".equals(estadoTexto) ? C_GREEN : C_GOLD;

        String[] labels = {"Fecha de venta", "Fecha de vencimiento", "Estado", "ID interno"};
        String[] values = {
                formatCorto(trx.getFechaVenta()),
                formatCorto(trx.getFechaVencimiento()),
                estadoTexto,
                "#" + trx.getId()
        };
        PdfFont[] fv = {fontMono, fontMono, fontBold, fontMono};

        for (int i = 0; i < labels.length; i++) {
            Cell c = new Cell().setBorder(Border.NO_BORDER)
                    .setBackgroundColor(i % 2 == 0 ? C_ACCENT_LT : C_BG)
                    .setPadding(10).setBorderRadius(new BorderRadius(6));
            c.add(new Paragraph(labels[i]).setFont(fontBold).setFontSize(7)
                    .setFontColor(C_MUTED).setCharacterSpacing(0.4f).setMarginBottom(4));
            c.add(new Paragraph(values[i]).setFont(fv[i]).setFontSize(10)
                    .setFontColor(i == 2 ? estadoColor : C_TEXT));
            t.addCell(c);
        }
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 4 — Tabla de ítems
    // ─────────────────────────────────────────────────────────────────────────
    private void addTablaItems(Document doc, List<TransaccionDetalle> detalles,
                               PdfFont fontBold, PdfFont fontReg,
                               PdfFont fontMono, PdfFont fontMonoBold) {
        doc.add(labelSeccion("PRODUCTOS / ITEMS", fontMono));
        Table t = new Table(UnitValue.createPercentArray(new float[]{8f, 38f, 10f, 18f, 14f, 12f}))
                .setWidth(UnitValue.createPercentValue(100));
        for (String h : new String[]{"#", "Descripcion", "Cant.", "P. Unit.", "Subtotal", "U.M."}) {
            t.addHeaderCell(hdrCell(h, fontBold));
        }
        int n = 1;
        for (TransaccionDetalle d : detalles) {
            DeviceRgb bg = n % 2 == 0 ? C_BG : C_SURFACE;
            double pu  = d.getPrecioUnitario().doubleValue();
            double sub = d.getCantidad() * pu;
            String nom = d.getProducto() != null ? d.getProducto().getNombre() : "Producto #" + d.getId();
            String um  = d.getProducto() != null && d.getProducto().getUnidadMedida() != null
                    ? d.getProducto().getUnidadMedida() : "-";
            itemCell(t, String.valueOf(n),               fontMono,     8, bg, TextAlignment.CENTER);
            itemCell(t, nom,                              fontBold,     9, bg, TextAlignment.LEFT);
            itemCell(t, String.valueOf(d.getCantidad()),  fontMono,     9, bg, TextAlignment.RIGHT);
            itemCell(t, fmt(pu),                         fontMono,     9, bg, TextAlignment.RIGHT);
            itemCell(t, fmt(sub),                        fontMonoBold, 9, bg, TextAlignment.RIGHT);
            itemCell(t, um,                              fontMono,     8, bg, TextAlignment.LEFT);
            n++;
        }
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 5 — Totales
    // ─────────────────────────────────────────────────────────────────────────
    private void addTotales(Document doc, Transaccion trx,
                            List<TransaccionDetalle> detalles,
                            PdfFont fontBold, PdfFont fontReg, PdfFont fontMono) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .setWidth(UnitValue.createPercentValue(100)).setBorder(Border.NO_BORDER);
        t.addCell(new Cell().setBorder(Border.NO_BORDER));
        Cell right = new Cell().setBorder(Border.NO_BORDER);

        double sub   = detalles.stream().mapToDouble(d -> d.getCantidad() * d.getPrecioUnitario().doubleValue()).sum();
        double igv   = sub * 0.18;
        double total = trx.getMontoTotal().doubleValue();

        right.add(totalRow("Subtotal",      fmt(sub),   fontReg,  fontMono, false));
        right.add(totalRow("IGV (18%)",     fmt(igv),   fontReg,  fontMono, false));
        right.add(new LineSeparator(new SolidLine(0.5f)).setMarginTop(4).setMarginBottom(4));
        right.add(totalRow("TOTAL",         fmt(total), fontBold, fontBold, true));
        right.add(new Paragraph(enLetras(total)).setFont(fontReg).setFontSize(7.5f)
                .setFontColor(C_MUTED).setItalic().setMarginTop(4));
        t.addCell(right);
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN 6 — Tabla de pagos recibidos (solo en ORDEN_PAGADA y CIERRE)
    // ─────────────────────────────────────────────────────────────────────────
    private void addTablaPagos(Document doc, List<Pago> pagos,
                               PdfFont fontBold, PdfFont fontReg,
                               PdfFont fontMono, PdfFont fontMonoBold) {
        doc.add(labelSeccion("PAGOS RECIBIDOS", fontMono));

        if (pagos.isEmpty()) {
            doc.add(new Paragraph("Sin pagos registrados.")
                    .setFont(fontReg).setFontSize(8.5f).setFontColor(C_MUTED));
            return;
        }

        // Columnas basadas en campos reales de Pago.java:
        // fechaPago, monto, metodoPago, banco, numeroOperacion (tipoPago NO existe)
        Table t = new Table(UnitValue.createPercentArray(new float[]{8f, 20f, 20f, 22f, 16f, 14f}))
                .setWidth(UnitValue.createPercentValue(100));

        for (String h : new String[]{"#", "Fecha pago", "Monto", "Metodo", "Banco", "N° Op."}) {
            t.addHeaderCell(new Cell().setBackgroundColor(C_ACCENT2).setBorder(Border.NO_BORDER)
                    .setPaddingTop(7).setPaddingBottom(7).setPaddingLeft(8).setPaddingRight(8)
                    .add(new Paragraph(h).setFont(fontBold).setFontSize(7.5f)
                            .setFontColor(ColorConstants.WHITE)
                            .setTextAlignment(h.equals("Monto") ? TextAlignment.RIGHT : TextAlignment.LEFT)));
        }

        int n = 1;
        BigDecimal totalPagado = BigDecimal.ZERO;
        for (Pago p : pagos) {
            DeviceRgb bg = n % 2 == 0 ? C_BG : C_SURFACE;
            BigDecimal monto = p.getMonto() != null ? p.getMonto() : BigDecimal.ZERO;
            totalPagado = totalPagado.add(monto);

            itemCell(t, String.valueOf(n),                                               fontMono,     7.5f, bg, TextAlignment.CENTER);
            itemCell(t, p.getFechaPago() != null ? formatCorto(p.getFechaPago()) : "-", fontMono,     8f,   bg, TextAlignment.LEFT);
            itemCell(t, fmt(monto.doubleValue()),                                        fontMonoBold, 8f,   bg, TextAlignment.RIGHT);
            itemCell(t, nvl(p.getMetodoPago()),                                          fontReg,      8f,   bg, TextAlignment.LEFT);
            itemCell(t, nvl(p.getBanco()),                                               fontMono,     7.5f, bg, TextAlignment.LEFT);
            itemCell(t, nvl(p.getNumeroOperacion()),                                     fontMono,     7.5f, bg, TextAlignment.LEFT);
            n++;
        }

        // Fila de total pagado
        t.addCell(new Cell(1, 2).setBorder(Border.NO_BORDER)
                .setBorderTop(new SolidBorder(C_BORDER, 0.5f))
                .setBackgroundColor(C_ACCENT_LT).setPadding(8)
                .add(new Paragraph("TOTAL PAGADO").setFont(fontBold).setFontSize(8.5f).setFontColor(C_ACCENT)));
        t.addCell(new Cell(1, 4).setBorder(Border.NO_BORDER)
                .setBorderTop(new SolidBorder(C_BORDER, 0.5f))
                .setBackgroundColor(C_ACCENT_LT).setPadding(8)
                .setTextAlignment(TextAlignment.RIGHT)
                .add(new Paragraph(fmt(totalPagado.doubleValue())).setFont(fontMonoBold)
                        .setFontSize(10).setFontColor(C_GREEN)));

        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Banners
    // ─────────────────────────────────────────────────────────────────────────
    private void addBannerEstado(Document doc, Transaccion trx, PdfFont fontBold, PdfFont fontMono) {
        boolean pend = !"pagado".equalsIgnoreCase(trx.getEstadoPago());
        String texto = pend
                ? "PENDIENTE DE PAGO  —  Vence el " + formatCorto(trx.getFechaVencimiento())
                : "PAGADO";
        bannerGenerico(doc, texto, pend ? C_GOLD_LT : C_ACCENT_LT, pend ? C_GOLD : C_ACCENT2, fontBold);
    }

    private void addBannerPagado(Document doc, List<Pago> pagos, PdfFont fontBold, PdfFont fontMono) {
        String fechaUltimoPago = pagos.isEmpty() ? "-"
                : formatCorto(pagos.get(pagos.size() - 1).getFechaPago());
        bannerGenerico(doc,
                "PAGADO EN SU TOTALIDAD  —  Ultimo pago: " + fechaUltimoPago,
                C_GREEN_LT, C_GREEN, fontBold);
    }

    private void addBannerCierre(Document doc, Transaccion trx, PdfFont fontBold, PdfFont fontMono) {
        bannerGenerico(doc,
                "TRANSACCION LIQUIDADA  —  Generado el " + formatCorto(LocalDate.now()),
                C_GREEN_LT, C_GREEN, fontBold);
    }

    private void bannerGenerico(Document doc, String texto, DeviceRgb bg, DeviceRgb color, PdfFont font) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{100}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBackgroundColor(bg).setBorder(new SolidBorder(color, 0.8f))
                .setBorderRadius(new BorderRadius(8));
        t.addCell(new Cell().setBorder(Border.NO_BORDER)
                .setPaddingTop(10).setPaddingBottom(10).setPaddingLeft(16)
                .add(new Paragraph(texto).setFont(font).setFontSize(9.5f).setFontColor(color)));
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Nota certificativa — solo en CIERRE
    // ─────────────────────────────────────────────────────────────────────────
    private void addNotaCertificativa(Document doc, Transaccion trx,
                                      PdfFont fontReg, PdfFont fontMono) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{100}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBackgroundColor(C_BG).setBorder(new SolidBorder(C_BORDER, 0.5f))
                .setBorderRadius(new BorderRadius(8));
        t.addCell(new Cell().setBorder(Border.NO_BORDER).setPadding(14)
                .add(new Paragraph("CERTIFICACION")
                        .setFont(fontMono).setFontSize(7).setFontColor(C_ACCENT2)
                        .setCharacterSpacing(1f).setMarginBottom(6))
                .add(new Paragraph(
                        "Se certifica que la transaccion " + trx.getCodigoTransaccion() +
                                " correspondiente a " + trx.getEmpresa().getRazonSocial() +
                                " (RUC " + trx.getEmpresa().getRuc() + ") ha sido cancelada en su " +
                                "totalidad por un monto de " + fmt(trx.getMontoTotal().doubleValue()) +
                                ". Este documento tiene validez como comprobante de liquidacion.")
                        .setFont(fontReg).setFontSize(8.5f).setFontColor(C_TEXT).setFixedLeading(14f)));
        doc.add(t);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Footer
    // ─────────────────────────────────────────────────────────────────────────
    private void addFooter(Document doc, Transaccion trx, TipoDoc tipo,
                           PdfFont fontReg, PdfFont fontMono, PdfFont fontMonoBold) {
        addSpacing(doc, 20f);
        addLineDivider(doc, C_BORDER, 0.4f, 0f, 10f);

        Table footer = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .setWidth(UnitValue.createPercentValue(100)).setBorder(Border.NO_BORDER);

        Cell left = new Cell().setBorder(Border.NO_BORDER);
        left.add(new Paragraph("ScoreCredit  —  Sistema de Scoring Crediticio B2B")
                .setFont(fontMonoBold).setFontSize(7).setFontColor(C_ACCENT2).setCharacterSpacing(0.3f));
        left.add(new Paragraph("Generado el " + LocalDate.now().format(FMT_LARGO))
                .setFont(fontMono).setFontSize(7).setFontColor(C_MUTED).setMarginTop(3));
        String tipoTexto = tipo == TipoDoc.CIERRE
                ? "Comprobante de cierre — documento de auditoria."
                : "Orden de pago — documento interno de gestion.";
        left.add(new Paragraph(tipoTexto).setFont(fontReg).setFontSize(7)
                .setFontColor(C_MUTED).setMarginTop(2));
        footer.addCell(left);

        Cell right = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
        right.add(new Paragraph(trx.getCodigoTransaccion()).setFont(fontMonoBold)
                .setFontSize(7.5f).setFontColor(C_ACCENT));
        right.add(new Paragraph("ID #" + trx.getId()).setFont(fontMono)
                .setFontSize(7).setFontColor(C_MUTED).setMarginTop(3));
        footer.addCell(right);

        doc.add(footer);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers de construcción
    // ─────────────────────────────────────────────────────────────────────────
    private Paragraph labelSeccion(String texto, PdfFont fontMono) {
        return new Paragraph(texto).setFont(fontMono).setFontSize(7.5f)
                .setFontColor(C_ACCENT2).setCharacterSpacing(1f).setMarginBottom(8);
    }

    private Cell hdrCell(String text, PdfFont fontBold) {
        return new Cell().setBackgroundColor(C_ACCENT).setBorder(Border.NO_BORDER)
                .setPaddingTop(8).setPaddingBottom(8).setPaddingLeft(8).setPaddingRight(8)
                .add(new Paragraph(text).setFont(fontBold).setFontSize(8)
                        .setFontColor(ColorConstants.WHITE)
                        .setTextAlignment(text.equals("Cant.") || text.equals("P. Unit.") || text.equals("Subtotal")
                                ? TextAlignment.RIGHT : TextAlignment.LEFT));
    }

    private void infoRow(Table t, String lbl, String val,
                         PdfFont fl, PdfFont fv, boolean first) {
        DeviceRgb bg = first ? C_ACCENT_LT : C_SURFACE;
        t.addCell(new Cell().setBackgroundColor(bg).setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(C_BORDER, 0.4f)).setPadding(9).setPaddingLeft(12)
                .add(new Paragraph(lbl).setFont(fl).setFontSize(7.5f).setFontColor(C_MUTED)));
        t.addCell(new Cell().setBackgroundColor(bg).setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(C_BORDER, 0.4f)).setPadding(9)
                .add(new Paragraph(val).setFont(fv).setFontSize(9.5f).setFontColor(C_TEXT)));
    }

    private void itemCell(Table t, String text, PdfFont font,
                          float size, DeviceRgb bg, TextAlignment align) {
        t.addCell(new Cell().setBackgroundColor(bg).setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(C_BORDER, 0.3f))
                .setPaddingTop(8).setPaddingBottom(8).setPaddingLeft(8).setPaddingRight(8)
                .add(new Paragraph(text).setFont(font).setFontSize(size)
                        .setFontColor(C_TEXT).setTextAlignment(align)));
    }

    private Paragraph totalRow(String lbl, String val, PdfFont fl, PdfFont fv, boolean big) {
        return new Paragraph()
                .add(new Text(lbl + "   ").setFont(fl).setFontSize(big ? 10 : 8.5f)
                        .setFontColor(big ? C_ACCENT : C_MUTED))
                .add(new Text(val).setFont(fv).setFontSize(big ? 13 : 9)
                        .setFontColor(big ? C_ACCENT : C_TEXT))
                .setTextAlignment(TextAlignment.RIGHT).setMarginBottom(big ? 0 : 2);
    }

    private void addLineDivider(Document doc, DeviceRgb c, float lw, float mt, float mb) {
        LineSeparator s = new LineSeparator(new SolidLine(lw));
        s.setStrokeColor(c); s.setMarginTop(mt); s.setMarginBottom(mb); doc.add(s);
    }

    private void addSpacing(Document doc, float h) {
        doc.add(new Paragraph(" ").setMarginTop(0).setMarginBottom(0).setFontSize(h / 2f).setHeight(h));
    }

    private String nvl(String v)              { return v != null ? v : "-"; }
    private String formatCorto(LocalDate d)   { return d != null ? d.format(FMT_CORTO) : "-"; }
    private String fmt(double m)              { return String.format(new Locale("es","PE"), "S/ %,.2f", m); }
    private String enLetras(double m) {
        long s = (long) m; long c = Math.round((m - s) * 100);
        return String.format("Son: %d y %02d/100 SOLES (%s)", s, c, fmt(m));
    }
}
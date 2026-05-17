import { Document, Page, Text, View, StyleSheet, pdf, Font } from "@react-pdf/renderer";

const base = window.location.origin;

Font.clear();

Font.register({
  family: "Playfair",
  fonts: [
    { src: `${base}/fonts/playfair-400.woff2`, fontWeight: 400 },
    { src: `${base}/fonts/playfair-700.woff2`, fontWeight: 700 },
    { src: `${base}/fonts/playfair-400-italic.woff2`, fontWeight: 400, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Lato",
  fonts: [
    { src: `${base}/fonts/lato-300.woff2`, fontWeight: 300 },
    { src: `${base}/fonts/lato-400.woff2`, fontWeight: 400 },
  ],
});

const GOLD = "#B8962E";
const DARK = "#1C1C1C";
const CREAM = "#FAF8F3";
const GOLD_LIGHT = "#E8D5A3";

const styles = StyleSheet.create({
  page: { backgroundColor: CREAM, padding: 0, fontFamily: "Lato" },
  outerBorder: {
    position: "absolute", top: 18, left: 18, right: 18, bottom: 18,
    borderWidth: 2, borderColor: GOLD, borderStyle: "solid",
  },
  innerBorder: {
    position: "absolute", top: 26, left: 26, right: 26, bottom: 26,
    borderWidth: 0.5, borderColor: GOLD_LIGHT, borderStyle: "solid",
  },
  cornerTL: { position: "absolute", top: 32, left: 32, width: 28, height: 28, borderTopWidth: 2, borderLeftWidth: 2, borderColor: GOLD },
  cornerTR: { position: "absolute", top: 32, right: 32, width: 28, height: 28, borderTopWidth: 2, borderRightWidth: 2, borderColor: GOLD },
  cornerBL: { position: "absolute", bottom: 32, left: 32, width: 28, height: 28, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: GOLD },
  cornerBR: { position: "absolute", bottom: 32, right: 32, width: 28, height: 28, borderBottomWidth: 2, borderRightWidth: 2, borderColor: GOLD },
  content: { flex: 1, paddingHorizontal: 72, paddingVertical: 52, alignItems: "center" },
  logoRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  wordmark: { fontFamily: "Playfair", fontSize: 13, letterSpacing: 4, color: GOLD, fontWeight: 400 },
  wordmarkItalic: { fontFamily: "Playfair", fontSize: 13, letterSpacing: 2, color: DARK, fontStyle: "italic" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 20, width: "80%" },
  dividerLine: { flex: 1, height: 0.75, backgroundColor: GOLD },
  dividerDiamond: { width: 5, height: 5, backgroundColor: GOLD, transform: "rotate(45deg)" },
  certifiesLabel: { fontFamily: "Lato", fontSize: 9, letterSpacing: 3.5, color: GOLD, fontWeight: 300, marginBottom: 18 },
  studentName: { fontFamily: "Playfair", fontSize: 38, fontWeight: 700, color: DARK, textAlign: "center", lineHeight: 1.2, marginBottom: 20 },
  completionText: { fontFamily: "Lato", fontSize: 10, letterSpacing: 1.5, color: "#666", fontWeight: 300, marginBottom: 10 },
  courseTitle: { fontFamily: "Playfair", fontSize: 20, fontStyle: "italic", color: DARK, textAlign: "center", marginBottom: 6, fontWeight: 400 },
  instructorText: { fontFamily: "Lato", fontSize: 9.5, color: "#888", letterSpacing: 0.5, marginBottom: 28, fontWeight: 300 },
  qualificationBox: { borderWidth: 1, borderColor: GOLD, paddingHorizontal: 24, paddingVertical: 8, marginBottom: 36, alignItems: "center" },
  qualificationLabel: { fontFamily: "Lato", fontSize: 7.5, letterSpacing: 3, color: GOLD, fontWeight: 300, marginBottom: 2 },
  qualificationValue: { fontFamily: "Playfair", fontSize: 14, fontWeight: 700, color: DARK, letterSpacing: 2 },
  signaturesRow: { flexDirection: "row", justifyContent: "space-between", width: "85%", marginTop: 8 },
  signatureBlock: { alignItems: "center", width: 160 },
  signatureLine: { width: 140, height: 0.75, backgroundColor: DARK, marginBottom: 6 },
  signatureLabel: { fontFamily: "Lato", fontSize: 7.5, letterSpacing: 1.5, color: "#666", fontWeight: 300, textAlign: "center" },
  signatureName: { fontFamily: "Playfair", fontSize: 9, color: DARK, fontStyle: "italic", textAlign: "center", marginTop: 2 },
  dateText: { fontFamily: "Lato", fontSize: 8, color: "#AAA", letterSpacing: 1, marginTop: 28, fontWeight: 300 },
});

type CertificateProps = {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: Date;
};

const CertificateDoc = ({ studentName, courseTitle, instructorName, completionDate }: CertificateProps) => {
  const dateStr = completionDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <Text style={styles.wordmark}>ACADEMIA</Text>
            <Text style={styles.wordmarkItalic}> Creativa</Text>
          </View>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.certifiesLabel}>CERTIFICA QUE</Text>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.completionText}>HA COMPLETADO SATISFACTORIAMENTE EL CURSO</Text>
          <Text style={styles.courseTitle}>«{courseTitle}»</Text>
          <Text style={styles.instructorText}>Impartido por {instructorName}</Text>
          <View style={styles.qualificationBox}>
            <Text style={styles.qualificationLabel}>CALIFICACIÓN</Text>
            <Text style={styles.qualificationValue}>APTO</Text>
          </View>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.signaturesRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>INSTRUCTOR</Text>
              <Text style={styles.signatureName}>{instructorName}</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>DIRECCIÓN ACADÉMICA</Text>
              <Text style={styles.signatureName}>Academia Creativa</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function downloadCertificate(props: CertificateProps) {
  const blob = await pdf(<CertificateDoc {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Certificado - ${props.courseTitle}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/store/invoiceStore';
import useClientStore from '@/store/clientStore';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    fontSize: 12,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const { clients } = useClientStore.getState();
  const client = clients.find((c) => c.id === invoice.clientId);
  const clientName = client ? client.name : "Unknown Client";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount * 100); // Assuming 1 hour = $100
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{clientName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>{formatCurrency(invoice.totalAmount)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{invoice.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(invoice.createdAt)}</Text>
        </View>

        <Text style={styles.footer}>
          Thank you for your business.
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

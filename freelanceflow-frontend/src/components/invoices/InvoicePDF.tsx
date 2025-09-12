import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { Invoice } from '@/store/invoiceStore';
import useClientStore from '@/store/clientStore';
import { useCompanySettingsStore } from '@/store/companySettingsStore';
import useProjectStore from '@/store/projectStore';

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const { clients } = useClientStore.getState();
  const { projects } = useProjectStore.getState();
  const { settings } = useCompanySettingsStore.getState();
  const client = clients.find((c) => c.id === invoice.clientId);
  const clientName = client ? client.name : "Unknown Client";

  const invoiceProjects = projects.filter(p => invoice.projectIds.includes(p.id));

  // Create styles with dynamic color
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    logo: {
      width: 120,
      height: 50,
      objectFit: 'contain',
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontFamily: 'Helvetica-Bold',
      color: settings.primaryColor || '#000000',
    },
    companyName: {
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 4,
    },
    section: {
      marginBottom: 10,
    },
    label: {
      fontSize: 12,
      marginBottom: 4,
      fontFamily: 'Helvetica-Bold',
      color: settings.primaryColor || '#000000',
    },
    value: {
      fontSize: 12,
      marginBottom: 10,
    },
    table: {
      marginTop: 20,
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: settings.primaryColor || '#000000',
      paddingBottom: 5,
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 5,
    },
    tableCol: {
      flex: 1,
    },
    tableColHeader: {
      flex: 1,
      fontFamily: 'Helvetica-Bold',
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
    totals: {
      marginTop: 20,
      alignItems: 'flex-end',
    },
  });

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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {settings.logo && (
              <Image src={settings.logo} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{settings.name}</Text>
            {settings.address && <Text style={styles.value}>{settings.address}</Text>}
            {settings.email && <Text style={styles.value}>{settings.email}</Text>}
            {settings.phone && <Text style={styles.value}>{settings.phone}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.value}>Date: {formatDate(invoice.createdAt)}</Text>
            <Text style={styles.value}>Invoice #: {invoice.id.slice(0, 8)}</Text>
            <Text style={styles.value}>Status: {invoice.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text style={styles.value}>{clientName}</Text>
          {client?.email && <Text style={styles.value}>{client.email}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColHeader}>Project/Task</Text>
            <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Hours</Text>
            <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Amount</Text>
          </View>
          
          {invoiceProjects.map(project => (
            <React.Fragment key={project.id}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, { fontFamily: 'Helvetica-Bold' }]}>{project.name}</Text>
                <Text style={styles.tableCol}></Text>
                <Text style={styles.tableCol}></Text>
              </View>
              {project.tasks.map(task => (
                <View style={styles.tableRow} key={task.id}>
                  <Text style={styles.tableCol}>  • {task.description}</Text>
                  <Text style={[styles.tableCol, { textAlign: 'right' }]}>{task.hours}</Text>
                  <Text style={[styles.tableCol, { textAlign: 'right' }]}>
                    {formatCurrency(task.hours)}
                  </Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { textAlign: 'right' }]}>Total:</Text>
            <Text style={[styles.tableCol, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
              {formatCurrency(invoice.totalAmount)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {settings.invoiceNotes || "Thank you for your business."}
          {settings.bankAccount && `\nBank Account: ${settings.bankAccount}`}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

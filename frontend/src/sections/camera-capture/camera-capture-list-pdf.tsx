import type { IPatientRegistrationItem } from 'src/types/patient-registration';

import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import ReportHeader from 'src/components/report-header';
import { FormatDateString } from 'src/components/format-date-time';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    padding: 20,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerCenter: {
    position: 'absolute',
    left: '50%',
    width: 200,
    marginLeft: -100,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 10,
  },
  pageNumber: {
    fontSize: 8,
    textAlign: 'right',
    width: 80,
  },
  secondHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#e5e7eb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    fontSize: 10,
    paddingVertical: 4,
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    flexWrap: 'wrap',
  },
  tableCol: {
    paddingHorizontal: 3,
    wordBreak: 'break-word',
    flexWrap: 'wrap',
  },
  headerText: {
    fontWeight: 'bold',
  },
});

const TABLE_HEAD = [
  { label: 'Sr No.', width: '5%' },
  { label: 'Reg Date', width: '12%' },
  { label: 'Patient Id', width: '10%' },
  { label: 'Patient Name', width: '20%' },
  { label: 'Mobile No', width: '13%' },
  { label: 'Address', width: '15%' },
  { label: 'Hospital Dr.', width: '12%' },
  { label: 'Ref. Dr.', width: '13%' },
];

const TableHeader = () => (
  <View fixed style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
    {TABLE_HEAD.map((col, idx) => (
      <View key={idx} style={[styles.tableCol, { width: col.width }]}>
        <Text style={styles.headerText}>{col.label}</Text>
      </View>
    ))}
  </View>
);

interface Props {
  patientListReport: IPatientRegistrationItem[];
}

export function PatientListPDF({ patientListReport }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Page Header */}
        <ReportHeader
          reportTitle=""
          visibleFields={{
            name: true,
            address: true,
            pagination: true,
          }}
          borderStyle="none"
        />

        {/* Section Title */}
        <View fixed style={styles.secondHeader}>
          <Text>Patient List</Text>
        </View>

        {/* Table Header (fixed so it appears on each page) */}
        <TableHeader />

        {/* Table Body */}
        {patientListReport.map((row, index) => (
          <View key={index} style={styles.tableRow} wrap={false}>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text>{index + 1}</Text>
            </View>
            <View style={[styles.tableCol, { width: '12%' }]}>
              <Text>{FormatDateString(row?.createdAt) || '—'}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text>{row?.uhid || '—'}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text>
                {`${row?.firstName || ''} ${row?.middleName || ''} ${row?.lastName || ''}`.trim()}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '13%' }]}>
              <Text>{row?.mobile || '—'}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text>
                {[
                  row?.address,
                  row?.area,
                  row?.city,
                  row?.state && row?.pin ? `${row.state}-${row.pin}` : row?.state || row?.pin,
                  row?.nationality,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '12%' }]}>
              <Text>{`${row?.hospitalDoctor}` || '—'}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}

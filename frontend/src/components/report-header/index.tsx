import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

import { getPreviewImage } from 'src/utils/compressImage';

import { getHospitalReportConfiguration } from 'src/actions/hospita-info';

import { FormatDateTimeIST } from '../format-date-time';

/* ---------- Types ---------- */

export type VisibleFields = {
  name?: boolean;
  logo?: boolean;
  address?: boolean;
  phone?: boolean;
  mobile?: boolean;
  email?: boolean;
  website?: boolean;
  date?: boolean;
  pagination?: boolean;
  rohiniId?: boolean;
  gst?: boolean;
};

export type BorderStyle = 'none' | 'box' | 'underline';

export interface ReportHeaderProps {
  reportTitle?: string;
  visibleFields?: VisibleFields;
  borderStyle?: BorderStyle;
  topMargin?: number;
}

/* ---------- Default visible fields all false except date & pagination ---------- */
const defaultVisibleFields: VisibleFields = {
  name: false,
  logo: false,
  address: false,
  phone: false,
  mobile: false,
  email: false,
  website: false,
  date: true,
  pagination: true,
  rohiniId: false,
  gst: false,
};

/* ---------- ReportHeader Component ---------- */
const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportTitle,
  visibleFields = {},
  borderStyle = 'none',
  topMargin = 0,
}) => {
  // Use prop data if provided, otherwise get from global config
  const hospitalData = getHospitalReportConfiguration();

  if (!hospitalData?.hospital) return null;
  const fields = { ...defaultVisibleFields, ...visibleFields };
  const { hospital: data, style } = hospitalData;

  const contactLine = [
    fields.phone && data?.phone && `Ph : ${data.phone}`,
    fields.mobile && data?.mobile && `Ph2 : ${data.mobile}`,
    fields.email && data?.email && `Email : ${data.email}`,
    fields.website && data?.website && `Web : ${data.website}`,
  ]
    .filter(Boolean)
    .join('  |  ');

  const allowedWeights = [
    'bold',
    'thin',
    'hairline',
    'ultralight',
    'extralight',
    'light',
    'normal',
    'medium',
    'semibold',
    'demibold',
    'ultrabold',
    'extrabold',
    'heavy',
    'black',
  ] as const;

  type AllowedWeight = (typeof allowedWeights)[number];

  const safeFontWeight: AllowedWeight = allowedWeights.includes(
    style.fontWeightHospital as AllowedWeight
  )
    ? (style.fontWeightHospital as AllowedWeight)
    : 'bold';

  const border =
    borderStyle === 'box'
      ? { border: '1px solid black', padding: 4 }
      : borderStyle === 'underline'
        ? { borderBottom: '1px solid black', padding: 4 }
        : {};

  return (
    <>
      <View style={[styles.root, border]} fixed>
        <View style={styles.centerOverlay}>
          {fields.logo && data.logo && (
            <Image
              src={getPreviewImage(data.logo)}
              style={{
                maxWidth: '100%',
                maxHeight: 75,
                marginBottom: 2,
                alignSelf: 'center',
                objectFit: 'contain',
              }}
            />
          )}

          {fields.name && data?.name && (
            <Text
              style={{
                fontSize: style.fontSizeHospital ?? 14,
                fontWeight: safeFontWeight,
                color: style.primaryColor ?? '#000',
              }}
            >
              {data?.name || '-'}
            </Text>
          )}

          {reportTitle && reportTitle !== '' && (
            <Text
              style={{
                fontSize: style.fontSizeReport ?? 12,
                fontWeight: safeFontWeight,
                marginTop: 3,
                marginBottom: 2,
                color: style.primaryColor ?? '#000',
              }}
            >
              {reportTitle}
            </Text>
          )}

          {fields.address && data.address && (
            <View style={styles.addressContainer}>
              <Text
                style={{
                  fontSize: style.fontSizeContact ?? 7,
                  marginTop: 1,
                  color: style.primaryColor ?? '#000',
                  textAlign: 'center',
                }}
              >
                {data?.address || '-'}
              </Text>
            </View>
          )}

          {contactLine && (
            <Text
              style={{
                fontSize: style.fontSizeContact ?? 7,
                marginTop: 1,
                color: style.primaryColor ?? '#000',
              }}
            >
              {contactLine}
            </Text>
          )}
        </View>

        {/* Meta info in top-right */}
        <View style={styles.meta}>
          {fields.date && (
            <Text
              style={{
                fontSize: style.fontSizeMeta ?? 6,
                margin: 2,
                color: style.primaryColor ?? '#000',
              }}
            >
              {FormatDateTimeIST(new Date().toISOString())}
            </Text>
          )}

          {fields.pagination && (
            <Text
              style={{
                fontSize: style.fontSizeMeta ?? 6,
                margin: 2,
                color: style.primaryColor ?? '#000',
              }}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          )}

          {fields.rohiniId && data.rohiniid && (
            <Text
              style={{
                fontSize: style.fontSizeMetaBold ?? 8,
                fontWeight: safeFontWeight,
                margin: 2,
                color: style.primaryColor ?? '#000',
              }}
            >
              Rohini Id : {data.rohiniid}
            </Text>
          )}
        </View>

        {/* Meta info in bottom-right (GST) */}
        <View style={styles.gstmeta}>
          {fields.gst && (
            <Text
              style={{
                fontSize: style.fontSizeMetaBold ?? 12,
                fontWeight: safeFontWeight,
                margin: 2,
                color: style.primaryColor ?? '#000',
                textAlign: 'right',
              }}
            >
              GST: {data.gst}
            </Text>
          )}
        </View>
      </View>

      {/* Spacer below header */}
      <View style={{ height: topMargin }} />
    </>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
    justifyContent: 'center',
  },
  centerOverlay: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 1,
  },
  meta: {
    position: 'absolute',
    top: 0,
    right: 0,
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  gstmeta: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
  },
});

export default ReportHeader;

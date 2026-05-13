
import { useState } from 'react';

import { Box ,
  Dialog,
  useTheme,
  Checkbox,
  ImageList,
  Typography,
  DialogTitle,
  ImageListItem,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { useTimezone } from 'src/components/time-zone';
import CommonButton from 'src/components/common-button';

type Props = {
  isDisable?: boolean;
  captureImages?: any;
  myImages?: any;
};

export default function EndoScopyReportImage({ isDisable, captureImages, myImages }: Props) {
  const { value, onTrue, onFalse } = useBoolean(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [savedImages, setSavedImages] = useState<any[]>(myImages || []);
  const theme = useTheme();
  const { formatPlainDateTimeToDisplayDateTime } = useTimezone();

  console.log('Received captureImages prop:', captureImages);

  const handleSelectImage = (capture: any) => {
    const exists = selectedImages.find((img) => img.imagePath === capture.imagePath);

    if (exists) {
      setSelectedImages((prev) => prev.filter((img) => img.imagePath !== capture.imagePath));
    } else {
      setSelectedImages((prev) => [...prev, capture]);
    }
  };

  const handleSaveImages = () => {
    setSavedImages(selectedImages);
    onFalse();
  };

  const handleRemoveImage = (imagePath: string) => {
    setSavedImages((prev) => prev.filter((img) => img.imagePath !== imagePath));
  };

  const handleClearAll = () => {
    setSavedImages([]);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'rgba(217, 217, 217, 0.5)',
          padding: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              Selected Images : {savedImages?.length || 0}
            </Typography>
          </Box>
          <Box>
            <CommonButton
              variant="contained"
              sx={{
                backgroundColor: 'rgba(63, 84, 115, 1)',
                fontSize: '13px',
                width: 'auto',
                height: '28px',
                '&:hover': {
                  backgroundColor: 'rgba(63, 84, 115, 1)',
                },
              }}
              onClick={onTrue}
            >
              Select Img
            </CommonButton>
          </Box>
        </Box>
        <Box
          sx={{
            border: '2px solid black',
            p: 1,
            backgroundColor: '#fff',
          }}
        >
          <ImageList cols={3} gap={4} sx={{ overflowY: 'auto', maxHeight: 370, m: 0 }}>
            {myImages &&
              myImages.length > 0 &&
              myImages.map((capture: any, index: number) => (
                <ImageListItem
                  key={index}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: 0.5,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    onClick={() => handleRemoveImage(capture.imagePath)}
                  >
                    <Iconify icon="eva:close-fill" width={16} height={16} />
                  </Box>
                  <img
                    src={`${CONFIG.site.serverUrl}/uploads/${capture?.imagePath}`}
                    alt={`Report Image ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 70,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontSize: 9,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      px: 0.5,
                      lineHeight: '18px',
                      background: 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {capture?.capturedAt
                      ? formatPlainDateTimeToDisplayDateTime(capture.capturedAt)
                      : 'Unknown time'}
                  </Typography>
                </ImageListItem>
              ))}
          </ImageList>
        </Box>
      </Box>

      <Dialog open={value} onClose={onFalse} fullWidth maxWidth="md">
        <DialogTitle
          id="indoor-registarion-relative-form-title"
          sx={{
            position: 'sticky',
            zIndex: 10000,
            top: 0,
            width: '100%',
            backgroundColor: '#E5F0FF',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(26, 59, 110, 0.1)',
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Select Images
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box paddingY={2}>
            <ImageList cols={3} gap={4} sx={{ overflowY: 'auto', maxHeight: 370, m: 0 }}>
              {captureImages && captureImages.length > 0 ? (
                captureImages.map((capture, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => handleSelectImage(capture)}
                    sx={{
                      border: selectedImages.find((img) => img.imagePath === capture.imagePath)
                        ? '3px solid #1976d2'
                        : '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: '0.2s',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        zIndex: 10,
                        background: '#fff',
                        borderRadius: '50%',
                      }}
                    >
                      <Checkbox
                        checked={
                          !!selectedImages.find((img) => img.imagePath === capture.imagePath)
                        }
                      />
                    </Box>

                    <img
                      src={`${CONFIG.site.serverUrl}/uploads/${capture?.imagePath}`}
                      alt="Report"
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                      }}
                    />
                  </ImageListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                  No images available for this session.
                </Typography>
              )}
            </ImageList>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

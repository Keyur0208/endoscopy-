import type { Path, Control, FieldValues } from 'react-hook-form';

import JoditEditor from 'jodit-react';
import { useRef, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export type JoditToolbarPreset = 'basic' | 'standard' | 'advanced' | 'full';

interface JoditEditorComponentProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  toolbar?: JoditToolbarPreset | string | string[];
  placeholder?: string;
  height?: number | string;
  disabled?: boolean;
  config?: any;
  defaultValue?: string;
}

// ----------------------------------------------------------------------

const TOOLBAR_PRESETS: Record<JoditToolbarPreset, string> = {
  basic: 'bold,italic,underline,|,ul,ol,|,link,|,undo,redo,|,lineHeight',

  standard:
    'bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,|,link,|,align,|,lineHeight,|,undo,redo',

  advanced:
    'bold,italic,underline,strikethrough,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,table,link,|,align,undo,redo,|,lineHeight,hr,copyformat,|,fullsize,print',

  full: 'source,|,bold,italic,underline,strikethrough,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,table,link,|,align,undo,redo,|,hr,eraser,copyformat,|,fullsize,print,preview,|,selectall,cut,copy,paste,|,find,|,print,|,lineHeight',
};

// ----------------------------------------------------------------------

export default function JoditEditorComponent<T extends FieldValues>({
  name,
  control,
  toolbar = 'standard',
  placeholder = 'Start typing...',
  height = 400,
  disabled = false,
  config: customConfig,
  defaultValue = '',
}: JoditEditorComponentProps<T>) {
  const editorRef = useRef(null);

  const toolbarButtons = useMemo(() => {
    if (Array.isArray(toolbar)) {
      return toolbar;
    }
    if (typeof toolbar === 'string' && toolbar in TOOLBAR_PRESETS) {
      return TOOLBAR_PRESETS[toolbar as JoditToolbarPreset];
    }
    return toolbar;
  }, [toolbar]);

  const editorConfig = useMemo(
    () => ({
      readonly: disabled,
      placeholder,
      height,
      buttons: toolbarButtons,
      buttonsMD: toolbarButtons,
      buttonsSM: toolbarButtons,
      buttonsXS: toolbarButtons,
      uploader: {
        insertImageAsBase64URI: true,
      },
      removeButtons: [],
      disablePlugins: disabled ? 'all' : '',
      toolbarAdaptive: true,
      toolbarSticky: true,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      defaultActionOnPaste: 'insert_as_html',
      enter: 'P' as const,
      spellcheck: true,
      ...customConfig,
    }),
    [disabled, placeholder, height, toolbarButtons, customConfig]
  );

  return (
    <Box
      sx={{
        '& .jodit-container': {
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.lighter}`,
          },
        },
        '& .jodit-toolbar': {
          backgroundColor: 'background.neutral',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        '& .jodit-toolbar-button': {
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
        '& .jodit-wysiwyg': {
          minHeight: typeof height === 'number' ? `${height}px` : height,
          color: 'text.primary',
          backgroundColor: 'background.paper',
          padding: (theme) => theme.spacing(2),
          fontFamily: (theme) => theme.typography.fontFamily,
          fontSize: (theme) => theme.typography.body1.fontSize,
          '& p': {
            lineHeight: '2.0',
            marginBottom: (theme) => theme.spacing(2),
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            lineHeight: 1.5,
            marginTop: (theme) => theme.spacing(2),
            marginBottom: (theme) => theme.spacing(1.5),
          },
          '& ul, & ol': {
            marginBottom: (theme) => theme.spacing(2),
            paddingLeft: (theme) => theme.spacing(3),
          },
          '& li': {
            lineHeight: '2.0',
            marginBottom: (theme) => theme.spacing(1),
          },
          '& div': {
            lineHeight: '2.0',
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: (theme) => theme.spacing(2),
            '& td, & th': {
              border: (theme) => `1px solid ${theme.palette.divider}`,
              padding: (theme) => theme.spacing(1),
              lineHeight: 1.8,
            },
          },
        },
        '& .jodit-status-bar': {
          backgroundColor: 'background.neutral',
          color: 'text.secondary',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          fontSize: (theme) => theme.typography.caption.fontSize,
        },
        '& .jodit-placeholder': {
          color: 'text.disabled',
          fontStyle: 'italic',
        },
      }}
    >
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as any}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <JoditEditor
              ref={editorRef}
              value={value || ''}
              config={editorConfig as any}
              onBlur={(newContent) => onChange(newContent)}
              onChange={() => {}}
            />
            {error && (
              <Typography
                component="small"
                sx={{ color: 'error.main', fontSize: 'small', mt: 0.5 }}
              >
                {error.message}
              </Typography>
            )}
          </>
        )}
      />
    </Box>
  );
}

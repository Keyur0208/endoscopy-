// BarcodeGenerator.tsx
import JsBarcode from 'jsbarcode';
import React, { useRef, useEffect } from 'react';

interface BarcodeGeneratorProps {
  value: string;
  format?: string;
  onGenerated: (dataUrl: string) => void;
}

export default function BarcodeGenerator({
  value,
  format = 'CODE39',
  onGenerated,
}: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      JsBarcode(canvasRef.current, value, {
        format,
        lineColor: '#000',
        width: 2,
        height: 100,
        displayValue: false,
        fontOptions: 'bold',
        font: 'monospace',
        fontSize: 18,
        margin: 10,
      });
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onGenerated(dataUrl);
    }
  }, [value, format, onGenerated]);

  // Render hidden canvas
  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
}
